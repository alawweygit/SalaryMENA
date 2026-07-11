import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const level = searchParams.get('level');
    const company = searchParams.get('company');
    const search = searchParams.get('search');

    let baseWhere = `WHERE monthly_salary IS NOT NULL`;
    const params = [];

    if (country) { params.push(country); baseWhere += ` AND country = $${params.length}`; }
    if (level) { params.push(level); baseWhere += ` AND seniority = $${params.length}`; }
    if (company) { params.push(company); baseWhere += ` AND company_type = $${params.length}`; }
    if (search) {
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      const n = params.length;
      baseWhere += ` AND (job_title ILIKE $${n-3} OR job_title_ar ILIKE $${n-2} OR job_title_en ILIKE $${n-1} OR country ILIKE $${n})`;
    }

    const fields = `id, job_title as title, job_title_ar, job_title_en, seniority,
                    company_type as company, company_name, country, city,
                    monthly_salary as "monthlySalary", currency, bonus, experience,
                    education, CASE WHEN is_seed THEN NULL ELSE nationality_type END as nationality_type,
                    gender, housing_provided, car_provided`;

    const hasFilter = search || country || level || company;

    let rows;
    if (hasFilter) {
      const result = await pool.query(`SELECT ${fields} FROM salaries ${baseWhere} ORDER BY created_at DESC`, params);
      rows = result.rows;
    } else {
      const realResult = await pool.query(
        `SELECT ${fields} FROM salaries ${baseWhere} AND is_seed = FALSE ORDER BY created_at DESC`,
        params
      );

      const gccResult = await pool.query(
        `SELECT ${fields} FROM salaries ${baseWhere} AND is_seed = TRUE AND country IN ('UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman') ORDER BY RANDOM()`,
        params
      );
      const nonGccResult = await pool.query(
        `SELECT ${fields} FROM salaries ${baseWhere} AND is_seed = TRUE AND country NOT IN ('UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman') ORDER BY RANDOM()`,
        params
      );
      const gcc = gccResult.rows;
      const nonGcc = nonGccResult.rows;
      const total = gcc.length + nonGcc.length;
      const nonGccCount = Math.floor(total * 0.10);
      const gccCount = total - nonGccCount;
      const seedRows = [...gcc.slice(0, gccCount), ...nonGcc.slice(0, nonGccCount)];

      rows = [...realResult.rows, ...seedRows];
    }

    return Response.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, data: [], error: error.message }, { status: 500 });
  }
}
