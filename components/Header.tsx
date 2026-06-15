export default function Header() {
  return (
    <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,64px)] box-border">
      <header className="flex items-center justify-between gap-4 py-[clamp(20px,2.4vw,32px)]">
        {/* Wordmark */}
        <a
          href="#"
          className="inline-flex items-baseline gap-[2px] text-ink no-underline"
          style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 900,
            fontSize: 'clamp(20px,1.8vw,26px)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span>Garaje Boost</span>
          <sup
            style={{
              fontSize: '0.55em',
              fontWeight: 900,
              letterSpacing: '0.02em',
              lineHeight: 1,
              position: 'relative',
              top: '-0.55em',
              marginLeft: '3px',
            }}
          >
            AI
          </sup>
        </a>

        {/* Nav chip */}
        <a
          href="https://garajedeideas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[10px] px-[18px] h-10 bg-ink text-paper no-underline rounded-pill"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '12.5px',
            fontWeight: 500,
            letterSpacing: '0.06em',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
          </svg>
          <span>GARAJEDEIDEAS.COM</span>
        </a>
      </header>
    </div>
  )
}
