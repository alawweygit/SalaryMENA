import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, country, currency, currentSalary, offeredSalary, experience, seniority, companyType, nationalityType } = body;

    // Silently save to DB in background — don't await, don't block the AI response
    pool.query(
      `INSERT INTO salaries (job_title, seniority, company_type, country, monthly_salary, currency, experience, nationality_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [jobTitle, seniority, companyType || null, country, offeredSalary || currentSalary || null, currency, experience, nationalityType || null]
    ).catch(err => console.error('Coach DB save error:', err));

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an expert salary negotiation coach for the MENA region with deep knowledge of compensation across UAE, Saudi Arabia, Egypt, Oman, Kuwait, Qatar, Bahrain, Jordan, Lebanon and all Arab countries.

A professional has shared the following details:
- Job Title: ${jobTitle}
- Seniority: ${seniority}
- Country: ${country}
- Currency: ${currency}
- Years of Experience: ${experience}
- Company Type: ${companyType || 'Not specified'}
- Current Salary: ${currentSalary ? currency + ' ' + currentSalary + '/month' : 'Not disclosed'}
- Offered Salary: ${currency} ${offeredSalary}/month

Based on your knowledge of MENA salary markets, provide:
1. A clear verdict: is this offer below market, fair, or above market?
2. A brief market assessment for this role in this country
3. A word-for-word negotiation script they can use with HR
4. 3 specific talking points to strengthen their position
5. A realistic counter offer range

Use these exact section headers on their own line:
VERDICT
MARKET ASSESSMENT
YOUR NEGOTIATION SCRIPT
3 TALKING POINTS
RECOMMENDED COUNTER OFFER

Be specific, direct, and practical. Write in a warm professional tone. Give real numbers.`
      }]
    });

    return Response.json({ text: message.content[0].text });
  } catch (error) {
    console.error(error);
    return Response.json({ text: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}