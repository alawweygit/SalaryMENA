import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, monthlySalary, experience, companyType, nationalityType, housingProvided, carProvided, lang } = body;

    // Save to DB with Arabic translation
    const translateJob = async () => {
      try {
        const msg = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 100,
          messages:[{role:'user',content:'Translate this job title to Arabic. Reply with ONLY the Arabic translation, nothing else: ' + jobTitle}]
        });
        return msg.content[0].text.trim();
      } catch(e) { return null; }
    };

    const jobTitleAr = await translateJob();

    pool.query(
      `INSERT INTO salaries (job_title, job_title_ar, company_type, country, monthly_salary, currency, experience, nationality_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [jobTitle, jobTitleAr, companyType || null, country, monthlySalary || null, currency, experience, nationalityType || null]
    ).catch(err => console.error('Underpaid DB save error:', err));

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

    // Fix verdict color
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