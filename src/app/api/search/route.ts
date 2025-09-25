import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || '';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50', 10), 100);

  if (!q) return NextResponse.json({ results: [] });

  const sql = `
    WITH q AS (SELECT plainto_tsquery('simple', $1) AS query)
    SELECT id, organisation, location, type, route,
           ts_rank_cd(search_tsv, q.query) AS rank
    FROM organisations, q
    WHERE search_tsv @@ q.query
    ORDER BY rank DESC
    LIMIT $2;
  `;

  const { rows } = await pool.query(sql, [q, limit]);
  return NextResponse.json({ results: rows });
}
