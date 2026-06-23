import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const level = searchParams.get('level');
    const company = searchParams.get('company');

    let query = `SELECT id, job_title as title, job_title_ar, job_title_en, seniority, company_type as company, company_name,
                  country, city, monthly_salary as "monthlySalary", currency, bonus, experience, education
                 FROM salaries
                 WHERE monthly_salary IS NOT NULL`;
    const params = [];

    if (country) { params.push(country); query += ` AND country = $${params.length}`; }
    if (level) { params.push(level); query += ` AND seniority = $${params.length}`; }
    if (company) { params.push(company); query += ` AND company_type = $${params.length}`; }

    query += ` ORDER BY created_at DESC LIMIT 200`;

    const result = await pool.query(query, params);
    return Response.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, data: [], error: error.message }, { status: 500 });
  }
}
