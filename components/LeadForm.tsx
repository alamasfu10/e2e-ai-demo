'use client'

import { useState, useRef, FormEvent } from 'react'
import { sendGAEvent } from '@next/third-parties/google'

interface Field {
  name:      string
  label:     string
  type?:     string
  required?: boolean
}

const FIELDS: Field[] = [
  { name: 'nombre',        label: 'Nombre',           required: true },
  { name: 'apellido',      label: 'Apellido',         required: true },
  { name: 'email_empresa', label: 'Email de empresa', type: 'email', required: true },
  { name: 'empresa',       label: 'Empresa',          required: true },
  { name: 'cargo',         label: 'Cargo' },
  { name: 'tamano_equipo', label: 'Tamaño de tu equipo' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function LeadForm() {
  const [status, setStatus]       = useState<Status>('idle')
  const [error, setError]         = useState('')
  const formStartedRef            = useRef(false)

  function handleFieldFocus() {
    if (formStartedRef.current) return
    formStartedRef.current = true
    sendGAEvent('event', 'form_start', { form_id: 'reserva_plaza' })
  }

  function handleButtonClick() {
    sendGAEvent('event', 'button_click', {
      button_id:   'submit_reserva',
      button_text: 'Reservar plaza',
      form_id:     'reserva_plaza',
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const params = new URLSearchParams(window.location.search)

    const body = {
      nombre:                String(data.nombre        ?? '').trim(),
      apellido:              String(data.apellido      ?? '').trim(),
      email_empresa:         String(data.email_empresa ?? '').trim().toLowerCase(),
      empresa:               String(data.empresa       ?? '').trim(),
      cargo:                 String(data.cargo         ?? '').trim() || undefined,
      tamano_equipo:         String(data.tamano_equipo ?? '').trim() || undefined,
      acepta_comunicaciones: data.acepta_comunicaciones === 'on',
      utm_source:   params.get('utm_source')   ?? undefined,
      utm_medium:   params.get('utm_medium')   ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
    }

    try {
      const res  = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'Error desconocido')

      // generate_lead con atributos del formulario (sin PII)
      sendGAEvent('event', 'generate_lead', {
        form_id:               'reserva_plaza',
        cargo:                 body.cargo         ?? '(no indicado)',
        tamano_equipo:         body.tamano_equipo ?? '(no indicado)',
        acepta_comunicaciones: body.acepta_comunicaciones,
        utm_source:            body.utm_source   ?? '(direct)',
        utm_medium:            body.utm_medium   ?? '(none)',
        utm_campaign:          body.utm_campaign ?? '(none)',
      })

      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-5 items-start">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-pill"
          style={{ background: 'rgba(34,197,94,0.18)', color: '#22C55E', fontSize: 14, fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          ¡Gracias por registrarte!
        </div>
        <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.55, maxWidth: '44ch' }}>
          ¡Gracias por registrarte! Recibirás los detalles y el material previo por email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-[560px] justify-self-end">

      {/* 2×3 field grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-2">
        {FIELDS.map(field => (
          <input
            key={field.name}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.label}
            required={field.required}
            disabled={status === 'loading'}
            onFocus={handleFieldFocus}
            className="field-underline"
          />
        ))}
      </div>

      {/* Checkbox + legal */}
      <div className="flex flex-col gap-[14px] mt-1">
        <label className="flex items-start gap-[10px] cursor-pointer">
          <input
            type="checkbox"
            name="acepta_comunicaciones"
            defaultChecked
            className="cb-check mt-[2px]"
          />
          <span style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.88)' }}>
            Acepto recibir comunicaciones de Garaje de Ideas.
          </span>
        </label>

        <p
          className="pl-7"
          style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.52)', maxWidth: '52ch' }}
        >
          Al registrarme, autorizo a Garaje de Ideas a almacenar y procesar la información
          personal enviada y acepto la{' '}
          <a href="#" style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            política de privacidad
          </a>.
        </p>
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: 13.5, margin: 0 }}>{error}</p>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          onClick={handleButtonClick}
          disabled={status === 'loading'}
          className="btn-pill inline-flex items-center justify-center gap-[10px] h-14 px-8 rounded-pill border-0"
          style={{
            background:    '#FFFFFF',
            color:         '#0A0A0A',
            fontFamily:    'var(--font-inter)',
            fontWeight:    700,
            fontSize:      14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor:  status === 'loading' ? 'wait'    : 'pointer',
            opacity: status === 'loading' ? 0.7       : 1,
          }}
        >
          <span>{status === 'loading' ? 'Enviando…' : 'Reservar plaza'}</span>
          {status !== 'loading' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

    </form>
  )
}
