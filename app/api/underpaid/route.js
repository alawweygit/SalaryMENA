import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, monthlySalary, experience, seniority, save } = body;

    if (save) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS salaries (
          id SERIAL PRIMARY KEY, job_title TEXT, seniority TEXT, company_type TEXT, company_name TEXT,
          country TEXT, city TEXT, monthly_salary NUMERIC, basic_salary NUMERIC, currency TEXT,
          bonus NUMERIC, experience TEXT, education TEXT, nationality_type TEXT, gender TEXT, email TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      await pool.query(
        `INSERT INTO salaries (job_title, seniority, country, monthly_salary, currency, experience)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [jobTitle, seniority, country, monthlySalary, currency, experience]
      );
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
      messages: [{
        role: 'user',
        content: `You are a MENA salary expert. Search online including Reddit, Glassdoor, and salary sites to find current market salary data for this role and provide a market analysis.

Job Title: ${jobTitle}
Seniority: ${seniority}
Country: ${country}
Currency: ${currency}
Years of Experience: ${experience}
Their Current Salary: ${currency} ${monthlySalary}/month

Respond with ONLY a JSON object, no other text:
{
  "verdict": "Below Market",
  "verdictColor": "#ef4444",
  "marketLow": 15000,
  "marketMedian": 25000,
  "marketHigh": 40000,
  "userPercentile": 45,
  "summary": "2-3 sentences about the market for this role",
  "advice": "1-2 sentences of specific advice"
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
