export type Publication = {
  id: string
  title: string
  meta: string
  description: string
  group: 'main' | 'other'
  imageSrc?: string
}

function simplifyLatex(s: string): string {
  return s
    .replace(/\\space/g, ' ')
    .replace(/\\textless/g, '<')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
}

function stripLatexCommands(s: string): string {
  let out = s
  for (let i = 0; i < 8; i += 1) {
    const next = out
      .replace(/\\textbf\{([^{}]*)\}/g, '$1')
      .replace(/\\textit\{([^{}]*)\}/g, '$1')
    if (next === out) break
    out = next
  }
  return out.replace(/[{}]/g, '')
}

function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function normalizeImagePath(p: string): string {
  const trimmed = p.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('./')) return trimmed.replace(/^\.\//, '/')
  if (trimmed.startsWith('figures/')) return `/${trimmed}`
  return trimmed
}

function idFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export function parsePublicationTex(raw: string): Publication[] {
  const tex = simplifyLatex(raw)
  const items: string[] = []
  const re = /\\item\s*\{([\s\S]*?)\}\s*(?=\\item\s*\{|\\end\{cvitems\})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(tex))) {
    items.push(m[1])
  }

  const pubs = items
    .map((block) => {
      const withNewlines = block.replace(/\\\\/g, '\n')
      const plain = stripLatexCommands(withNewlines)
      const lines = plain
        .split('\n')
        .map((l) => normalizeSpaces(l))
        .filter(Boolean)

      const title = lines[0] ?? ''
      const meta = lines[1] ?? ''
      const description = lines.slice(2).join(' ')

      const group: Publication['group'] =
        /\b(PlasticMem|SteinsGate|Weak-to-Strong|Segmented Guidance|DaCapo)\b/i.test(title)
          ? 'main'
          : 'other'

      return {
        id: idFromTitle(title || block),
        title,
        meta,
        description,
        group,
      }
    })
    .filter((p) => p.title)

  const imageMap: Array<[RegExp, string]> = [
    [/\bPlasticMem\b/i, '/figures/PlasticMem.png'],
    [/\bSteinsGate\b/i, '/figures/SteinsGate.png'],
    [/Weak-to-Strong|Segmented Guidance|\bSEG\b/i, '/figures/Segmented Guidance.png'],
    [/\bDaCapo\b/i, '/figures/DaCapo.png'],
    [/\bEVA\b/i, '/figures/EVA.png'],
    [/Re-?Dock/i, '/figures/ReDock.png'],
    [/Protein 3D Graph Structure Learning/i, '/figures/SAO.png'],
    [/Sword Art Online|\bSAO\b/i, '/figures/SAO.png'],
  ]

  return pubs.map((p) => {
    const hit = imageMap.find(([r]) => r.test(p.title))
    return {
      ...p,
      imageSrc: hit ? normalizeImagePath(hit[1]) : undefined,
    }
  })
}
