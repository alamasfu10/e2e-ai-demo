import { createClient } from '@supabase/supabase-js'

function getServerClient(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return getServerClient(url, key)
}

export function getSupabaseTest() {
  const url = process.env.SUPABASE_TEST_URL
  const key = process.env.SUPABASE_TEST_SERVICE_KEY
  if (!url || !key) throw new Error('Missing Supabase test env vars')
  return getServerClient(url, key)
}
