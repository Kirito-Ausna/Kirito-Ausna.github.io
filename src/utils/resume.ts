export type ResumeContent = {
  figurePath: string
  figureCaption: string
  summary: string
  news: string[]
  misc: string
  mainFigureOrder: string[]
  otherFigureOrder: string[]
}

function pickAfterPrefix(line: string, prefix: string): string | null {
  const trimmed = line.trim()
  if (!trimmed.toLowerCase().startsWith(prefix.toLowerCase())) return null
  return trimmed.slice(prefix.length).trim()
}

function extractQuotedValue(s: string): string {
  const m = s.match(/"([\s\S]*)"/)
  if (!m) return s.trim()
  return m[1].trim()
}

function normalizeFigurePath(p: string): string {
  const trimmed = p.trim()
  if (trimmed.startsWith('./')) return trimmed.replace(/^\.\//, '/')
  if (trimmed.startsWith('figures/')) return `/${trimmed}`
  return trimmed
}

function parseFigureOrderLine(line: string): string[] {
  const raw = line.split(':').slice(1).join(':').trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => normalizeFigurePath(p))
}

export function parseResumeMd(raw: string): ResumeContent {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')

  let figurePath = ''
  let figureCaption = ''
  const summary: string[] = []
  const news: string[] = []
  const misc: string[] = []
  let mainFigureOrder: string[] = []
  let otherFigureOrder: string[] = []

  let section: 'none' | 'summary' | 'news' | 'publications' | 'misc' = 'none'
  let pubSub: 'none' | 'main' | 'other' = 'none'

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)$/)
    if (h2) {
      const title = h2[1].trim().toLowerCase()
      if (title === 'summery') section = 'summary'
      else if (title === 'news') section = 'news'
      else if (title === 'publications') section = 'publications'
      else if (title === 'misc') section = 'misc'
      else section = 'none'
      pubSub = 'none'
      continue
    }

    const h3 = line.match(/^###\s+(.*)$/)
    if (section === 'publications' && h3) {
      const title = h3[1].trim().toLowerCase()
      if (title.includes('main')) pubSub = 'main'
      else if (title.includes('other')) pubSub = 'other'
      else pubSub = 'none'
      continue
    }

    const p1 = pickAfterPrefix(line, 'Figure Path:')
    if (p1 != null) {
      figurePath = normalizeFigurePath(p1)
      continue
    }
    const p2 = pickAfterPrefix(line, 'Figure Caption:')
    if (p2 != null) {
      figureCaption = extractQuotedValue(p2)
      continue
    }

    if (section === 'summary') {
      const t = line.trimEnd()
      if (t.trim()) summary.push(t)
      continue
    }
    if (section === 'news') {
      const t = line.trimEnd()
      if (t.trim()) news.push(t)
      continue
    }
    if (section === 'misc') {
      const t = line.trimEnd()
      if (t.trim()) misc.push(t)
      continue
    }
    if (section === 'publications') {
      const t = line.trimEnd()
      if (t.toLowerCase().startsWith('figures (in order):')) {
        const order = parseFigureOrderLine(t)
        if (pubSub === 'main') mainFigureOrder = order
        if (pubSub === 'other') otherFigureOrder = order
      }
    }
  }

  return {
    figurePath,
    figureCaption,
    summary: summary.join('\n').trim(),
    news,
    misc: misc.join('\n').trim(),
    mainFigureOrder,
    otherFigureOrder,
  }
}
