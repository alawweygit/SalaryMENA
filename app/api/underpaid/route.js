import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, monthlySalary, experience, companyType, nationalityType, housingProvided, carProvided } = body;

    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS salaries (
          id SERIAL PRIMARY KEY, job_title TEXT, seniority TEXT, company_type TEXT, company_name TEXT,
          country TEXT, city TEXT, monthly_salary NUMERIC, basic_salary NUMERIC, currency TEXT,
          bonus NUMERIC, experience TEXT, education TEXT, nationality_type TEXT, gender TEXT, email TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      await pool.query(
        `INSERT INTO salaries (job_title, company_type, country, monthly_salary, currency, experience, nationality_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [jobTitle, companyType, country, monthlySalary, currency, experience, nationalityType]
      );
    } catch(dbErr) { console.error('DB error:', dbErr); }

    const benefits = [housingProvided && 'free housing', carProvided && 'a company car'].filter(Boolean).join(' and ');
    const benefitsNote = benefits ? `The employee also receives ${benefits} as part of their package.` : '';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
      messages: [{
        role: 'user',
        content: `You are a MENA compensation expert. Research current market salary data for this specific profile and return MONTHLY salary figures only in ${currency}.

CRITICAL CONTEXT:
- Expats (Arab, Asian, Western) earn SIGNIFICANTLY less than local nationals/GCC citizens for the same role
- Government sector pays differently from private sector
- Always search for expat-specific salary data when nationality type is expat
- When benefits like housing or car are included, factor them into your verdict — a lower cash salary with housing included can be equal to or better than a higher cash salary without housing

Profile:
- Job Title: ${jobTitle}
- Country: ${country}
- Nationality Type: ${nationalityType}
- Company Type: ${companyType}
- Years of Experience: ${experience}
- Their Current Monthly Salary: ${currency} ${monthlySalary}
- Additional Benefits: ${benefits || 'None'}

${benefitsNote}

Search specifically for "${jobTitle} salary ${country} ${nationalityType} ${new Date().getFullYear()}" to find accurate benchmarks.

RULES:
1. If nationality is any type of Expat, use EXPAT salary benchmarks only
2. If company type is Government, use government sector benchmarks
3. All figures must be MONTHLY in ${currency}
4. If housing is provided, mention this explicitly in your summary — a fair cash salary WITH housing is actually a GOOD total package
5. If car is provided, mention this in your summary as well
6. Be realistic and accurate

Respond with ONLY a valid JSON object, no markdown, no extra text:
{
  "verdict": "Fair",
  "verdictColor": "#10b981",
  "marketLow": 400,
  "marketMedian": 550,
  "marketHigh": 750,
  "difference": 0,
  "summary": "2-3 sentences about the monthly salary market for this specific profile, explicitly mentioning housing/car benefits if provided and how they affect the overall package value",
  "advice": "1-2 sentences of specific actionable advice"
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