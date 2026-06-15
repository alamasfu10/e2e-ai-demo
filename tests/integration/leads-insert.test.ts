import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const TEST_URL = process.env.SUPABASE_TEST_URL
const TEST_KEY = process.env.SUPABASE_TEST_SERVICE_KEY
const SKIP = !TEST_URL || !TEST_KEY

// session_id único para este test run — evita colisiones entre ejecuciones
const TEST_SESSION_ID = `test-integration-${Date.now()}`

let supabase: SupabaseClient

describe.skipIf(SKIP)('Integración — leads insert en Supabase test', () => {
  beforeAll(() => {
    if (SKIP) return
    supabase = createClient(TEST_URL!, TEST_KEY!, {
      auth: { persistSession: false },
    })
  })

  afterAll(async () => {
    if (SKIP || !supabase) return
    // Teardown: elimina la fila insertada para dejar la BD limpia
    await supabase.from('leads').delete().eq('session_id', TEST_SESSION_ID)
  })

  it('inserta un lead de prueba y la fila existe en la BD', async () => {
    const lead = {
      nombre: 'Test',
      apellido: 'Integration',
      email_empresa: 'test-integration@example.com',
      empresa: 'Test Corp',
      cargo: 'QA Engineer',
      tamano_equipo: '1-10',
      acepta_comunicaciones: false,
      session_id: TEST_SESSION_ID,
      utm_source: 'vitest',
    }

    // Insert
    const { error: insertError } = await supabase.from('leads').insert(lead)
    expect(insertError).toBeNull()

    // Verify
    const { data, error: selectError } = await supabase
      .from('leads')
      .select('*')
      .eq('session_id', TEST_SESSION_ID)
      .single()

    expect(selectError).toBeNull()
    expect(data).not.toBeNull()
    expect(data?.nombre).toBe('Test')
    expect(data?.apellido).toBe('Integration')
    expect(data?.email_empresa).toBe('test-integration@example.com')
    expect(data?.empresa).toBe('Test Corp')
    expect(data?.session_id).toBe(TEST_SESSION_ID)
    expect(data?.acepta_comunicaciones).toBe(false)
  })
})

if (SKIP) {
  describe('Integración — leads insert (SKIPPED)', () => {
    it.skip('SUPABASE_TEST_URL / SUPABASE_TEST_SERVICE_KEY no están definidas', () => {})
  })
}
