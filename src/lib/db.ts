// src/lib/db.ts
import { Pool } from 'pg';

declare global {
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // optional tuning:
    // max: 10,
    // idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') global._pgPool = pool;
