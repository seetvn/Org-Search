// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await pool.query('select version()');
  return NextResponse.json({ version: rows[0].version });
}
