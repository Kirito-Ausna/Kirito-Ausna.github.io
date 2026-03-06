import type { ReactNode } from 'react'

type Props = {
  text: string
  className?: string
}

function normalizeHref(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('./')) return `/${trimmed.slice(2)}`
  return trimmed
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\\textbf\{([^}]*)\}|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text))) {
    const start = m.index
    const end = re.lastIndex
    const before = text.slice(last, start)
    if (before) out.push(before)
    if (m[1]) {
      out.push(<strong key={`b-${start}`}>{m[1]}</strong>)
    } else if (m[2] && m[3]) {
      const href = normalizeHref(m[3])
      const external = isExternalHref(href)
      out.push(
        <a
          key={`a-${start}`}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="text-blue-600 underline-offset-2 hover:underline"
        >
          {m[2]}
        </a>,
      )
    }
    last = end
  }

  const rest = text.slice(last)
  if (rest) out.push(rest)
  return out
}

export default function RichText({ text, className }: Props) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  return (
    <div className={['space-y-5', className].filter(Boolean).join(' ')}>
      {lines
        .map((l) => l.trimEnd())
        .filter((l) => l.trim())
        .map((line, idx) => (
          <p key={idx} className="text-[15px] leading-7 text-zinc-900">
            {renderInline(line)}
          </p>
        ))}
    </div>
  )
}
