type Props = {
  items: string[]
}

function splitDatePrefix(s: string): { date?: string; rest: string } {
  const m = s.match(/^([0-9]{4}\s+[A-Za-z]{3}\s+[0-9]{1,2}:)\s*(.*)$/)
  if (!m) return { rest: s }
  return { date: m[1], rest: m[2] }
}

export default function NewsList({ items }: Props) {
  return (
    <div className="space-y-2">
      {items.map((s, idx) => {
        const { date, rest } = splitDatePrefix(s)
        return (
          <div key={`${idx}-${s.slice(0, 16)}`} className="text-[14px] leading-6 text-zinc-800">
            {date ? <span className="mr-2 font-medium text-zinc-900">{date}</span> : null}
            <span className="text-zinc-700">{rest}</span>
          </div>
        )
      })}
    </div>
  )
}

