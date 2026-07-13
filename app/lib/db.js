import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_PUBLIC_URL,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected DB pool error:', err);
    });
  }
  return pool;
}
