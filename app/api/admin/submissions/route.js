import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('pw') !== ADMIN_PASSWORD) return unauthorized();

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, job_title, job_title_en, job_title_ar, company_name, company_type, country, city,
       monthly_salary, basic_salary, currency, bonus, seniority, experience, education,
       nationality_type, gender, email, housing_provided, car_provided, source, created_at
       FROM salaries WHERE is_seed = FALSE ORDER BY created_at DESC`
    );
    return Response.json({ records: result.rows });
  } finally {
    client.release();
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('pw') !== ADMIN_PASSWORD) return unauthorized();

  const body = await request.json();
  const { id } = body;
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM salaries WHERE id = $1 AND is_seed = FALSE`, [id]);
    return Response.json({ success: true });
  } finally {
    client.release();
  }
}
