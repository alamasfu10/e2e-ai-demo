interface HeroProps {
  title:        string
  description:  string
  eyebrowLabel: string
}

export default function Hero({ title, description, eyebrowLabel }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: 'clamp(48px,7vw,120px) 0 clamp(64px,8vw,140px)' }}
    >
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,64px)] box-border relative">

        {/* Decorative: sage square with dot grid */}
        <div
          aria-hidden="true"
          className="absolute right-[4%] top-0 hidden md:grid place-items-center pointer-events-none"
          style={{
            width: 160, height: 200,
            background: '#B8D0CA',
            borderRadius: 16,
          }}
        >
          <svg viewBox="0 0 100 120" width="80%" height="80%">
            <g fill="#0A0A0A" opacity="0.35">
              {[28, 50, 72, 94].flatMap(cy =>
                [20, 40, 60, 80].map(cx => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" />
                ))
              )}
            </g>
          </svg>
        </div>

        {/* Decorative: dark sparkle tile */}
        <div
          aria-hidden="true"
          className="absolute right-[14%] -bottom-10 hidden md:grid place-items-center pointer-events-none"
          style={{
            width: 140, height: 140,
            background: '#0A0A0A',
            borderRadius: 16,
            boxShadow: '0 24px 60px rgba(10,10,10,0.25)',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 32 32">
            <path d="M16 4 L18 14 L28 16 L18 18 L16 28 L14 18 L4 16 L14 14 Z"
                  fill="#FFFFFF" />
          </svg>
        </div>

        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 mb-8"
          style={{
            padding: '7px 14px',
            background: '#E8E8E5',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#0A0A0A',
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: '#22C55E' }}
          />
          {eyebrowLabel}
        </div>

        {/* Hero title */}
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter)',
            fontWeight: 900,
            fontSize: 'clamp(64px,11vw,168px)',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#0A0A0A',
            textWrap: 'balance',
            maxWidth: '14ch',
          } as React.CSSProperties}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            marginTop: 40,
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(17px,1.6vw,20px)',
            lineHeight: 1.55,
            color: '#8A8A86',
            maxWidth: '56ch',
          }}
        >
          {description}
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#reservar"
            className="btn-pill inline-flex items-center gap-[10px] px-[26px] h-14 bg-ink text-paper no-underline rounded-pill"
            style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.005em' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
            </svg>
            <span>Reservar plaza</span>
          </a>
        </div>

      </div>
    </section>
  )
}
