import { Pool } from 'pg';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      jobTitle, seniority, companyType, companyName, country, city,
      monthlySalary, basicSalary, currency, bonus, experience,
      education, nationalityType, gender, email, housingProvided, carProvided
    } = body;

    const result = await pool.query(
      `INSERT INTO salaries (job_title, job_title_ar, seniority, company_type, company_name, country, city,
        monthly_salary, basic_salary, currency, bonus, experience, education,
        nationality_type, gender, email, housing_provided, car_provided)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
      [
        jobTitle, null, seniority || null, companyType || null, companyName || null,
        country || null, city || null,
        monthlySalary ? Number(monthlySalary) : null,
        basicSalary ? Number(basicSalary) : null,
        currency || null,
        bonus ? Number(bonus) : null,
        experience || null, education || null, nationalityType || null,
        gender || null, email || null,
        housingProvided || false, carProvided || false
      ]
    );

    const savedId = result.rows[0].id;
    (async () => {
      try {
        const msg = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 100,
          messages:[{role:'user',content:'Translate this job title to Arabic. Reply with ONLY the Arabic translation, nothing else: ' + jobTitle}]
        });
        const arabic = msg.content[0].text.trim();
        await pool.query('UPDATE salaries SET job_title_ar = $1 WHERE id = $2', [arabic, savedId]);
        console.log('Translated:', jobTitle, '->', arabic);
      } catch(e) {
        console.error('Translation error:', e);
      }
    })();

    if (email) {
      try {
        await resend.emails.send({
          from: 'SalaryMENA <support@cvdropai.com>',
          to: email,
          subject: 'Your salary has been submitted — SalaryMENA',
          html: `
            <div style="font-family:Inter,sans-serif;background:#0a0a0f;color:#ffffff;padding:32px;max-width:600px;margin:0 auto;border-radius:16px;">
              <div style="margin-bottom:24px;display:flex;align-items:center;gap:12px;">
                <img src="https://salarymena.com/logo-email.png" width="44" height="44" alt="SalaryMENA logo" style="border-radius:8px;"/>
                <div>
                  <span style="font-size:20px;font-weight:900;color:#ffffff;">Salary</span><span style="font-size:20px;font-weight:900;color:#8b5cf6;">MENA</span>
                </div>
              </div>
              <h1 style="font-size:24px;font-weight:800;margin-bottom:8px;">Thank you! 🎉</h1>
              <p style="color:#a0a0b0;font-size:15px;line-height:1.7;margin-bottom:24px;">Your salary has been submitted anonymously and is now helping others in the MENA region know their worth.</p>
              <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="color:#606070;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">What you submitted</p>
                <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #2a2a3e;">
                  <div style="color:#a0a0b0;font-size:12px;margin-bottom:4px;">Role</div>
                  <div style="color:#ffffff;font-weight:600;font-size:15px;">${jobTitle}</div>
                </div>
                <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #2a2a3e;">
                  <div style="color:#a0a0b0;font-size:12px;margin-bottom:4px;">Country</div>
                  <div style="color:#ffffff;font-weight:600;font-size:15px;">${country}</div>
                </div>
                <div>
                  <div style="color:#a0a0b0;font-size:12px;margin-bottom:4px;">Monthly Salary</div>
                  <div style="color:#a78bfa;font-weight:800;font-size:18px;">${currency} ${Number(monthlySalary).toLocaleString()}</div>
                </div>
              </div>
              <a href="https://salarymena.com/explore" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 24px;font-weight:700;font-size:14px;margin-bottom:24px;">Explore Salaries →</a>
              <div style="border-top:1px solid #1e1e2e;padding-top:20px;">
                <p style="color:#404050;font-size:12px;margin:0;">© 2026 SalaryMENA · <a href="https://salarymena.com" style="color:#6366f1;text-decoration:none;">salarymena.com</a></p>
              </div>
            </div>
          `
        });
      } catch(e) {
        console.error('Email error:', e);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}