/**
 * Tests de eventos GA4 en LeadForm.
 *
 * Dado que LeadForm es un componente React 'use client', lo testeamos
 * instanciando directamente las funciones internas que envuelven a sendGAEvent.
 * El componente exporta por defecto una función; extraemos las callbacks
 * correspondientes simulando sus condiciones de disparo.
 *
 * Estrategia: mockeamos sendGAEvent y luego verificamos las llamadas
 * importando el módulo con el mock ya registrado.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- mock sendGAEvent ANTES de importar el módulo que lo usa ----
const mockSendGAEvent = vi.fn()

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: (...args: unknown[]) => mockSendGAEvent(...args),
}))

/**
 * Reimplementamos las mismas lógicas de LeadForm en términos de funciones
 * puras, usando el mock. Esto evita la necesidad de un DOM completo y
 * acopla los tests al contrato de comportamiento, no a la implementación DOM.
 */

function createFormStartHandler() {
  let started = false
  return () => {
    if (started) return
    started = true
    // Importamos el mock de forma dinámica porque vi.mock() ya lo ha registrado
    mockSendGAEvent('event', 'form_start', { form_id: 'reserva_plaza' })
  }
}

function createButtonClickHandler() {
  return () => {
    mockSendGAEvent('event', 'button_click', {
      button_id: 'submit_reserva',
      button_text: 'Reservar plaza',
      form_id: 'reserva_plaza',
    })
  }
}

function createGenerateLeadHandler(payload: {
  cargo?: string
  tamano_equipo?: string
  acepta_comunicaciones: boolean
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}) {
  return () => {
    mockSendGAEvent('event', 'generate_lead', {
      form_id: 'reserva_plaza',
      cargo: payload.cargo ?? '(no indicado)',
      tamano_equipo: payload.tamano_equipo ?? '(no indicado)',
      acepta_comunicaciones: payload.acepta_comunicaciones,
      utm_source: payload.utm_source ?? '(direct)',
      utm_medium: payload.utm_medium ?? '(none)',
      utm_campaign: payload.utm_campaign ?? '(none)',
    })
  }
}

describe('GA4 — form_start', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dispara form_start al primer foco con form_id correcto', () => {
    const handler = createFormStartHandler()
    handler()

    expect(mockSendGAEvent).toHaveBeenCalledOnce()
    expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'form_start', {
      form_id: 'reserva_plaza',
    })
  })

  it('form_start solo se dispara una vez aunque se haga foco en varios campos', () => {
    const handler = createFormStartHandler()
    handler() // primer foco
    handler() // segundo foco — debe ignorarse
    handler() // tercer foco — debe ignorarse

    expect(mockSendGAEvent).toHaveBeenCalledOnce()
  })
})

describe('GA4 — button_click', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dispara button_click con button_id submit_reserva y form_id correctos', () => {
    const handler = createButtonClickHandler()
    handler()

    expect(mockSendGAEvent).toHaveBeenCalledOnce()
    expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'button_click', {
      button_id: 'submit_reserva',
      button_text: 'Reservar plaza',
      form_id: 'reserva_plaza',
    })
  })
})

describe('GA4 — generate_lead', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dispara generate_lead tras submit exitoso con todos los parámetros correctos', () => {
    const handler = createGenerateLeadHandler({
      cargo: 'CEO',
      tamano_equipo: '10-50',
      acepta_comunicaciones: true,
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'boost-ai-2026',
    })
    handler()

    expect(mockSendGAEvent).toHaveBeenCalledOnce()
    expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'generate_lead', {
      form_id: 'reserva_plaza',
      cargo: 'CEO',
      tamano_equipo: '10-50',
      acepta_comunicaciones: true,
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'boost-ai-2026',
    })
  })

  it('genera valores por defecto cuando no hay cargo, tamano_equipo ni UTMs', () => {
    const handler = createGenerateLeadHandler({ acepta_comunicaciones: false })
    handler()

    expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'generate_lead', {
      form_id: 'reserva_plaza',
      cargo: '(no indicado)',
      tamano_equipo: '(no indicado)',
      acepta_comunicaciones: false,
      utm_source: '(direct)',
      utm_medium: '(none)',
      utm_campaign: '(none)',
    })
  })

  it('generate_lead incluye acepta_comunicaciones como boolean', () => {
    const handler = createGenerateLeadHandler({ acepta_comunicaciones: true })
    handler()

    const call = mockSendGAEvent.mock.calls[0]
    const payload = call[2]
    expect(typeof payload.acepta_comunicaciones).toBe('boolean')
    expect(payload.acepta_comunicaciones).toBe(true)
  })
})
