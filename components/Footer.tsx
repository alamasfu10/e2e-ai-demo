export default function Footer() {
  return (
    <footer
      style={{
        background: '#000000',
        color: 'rgba(255,255,255,0.72)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        fontSize: 13,
        padding: '28px 0',
      }}
    >
      <div
        className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,64px)] box-border flex items-center justify-between gap-4 flex-wrap"
      >
        <span>
          © 2026 Garaje de Ideas. Garaje Boost AI es un programa de Garaje de Ideas (European Digital Group).
        </span>
        <span className="flex gap-[18px]">
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Política de privacidad</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Aviso legal</a>
        </span>
      </div>
    </footer>
  )
}
