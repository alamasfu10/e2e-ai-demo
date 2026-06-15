import { describe, it, expect } from 'vitest'
import { LeadSchema } from '../types/lead'

describe('LeadSchema', () => {
  const valid = {
    nombre:               'Álvaro',
    apellido:             'Lamas',
    email_empresa:        'hola@empresa.com',
    empresa:              'Garaje de Ideas',
    acepta_comunicaciones: true,
  }

  it('acepta un lead válido mínimo', () => {
    const result = LeadSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('acepta campos opcionales', () => {
    const result = LeadSchema.safeParse({
      ...valid,
      cargo: 'CEO',
      tamano_equipo: '10-50',
      utm_source: 'google',
    })
    expect(result.success).toBe(true)
  })

  it('normaliza el email a minúsculas', () => {
    const result = LeadSchema.safeParse({ ...valid, email_empresa: '  HOLA@EMPRESA.COM  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email_empresa).toBe('hola@empresa.com')
  })

  it('rechaza email inválido', () => {
    const result = LeadSchema.safeParse({ ...valid, email_empresa: 'no-es-un-email' })
    expect(result.success).toBe(false)
  })

  it('rechaza nombre vacío', () => {
    const result = LeadSchema.safeParse({ ...valid, nombre: '' })
    expect(result.success).toBe(false)
  })
})
