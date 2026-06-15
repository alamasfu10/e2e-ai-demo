export interface LandingContent {
  hero_title:       string
  hero_description: string
  eyebrow_label:    string
  event_date:       string
  event_location:   string
  event_duration:   string
  event_spots:      string
}

const FALLBACK: LandingContent = {
  hero_title:       'IA aplicada, en un solo día',
  hero_description: 'Un encuentro presencial de Garaje Boost AI para equipos de diseño, data y tecnología. Una jornada para entender el contexto, reducir el ruido y activar la inteligencia artificial con propósito, criterio y visión de futuro.',
  eyebrow_label:    'Evento presencial · Madrid · 17.06.2026',
  event_date:       '17 de junio · 2026',
  event_location:   'Madrid · sede por confirmar',
  event_duration:   '18:00 — 21:00 h',
  event_spots:      '40 — aforo limitado',
}

// Extrae texto plano de un campo Richtext de Storyblok
function richtextToPlain(rt: unknown): string {
  if (!rt || typeof rt !== 'object') return ''
  const doc = rt as { content?: Array<{ content?: Array<{ text?: string }> }> }
  return (doc.content ?? [])
    .flatMap(block => block.content ?? [])
    .map(node => node.text ?? '')
    .join(' ')
    .trim()
}

export async function fetchLandingContent(): Promise<LandingContent> {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  if (!token) return FALLBACK

  try {
    const fetchOptions = process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 3600 } }

    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/home?version=draft&token=${token}`,
      fetchOptions,
    )
    if (!res.ok) return FALLBACK

    const data = await res.json()
    const c = data?.story?.content ?? {}

    const description = c.evento_descripcion
      ? richtextToPlain(c.evento_descripcion)
      : FALLBACK.hero_description

    return {
      hero_title:       c.evento_nombre      || FALLBACK.hero_title,
      hero_description: description          || FALLBACK.hero_description,
      eyebrow_label:    c.evento_etiqueta    || FALLBACK.eyebrow_label,
      event_date:       c.evento_fecha       || FALLBACK.event_date,
      event_location:   c.evento_lugar       || FALLBACK.event_location,
      event_duration:   c.evento_duracion    || FALLBACK.event_duration,
      event_spots:      c.evento_plazas      || FALLBACK.event_spots,
    }
  } catch {
    return FALLBACK
  }
}
