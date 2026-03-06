import { useMemo } from 'react'
import { useHomepageStore } from '@/store/homepageStore'
import type { Publication } from '@/utils/publication'
import PublicationItem from '@/components/PublicationItem'

type Props = {
  publications: Publication[]
}

export default function PublicationsBlock({ publications }: Props) {
  const showAllWorks = useHomepageStore((s) => s.showAllWorks)
  const setShowAllWorks = useHomepageStore((s) => s.setShowAllWorks)

  const main = useMemo(() => publications.filter((p) => p.group === 'main'), [publications])
  const other = useMemo(() => publications.filter((p) => p.group === 'other'), [publications])

  const list = showAllWorks ? [...main, ...other] : main

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-px flex-1 bg-zinc-200" />
        <button
          type="button"
          className="mx-4 text-sm text-blue-600 underline-offset-2 hover:underline"
          onClick={() => setShowAllWorks(!showAllWorks)}
        >
          {showAllWorks ? 'show selected works' : 'show all works'}
        </button>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="space-y-10">
        {list.map((p) => (
          <PublicationItem key={p.id} pub={p} />
        ))}
      </div>
    </div>
  )
}
