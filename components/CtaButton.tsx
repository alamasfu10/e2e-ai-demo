'use client'

import { sendGAEvent } from '@next/third-parties/google'

export default function CtaButton() {
  function handleClick() {
    sendGAEvent('event', 'select_content', {
      content_type: 'cta',
      content_id:   'hero_reservar_plaza',
    })
  }

  return (
    <a
      href="#reservar"
      onClick={handleClick}
      className="btn-pill inline-flex items-center gap-[10px] px-[26px] h-14 bg-ink text-paper no-underline rounded-pill"
      style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.005em' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
      </svg>
      <span>Reservar plaza</span>
    </a>
  )
}
