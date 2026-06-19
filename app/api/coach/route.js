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
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an expert salary negotiation coach for the MENA region with deep knowledge of compensation across UAE, Saudi Arabia, Egypt, Oman, Kuwait, Qatar, Bahrain, Jordan, Lebanon and all Arab countries.

CRITICAL CONTEXT — MENA salaries differ significantly by nationality:
- Expats (Arab, Asian, Western) earn considerably less than GCC nationals/local citizens for identical roles
- Government sector compensation differs greatly from private sector
- When benefits like housing or car are included, they significantly increase the total package value — factor this into your assessment

Profile:
- Job Title: ${jobTitle}
- Country: ${country}
- Nationality Type: ${nationalityType}
- Company Type: ${companyType || 'Not specified'}
- Years of Experience: ${experience}
- Current Salary: ${currentSalary ? currency + ' ' + currentSalary + '/month' : 'Not disclosed'}
- Offered Salary: ${currency} ${offeredSalary}/month
- Additional Benefits: ${benefits || 'None'}

${benefitsNote}

Based on your knowledge of MENA salary markets for ${nationalityType} professionals in ${country}, provide:
1. A clear verdict on whether this offer is below market, fair, or above market — factoring in any housing or car benefits as part of the total package value
2. A brief market assessment using realistic figures for ${nationalityType} in ${country}, mentioning how the benefits affect the total package
3. A word-for-word negotiation script they can use with HR
4. 3 specific talking points to strengthen their position
5. A realistic counter offer range based on ${nationalityType} market rates

Use these exact section headers on their own line:
VERDICT
MARKET ASSESSMENT
YOUR NEGOTIATION SCRIPT
3 TALKING POINTS
RECOMMENDED COUNTER OFFER

Be specific, direct, and practical. Give real numbers appropriate for ${nationalityType} in ${country}.`
      }]
    });

    return Response.json({ text: message.content[0].text });
  } catch (error) {
    console.error(error);
    return Response.json({ text: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}