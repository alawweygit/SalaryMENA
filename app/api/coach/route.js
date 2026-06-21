import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, currentSalary, offeredSalary, experience, companyType, nationalityType, housingProvided, carProvided } = body;

    pool.query(
      `INSERT INTO salaries (job_title, company_type, country, monthly_salary, currency, experience, nationality_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [jobTitle, companyType || null, country, offeredSalary || currentSalary || null, currency, experience, nationalityType || null]
    ).catch(err => console.error('Coach DB save error:', err));

    const benefits = [housingProvided && 'free housing', carProvided && 'a company car'].filter(Boolean).join(' and ');
    const benefitsNote = benefits ? `The offer also includes ${benefits} as part of the package.` : '';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are an expert salary negotiation coach for the MENA region.

CRITICAL CONTEXT:
- Expats earn considerably less than GCC nationals/local citizens for identical roles
- Government sector compensation differs greatly from private sector
- When benefits like housing or car are included, factor them into total package value

Profile:
- Job Title: ${jobTitle}
- Country: ${country}
- Nationality Type: ${nationalityType}
- Company Type: ${companyType || 'Not specified'}
- Years of Experience: ${experience}
- Current Salary: ${currentSalary ? currency + ' ' + currentSalary + '/month' : 'Not disclosed'}
- Offered Salary: ${currency} ${offeredSalary}/month
- Additional Benefits: ${benefits || 'None — do NOT suggest or mention housing or car allowances unless they are listed here'}
${benefitsNote}

Respond with ONLY a valid JSON object, no markdown, no extra text:
{
  "verdict": "Fair",
  "verdictColor": "#10b981",
  "verdictIcon": "✅",
  "marketLow": 8000,
  "marketMedian": 12000,
  "marketHigh": 16000,
  "difference": 500,
  "differencePercent": 4,
  "summary": "2-3 sentences about this offer vs market for this nationality/company type",
  "talkingPoints": [
    "Talking point 1 to use in negotiation",
    "Talking point 2 to use in negotiation",
    "Talking point 3 to use in negotiation"
  ],
  "counterOffer": 13000,
  "script": "A short 2-3 sentence word-for-word script to say to HR"
}`
      }]
    });

    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent) throw new Error('No text response');
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const data = JSON.parse(jsonMatch[0]);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}