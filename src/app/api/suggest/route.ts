import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || '';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '5', 10), 20);

  if (!q) return NextResponse.json({ suggestions: [] });

  // Optional: tune threshold per request (uncomment if needed)
  // await pool.query("SET pg_trgm.similarity_threshold = 0.35");

  const sql = `
    SELECT organisation, similarity(organisation, $1) AS score
    FROM organisations
    WHERE organisation % $1
    ORDER BY score DESC
    LIMIT $2;
  `;

  const { rows } = await pool.query(sql, [q, limit]);
  return NextResponse.json({ suggestions: rows.map(r => r.organisation) });
}
