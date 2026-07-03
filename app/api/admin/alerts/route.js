import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });
const ADMIN_PASSWORD = '3146';

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('pw') !== ADMIN_PASSWORD) return unauthorized();

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, job_title, job_title_en, job_title_ar, country, category, created_at
       FROM salary_alerts ORDER BY created_at DESC`
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
    await client.query(`DELETE FROM salary_alerts WHERE id = $1`, [id]);
    return Response.json({ success: true });
  } finally {
    client.release();
  }
}
