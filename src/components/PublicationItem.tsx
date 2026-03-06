import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useHomepageStore } from '@/store/homepageStore'
import type { Publication } from '@/utils/publication'

type Props = {
  pub: Publication
}

export default function PublicationItem({ pub }: Props) {
  const open = useHomepageStore((s) => s.openLightbox)
  const [imgOk, setImgOk] = useState(true)
  const isEVA = /\bEVA\b/i.test(pub.title)

  const fallback = useMemo(() => {
    const parts = pub.title.split(/\s+/).filter(Boolean)
    const head = parts.slice(0, 3).join(' ')
    return head.length > 40 ? `${head.slice(0, 40)}…` : head
  }, [pub.title])

  return (
    <div className="grid grid-cols-[180px_1fr] items-stretch gap-6 sm:grid-cols-[200px_1fr]">
      <button
        type="button"
        className={cn(
          'group relative h-full min-h-[120px] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-left',
          'transition hover:border-zinc-300 hover:bg-zinc-100',
          isEVA ? 'h-auto min-h-0 self-start' : undefined,
        )}
        onClick={() => {
          if (pub.imageSrc && imgOk) {
            open({ src: pub.imageSrc, alt: pub.title })
          }
        }}
        aria-label={pub.imageSrc ? `Open figure for ${pub.title}` : `No figure for ${pub.title}`}
      >
        {pub.imageSrc && imgOk ? (
          <img
            src={pub.imageSrc}
            alt={pub.title}
            className={cn(
              'h-full w-full object-cover transition group-hover:scale-[1.02]',
              isEVA ? 'h-[96px] sm:h-[100px]' : undefined,
            )}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-xs text-zinc-500">
            {fallback}
          </div>
        )}
      </button>
      <div className="min-w-0">
        <div className="text-[15px] font-semibold leading-6 text-zinc-950">{pub.title}</div>
        {pub.meta ? <div className="mt-1 text-[13px] leading-5 text-zinc-600">{pub.meta}</div> : null}
        {pub.description ? (
          <div className="mt-2 text-[14px] leading-6 text-zinc-800">{pub.description}</div>
        ) : null}
      </div>
    </div>
  )
}
