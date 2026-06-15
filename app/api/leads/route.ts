import { NextRequest, NextResponse } from 'next/server'
import { LeadSchema } from '@/types/lead'
import { getSupabaseServer } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const supabase = getSupabaseServer()
    const { error } = await supabase.from('leads').insert(parsed.data)
    if (error) throw error
  } catch (err) {
    console.error('[leads] insert error', err)
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
