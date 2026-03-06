import Lightbox from '@/components/Lightbox'
import NewsList from '@/components/NewsList'
import PublicationsBlock from '@/components/PublicationsBlock'
import RichText from '@/components/RichText'
import VisitorCounter from '@/components/VisitorCounter'
import { useHomepageStore } from '@/store/homepageStore'
import { parsePublicationTex } from '@/utils/publication'
import { parseResumeMd } from '@/utils/resume'

import resumeRaw from '../../resume.md?raw'
import publicationRaw from '../../publication.tex?raw'

export default function Home() {
  const resume = parseResumeMd(resumeRaw)
  const publications = parsePublicationTex(publicationRaw)
  const openLightbox = useHomepageStore((s) => s.openLightbox)

  const orderedPublications = (() => {
    const indexOf = (src: string | undefined, order: string[]) => {
      if (!src) return Number.POSITIVE_INFINITY
      const i = order.indexOf(src)
      return i === -1 ? Number.POSITIVE_INFINITY : i
    }

    const main = publications
      .filter((p) => p.group === 'main')
      .slice()
      .sort((a, b) => indexOf(a.imageSrc, resume.mainFigureOrder) - indexOf(b.imageSrc, resume.mainFigureOrder))

    const other = publications
      .filter((p) => p.group === 'other')
      .slice()
      .sort((a, b) => indexOf(a.imageSrc, resume.otherFigureOrder) - indexOf(b.imageSrc, resume.otherFigureOrder))

    const mainIds = new Set(main.map((p) => p.id))
    const otherIds = new Set(other.map((p) => p.id))
    const rest = publications.filter((p) => !mainIds.has(p.id) && !otherIds.has(p.id))

    return [...main, ...other, ...rest]
  })()

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Lightbox />

      <main className="mx-auto w-full max-w-[1180px] px-6 py-10 sm:px-8">
        <section className="min-w-0">
          <div className="mx-auto max-w-[980px]">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <button
                type="button"
                className="block w-full"
                onClick={() => {
                  if (resume.figurePath) {
                    openLightbox({
                      src: resume.figurePath.startsWith('/') ? resume.figurePath : `/figures/${resume.figurePath}`,
                      alt: 'Figure 1',
                      caption: resume.figureCaption,
                    })
                  }
                }}
                aria-label="Open Figure 1"
              >
                <img
                  src={resume.figurePath.startsWith('/') ? resume.figurePath : `/figures/${resume.figurePath}`}
                  alt="Figure 1"
                  className="h-[360px] w-full object-cover sm:h-[420px]"
                />
              </button>
            </div>
            {resume.figureCaption ? <div className="mt-3 text-sm leading-6 text-zinc-600">{resume.figureCaption}</div> : null}
          </div>

          <div className="mt-8 space-y-8">
            <div className="space-y-3">
              <RichText text={resume.summary} />
            </div>

            <div className="border-t border-zinc-200 pt-6">
              <NewsList items={resume.news} />
            </div>

            <PublicationsBlock publications={orderedPublications} />

            {resume.misc ? (
              <div className="border-t border-zinc-200 pt-6">
                <div className="text-[15px] leading-7 text-zinc-800">{resume.misc}</div>
              </div>
            ) : null}

            <div className="border-t border-zinc-200 pt-6">
              <VisitorCounter />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
