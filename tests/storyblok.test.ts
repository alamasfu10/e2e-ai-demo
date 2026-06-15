import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Guardamos la referencia original de fetch
const originalFetch = global.fetch

// Helper para crear una respuesta fetch simulada
function mockFetch(data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => data,
  } as Response)
}

describe('fetchLandingContent', () => {
  beforeEach(() => {
    // Aseguramos token disponible por defecto en cada test
    process.env.NEXT_PUBLIC_STORYBLOK_TOKEN = 'test-token'
  })

  afterEach(() => {
    // Restauramos fetch y token
    global.fetch = originalFetch
    process.env.NEXT_PUBLIC_STORYBLOK_TOKEN = 'test-token'
    vi.resetModules()
  })

  it('devuelve FALLBACK cuando no hay token configurado', async () => {
    delete process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
    // Re-importamos para que el módulo lea el env actualizado
    const { fetchLandingContent } = await import('../lib/storyblok')

    const content = await fetchLandingContent()

    expect(content.hero_title).toBe('IA aplicada, en un solo día')
  })

  it('devuelve los campos mapeados correctamente cuando fetch OK', async () => {
    global.fetch = mockFetch({
      story: {
        content: {
          evento_nombre: 'IA en la empresa',
          evento_descripcion: {
            content: [{ content: [{ text: 'Un taller intensivo' }] }],
          },
          evento_etiqueta: 'Madrid · Junio 2026',
          evento_fecha: '18 de junio · 2026',
          evento_lugar: 'Madrid · La Nave',
          evento_duracion: '09:00 — 18:00 h',
          evento_plazas: '30 — aforo limitado',
        },
      },
    })

    const { fetchLandingContent } = await import('../lib/storyblok')
    const content = await fetchLandingContent()

    expect(content.hero_title).toBe('IA en la empresa')
    expect(content.hero_description).toBe('Un taller intensivo')
    expect(content.eyebrow_label).toBe('Madrid · Junio 2026')
    expect(content.event_date).toBe('18 de junio · 2026')
    expect(content.event_location).toBe('Madrid · La Nave')
    expect(content.event_duration).toBe('09:00 — 18:00 h')
    expect(content.event_spots).toBe('30 — aforo limitado')
  })

  it('devuelve FALLBACK sin crashear cuando fetch lanza error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { fetchLandingContent } = await import('../lib/storyblok')
    const content = await fetchLandingContent()

    expect(content.hero_title).toBe('IA aplicada, en un solo día')
  })

  it('devuelve FALLBACK cuando fetch responde con !ok (404)', async () => {
    global.fetch = mockFetch({}, false, 404)

    const { fetchLandingContent } = await import('../lib/storyblok')
    const content = await fetchLandingContent()

    expect(content.hero_title).toBe('IA aplicada, en un solo día')
  })

  it('devuelve FALLBACK cuando los campos de contenido están vacíos', async () => {
    global.fetch = mockFetch({
      story: { content: {} },
    })

    const { fetchLandingContent } = await import('../lib/storyblok')
    const content = await fetchLandingContent()

    // Todos los campos deben caer al fallback
    expect(content.hero_title).toBe('IA aplicada, en un solo día')
    expect(content.event_date).toBe('17 de junio · 2026')
    expect(content.event_location).toBe('Madrid · sede por confirmar')
  })
})
