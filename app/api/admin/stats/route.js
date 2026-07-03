import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('pw') !== ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const [totals, alertCount, countryCount, today, thisWeek, thisMonth, recent, dailySubmissions, countryBreakdown, seniorityBreakdown, topJobs, companyTypeBreakdown] = await Promise.all([
      client.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_seed = FALSE) AS real, COUNT(*) FILTER (WHERE is_seed = TRUE) AS seed FROM salaries`),
      client.query(`SELECT COUNT(*) AS count FROM salary_alerts`),
      client.query(`SELECT COUNT(DISTINCT country) AS count FROM salaries`),
      client.query(`SELECT COUNT(*) AS count FROM salaries WHERE is_seed = FALSE AND created_at >= NOW() - INTERVAL '1 day'`),
      client.query(`SELECT COUNT(*) AS count FROM salaries WHERE is_seed = FALSE AND created_at >= NOW() - INTERVAL '7 days'`),
      client.query(`SELECT COUNT(*) AS count FROM salaries WHERE is_seed = FALSE AND created_at >= NOW() - INTERVAL '30 days'`),
      client.query(`SELECT id, job_title, country, monthly_salary, currency, seniority, created_at FROM salaries WHERE is_seed = FALSE ORDER BY created_at DESC LIMIT 10`),
      client.query(`SELECT TO_CHAR(d::date, 'Mon DD') AS label, COALESCE(s.cnt, 0)::int AS value FROM generate_series(NOW() - INTERVAL '13 days', NOW(), '1 day') d LEFT JOIN (SELECT DATE(created_at) AS day, COUNT(*) AS cnt FROM salaries WHERE is_seed = FALSE GROUP BY DATE(created_at)) s ON s.day = d::date ORDER BY d`),
      client.query(`SELECT country, COUNT(*) AS count FROM salaries WHERE is_seed = FALSE GROUP BY country ORDER BY count DESC LIMIT 15`),
      client.query(`SELECT seniority, COUNT(*) AS count FROM salaries GROUP BY seniority ORDER BY count DESC`),
      client.query(`SELECT job_title_en AS job_title, COUNT(*) AS count FROM salaries GROUP BY job_title_en ORDER BY count DESC LIMIT 15`),
      client.query(`SELECT company_type, COUNT(*) AS count FROM salaries GROUP BY company_type ORDER BY count DESC`),
    ]);

    return Response.json({
      total: parseInt(totals.rows[0].total),
      real: parseInt(totals.rows[0].real),
      seed: parseInt(totals.rows[0].seed),
      alert_count: parseInt(alertCount.rows[0].count),
      country_count: parseInt(countryCount.rows[0].count),
      today: parseInt(today.rows[0].count),
      this_week: parseInt(thisWeek.rows[0].count),
      this_month: parseInt(thisMonth.rows[0].count),
      recent: recent.rows,
      daily_submissions: dailySubmissions.rows,
      country_breakdown: countryBreakdown.rows,
      seniority_breakdown: seniorityBreakdown.rows,
      top_jobs: topJobs.rows,
      company_type_breakdown: companyTypeBreakdown.rows,
    });
  } finally {
    client.release();
  }
}
