interface DetailStripProps {
  date:     string
  location: string
  duration: string
  spots:    string
}

export default function DetailStrip({ date, location, duration, spots }: DetailStripProps) {
  const cells = [
    { label: 'Fecha',    value: date },
    { label: 'Lugar',    value: location },
    { label: 'Duración', value: duration },
    { label: 'Plazas',   value: spots },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,64px)] box-border">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 border-t border-b"
        style={{ borderColor: 'rgba(10,10,10,0.08)' }}
      >
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className="flex flex-col gap-[6px] px-8 py-7"
            style={{
              borderLeft: i === 0 ? '0' : '1px solid rgba(10,10,10,0.08)',
              // On mobile 2-col, remove left border from 3rd cell
              ...(i === 2 ? { borderLeft: '0' } : {}),
            }}
          >
            <span
              className="uppercase text-quiet"
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}
            >
              {cell.label}
            </span>
            <span
              className="text-ink"
              style={{ fontSize: 18, fontWeight: 500 }}
            >
              {cell.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
