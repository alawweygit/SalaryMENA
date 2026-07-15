import Anthropic from '@anthropic-ai/sdk';
import { getPool } from '../../lib/db';
import { Resend } from 'resend';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = getPool();
const resend = new Resend(process.env.RESEND_API_KEY);

async function triggerAlerts(jobTitleEn, country, category) {
  try {
    const subscribers = await pool.query(
      `SELECT DISTINCT email FROM salary_alerts WHERE country = $1 AND category = $2`,
      [country, category]
    );
    for (const row of subscribers.rows) {
      try {
        await resend.emails.send({
          from: 'SalaryMENA <support@cvdropai.com>',
          to: row.email,
          subject: `New ${jobTitleEn} salary added in ${country} — SalaryMENA`,
          html: `<div style="font-family:Inter,sans-serif;background:#0a0a0f;color:#ffffff;padding:32px;max-width:600px;margin:0 auto;border-radius:16px;"><h1 style="font-size:22px;font-weight:800;margin-bottom:8px;">New salary added for your field 🔔</h1><p style="color:#a0a0b0;font-size:15px;line-height:1.7;margin-bottom:24px;">A new <strong style="color:#fff">${jobTitleEn}</strong> salary was just submitted in <strong style="color:#fff">${country}</strong>.</p><a href="https://salarymena.com/explore" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 24px;font-weight:700;font-size:14px;">See the new salary →</a></div>`
        });
      } catch(e) { console.error('Alert email error:', e); }
    }
  } catch(e) { console.error('Trigger alerts error:', e); }
}

const rateMap = new Map();
const savedIPsCoach = new Set();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    if (rateMap.size > 5000) rateMap.clear();
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return Response.json({ success: false, error: 'Too many requests. Please try again in an hour.' }, { status: 429 });
    }
    const body = await req.json();
    const { jobTitle, country, currency, offeredSalary, currentSalary, experience, companyType, nationalityType, lang } = body;

    let jobTitleAr = null;
    let jobTitleEn = jobTitle;
    let category = null;
    try {
      const [arMsg, enMsg, catMsg] = await Promise.all([
        client.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 50, messages: [{ role: 'user', content: 'Translate this job title to Arabic. Reply with ONLY the Arabic translation, nothing else: ' + jobTitle }] }),
        client.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 50, messages: [{ role: 'user', content: 'Translate this job title to English. Reply with ONLY the English translation, nothing else: ' + jobTitle }] }),
        client.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 20, messages: [{ role: 'user', content: `Categorize this job title into ONE simple career category. Reply with ONLY the single category word: ${jobTitle}` }] })
      ]);
      jobTitleAr = arMsg.content[0].text.trim();
      jobTitleEn = enMsg.content[0].text.trim();
      category = catMsg.content[0].text.trim().toLowerCase();
    } catch(e) { console.error('Translation error:', e); }

    if (!savedIPsCoach.has(ip)) {
      savedIPsCoach.add(ip);
      await pool.query(
        `INSERT INTO salaries (job_title, job_title_ar, job_title_en, company_type, country, monthly_salary, currency, experience, nationality_type, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [jobTitle, jobTitleAr, jobTitleEn, companyType || null, country, offeredSalary || currentSalary || null, currency, experience, nationalityType || null, 'coach']
      ).catch(err => console.error('Coach DB save error:', err));
    }


    const isArabic = lang === 'ar';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are an expert salary negotiation coach for the MENA region.
${isArabic ? 'IMPORTANT: Respond with all text fields in Arabic language.' : ''}
Profile:
- Job Title: ${jobTitle}
- Country: ${country}
- Nationality Type: ${nationalityType}
- Company Type: ${companyType || 'Not specified'}
- Years of Experience: ${experience}
- Offered Salary: ${currency} ${offeredSalary}
- Current Salary: ${currency} ${currentSalary}
Respond with ONLY a valid JSON object, no markdown:
{
  "verdict": "${isArabic ? 'أقل من السوق OR عادل OR أعلى من السوق' : 'Below Market OR Fair OR Above Market'}",
  "verdictColor": "#6366f1",
  "analysis": "${isArabic ? 'تحليل عربي (2-3 جمل)' : '2-3 sentence market analysis'}",
  "talkingPoints": ["point 1", "point 2", "point 3"],
  "script": "${isArabic ? 'نص التفاوض بالعربية' : 'Word-for-word negotiation script'}"
}`
      }]
    });

    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent) throw new Error('No text response');
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const data = JSON.parse(jsonMatch[0]);

    if (isArabic) {
      if (data.verdict === 'أقل من السوق') data.verdictColor = '#ef4444';
      else if (data.verdict === 'أعلى من السوق') data.verdictColor = '#10b981';
      else data.verdictColor = '#6366f1';
    } else {
      if (data.verdict === 'Below Market') data.verdictColor = '#ef4444';
      else if (data.verdict === 'Above Market') data.verdictColor = '#10b981';
      else data.verdictColor = '#6366f1';
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
