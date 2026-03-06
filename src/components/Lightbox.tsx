import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useHomepageStore } from '@/store/homepageStore'

export default function Lightbox() {
  const lightbox = useHomepageStore((s) => s.lightbox)
  const close = useHomepageStore((s) => s.closeLightbox)

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox, close])

  if (!lightbox) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/70 text-white transition hover:bg-black"
          onClick={close}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-black">
          <img src={lightbox.src} alt={lightbox.alt} className="max-h-[78vh] w-full object-contain" />
        </div>
        {lightbox.caption ? (
          <div className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-700">{lightbox.caption}</div>
        ) : null}
      </div>
    </div>
  )
}

