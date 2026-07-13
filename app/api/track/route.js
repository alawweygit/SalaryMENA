import { getPool } from '../../lib/db';

const pool = getPool();

export async function POST(req) {
  try {
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO visits (visit_date, count) VALUES ($1, 1)
       ON CONFLICT (visit_date) DO UPDATE SET count = visits.count + 1`,
      [today]
    );
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [total, daily] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(count), 0) AS total FROM visits`),
      pool.query(`SELECT visit_date, count FROM visits ORDER BY visit_date DESC LIMIT 14`),
    ]);
    return Response.json({
      total: parseInt(total.rows[0].total),
      today: parseInt(daily.rows.find(r => r.visit_date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0])?.count ?? 0),
      daily: daily.rows.reverse(),
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
