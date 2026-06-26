import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';
import { Resend } from 'resend';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });
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
          html: `
            <div style="font-family:Inter,sans-serif;background:#0a0a0f;color:#ffffff;padding:32px;max-width:600px;margin:0 auto;border-radius:16px;">
              <div style="margin-bottom:24px;display:flex;align-items:center;gap:12px;">
                <img src="https://salarymena.com/logo-email.png" width="44" height="44" alt="SalaryMENA logo" style="border-radius:8px;"/>
                <div>
                  <span style="font-size:20px;font-weight:900;color:#ffffff;">Salary</span><span style="font-size:20px;font-weight:900;color:#8b5cf6;">MENA</span>
                </div>
              </div>
              <h1 style="font-size:22px;font-weight:800;margin-bottom:8px;">New salary added for your field 🔔</h1>
              <p style="color:#a0a0b0;font-size:15px;line-height:1.7;margin-bottom:24px;">A new <strong style="color:#fff">${jobTitleEn}</strong> salary was just submitted in <strong style="color:#fff">${country}</strong> — similar to your role.</p>
              <a href="https://salarymena.com/explore" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 24px;font-weight:700;font-size:14px;margin-bottom:24px;">See the new salary →</a>
              <div style="border-top:1px solid #1e1e2e;padding-top:20px;">
                <p style="color:#404050;font-size:12px;margin:0;">© 2026 SalaryMENA · <a href="https://salarymena.com" style="color:#6366f1;text-decoration:none;">salarymena.com</a></p>
              </div>
            </div>
          `
        });
      } catch(e) {
        console.error('Alert email error:', e);
      }
    }
  } catch(e) {
    console.error('Trigger alerts error:', e);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, monthlySalary, experience, companyType, nationalityType, housingProvided, carProvided, lang } = body;

    // Translate + categorize in parallel
    let jobTitleAr = null;
    let jobTitleEn = jobTitle;
    let category = null;
    try {
      const [arMsg, enMsg, catMsg] = await Promise.all([
        client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 50,
          messages: [{ role: 'user', content: 'Translate this job title to Arabic. Reply with ONLY the Arabic translation, nothing else: ' + jobTitle }]
        }),
        client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 50,
          messages: [{ role: 'user', content: 'Translate this job title to English. Reply with ONLY the English translation, nothing else: ' + jobTitle }]
        }),
        client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 20,
          messages: [{ role: 'user', content: `Categorize this job title into ONE simple career category (examples: agriculture, technology, healthcare, finance, education, sales, marketing, engineering, legal, logistics, hospitality, construction, government, media). Reply with ONLY the single category word, nothing else: ${jobTitle}` }]
        })
      ]);
      jobTitleAr = arMsg.content[0].text.trim();
      jobTitleEn = enMsg.content[0].text.trim();
      category = catMsg.content[0].text.trim().toLowerCase();
    } catch(e) {
      console.error('Translation error:', e);
    }

    // Save to DB
    await pool.query(
      `INSERT INTO salaries (job_title, job_title_ar, job_title_en, company_type, country, monthly_salary, currency, experience, nationality_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [jobTitle, jobTitleAr, jobTitleEn, companyType || null, country, monthlySalary || null, currency, experience, nationalityType || null]
    ).catch(err => console.error('Underpaid DB save error:', err));

    // Trigger alerts
    if (category) await triggerAlerts(jobTitleEn, country, category);

    const benefits = [housingProvided && 'free housing', carProvided && 'a company car'].filter(Boolean).join(' and ');
    const isArabic = lang === 'ar';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a salary market analyst for the MENA region.
${isArabic ? 'IMPORTANT: Respond with all text fields in Arabic language.' : ''}

CRITICAL CONTEXT:
- Expats earn considerably less than GCC nationals/local citizens for identical roles
- Government sector pays differently from private sector
- Factor in any benefits when assessing total package

Profile:
- Job Title: ${jobTitle}
- Country: ${country}
- Nationality Type: ${nationalityType}
- Company Type: ${companyType || 'Not specified'}
- Years of Experience: ${experience}
- Current Monthly Salary: ${currency} ${monthlySalary}
- Benefits: ${benefits || 'None'}

Respond with ONLY a valid JSON object, no markdown:
{
  "verdict": "${isArabic ? 'عادل OR أقل من السوق OR أعلى من السوق' : 'Fair OR Below Market OR Above Market'}",
  "verdictColor": "#10b981",
  "marketLow": 8000,
  "marketMedian": 12000,
  "marketHigh": 16000,
  "summary": "${isArabic ? 'تحليل عربي للراتب مقارنة بالسوق (2-3 جمل)' : '2-3 sentences analyzing this salary vs market'}",
  "advice": "${isArabic ? 'نصيحة عربية للموظف (جملة واحدة)' : 'One sentence of advice for the employee'}"
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