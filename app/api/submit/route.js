import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL });

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS salaries (
      id SERIAL PRIMARY KEY,
      job_title TEXT, seniority TEXT, company_type TEXT, company_name TEXT,
      country TEXT, city TEXT, monthly_salary NUMERIC, basic_salary NUMERIC,
      currency TEXT, bonus NUMERIC, experience TEXT, education TEXT,
      nationality_type TEXT, gender TEXT, email TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function POST(req) {
  try {
    await initDB();
    const body = await req.json();
    const { jobTitle, seniority, companyType, companyName, country, city,
      monthlySalary, basicSalary, currency, bonus, experience, education,
      nationalityType, gender, email } = body;

    await pool.query(
      `INSERT INTO salaries (job_title,seniority,company_type,company_name,country,city,monthly_salary,basic_salary,currency,bonus,experience,education,nationality_type,gender,email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [jobTitle,seniority,companyType,companyName,country,city,
       monthlySalary||null,basicSalary||null,currency,bonus||null,
       experience,education,nationalityType,gender,email]
    );

    // Send confirmation email in background
    if (email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://salarymena.com'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, jobTitle, country, monthlySalary, currency })
      }).catch(err => console.error('Email error:', err));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}