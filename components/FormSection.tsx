import LeadForm from './LeadForm'

export default function FormSection() {
  return (
    <section
      id="reservar"
      style={{
        background: '#000000',
        color: '#FFFFFF',
        padding: 'clamp(64px,8vw,140px) 0 clamp(80px,9vw,160px)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,64px)] box-border">

        {/* Top stats strip */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap mb-[clamp(48px,6vw,96px)]"
          style={{
            borderTop:    '1px solid rgba(255,255,255,0.16)',
            borderBottom: '1px solid rgba(255,255,255,0.16)',
            padding: '18px 0',
          }}
        >
          <span
            className="uppercase"
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.92)' }}
          >
            Madrid · 17 de junio de 2026
          </span>
          <span
            className="hidden sm:block w-px h-7"
            style={{ background: 'rgba(255,255,255,0.16)' }}
          />
          <span
            className="uppercase sm:text-right"
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.92)' }}
          >
            Plazas limitadas
          </span>
        </div>

        {/* 2-col layout: headline | form */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-start"
          style={{ gap: 'clamp(48px,6vw,96px)', paddingTop: 'clamp(16px,2vw,24px)' }}
        >
          {/* Left: giant headline */}
          <div className="flex flex-col gap-8 self-stretch">
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-inter)',
                fontWeight: 900,
                fontSize: 'clamp(56px,9vw,148px)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textWrap: 'balance',
              } as React.CSSProperties}
            >
              Reserva tu plaza en el evento
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.62)', maxWidth: '38ch' }}>
              Confirma tu plaza rellenando el formulario. Recibirás los detalles de la sede
              y el material previo por email.
            </p>
          </div>

          {/* Right: form */}
          <LeadForm />
        </div>

      </div>
    </section>
  )
}
