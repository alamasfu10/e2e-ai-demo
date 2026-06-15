import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- mock getSupabaseServer ----------
const mockInsert = vi.fn()
vi.mock('../lib/supabase', () => ({
  getSupabaseServer: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}))

// We must import the handler AFTER the mock is set up
import { POST } from '../app/api/leads/route'

function makeRequest(body: unknown, contentType = 'application/json'): Request {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const validBody = {
  nombre: 'Ana',
  apellido: 'García',
  email_empresa: 'ana@empresa.com',
  empresa: 'Garaje de Ideas',
  acepta_comunicaciones: true,
}

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('caso éxito: inserta con datos correctos y responde { ok: true } con status 201', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest(validBody) as any)
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledOnce()
    // Verifica que el payload del insert incluye los campos clave
    const insertedData = mockInsert.mock.calls[0][0]
    expect(insertedData).toMatchObject({
      nombre: 'Ana',
      apellido: 'García',
      email_empresa: 'ana@empresa.com',
      empresa: 'Garaje de Ideas',
      acepta_comunicaciones: true,
    })
  })

  it('caso error de validación: email inválido → responde 422', async () => {
    const res = await POST(
      makeRequest({ ...validBody, email_empresa: 'no-es-un-email' }) as any,
    )
    const json = await res.json()

    expect(res.status).toBe(422)
    expect(json.ok).toBe(false)
    expect(json.error).toBe('Validation failed')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('caso JSON inválido → responde 400', async () => {
    const res = await POST(makeRequest('{ invalid json', 'application/json') as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.error).toBe('Invalid JSON')
  })

  it('caso error de Supabase → responde 500', async () => {
    mockInsert.mockResolvedValue({ error: new Error('DB connection failed') })

    const res = await POST(makeRequest(validBody) as any)
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.ok).toBe(false)
    expect(json.error).toBe('Database error')
  })

  it('caso error de validación: nombre vacío → responde 422', async () => {
    const res = await POST(makeRequest({ ...validBody, nombre: '' }) as any)
    const json = await res.json()

    expect(res.status).toBe(422)
    expect(json.ok).toBe(false)
  })
})
