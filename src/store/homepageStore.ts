import { create } from 'zustand'

export type LightboxPayload = {
  src: string
  alt: string
  caption?: string
}

type HomepageState = {
  showAllWorks: boolean
  setShowAllWorks: (v: boolean) => void

  lightbox: LightboxPayload | null
  openLightbox: (payload: LightboxPayload) => void
  closeLightbox: () => void
}

export const useHomepageStore = create<HomepageState>((set) => ({
  showAllWorks: false,
  setShowAllWorks: (v) => set({ showAllWorks: v }),

  lightbox: null,
  openLightbox: (payload) => set({ lightbox: payload }),
  closeLightbox: () => set({ lightbox: null }),
}))

