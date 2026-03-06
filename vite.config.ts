import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge'

function inferBase(): string {
  const explicit = process.env.VITE_BASE?.trim()
  if (explicit) return explicit

  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
  if (!repo) return '/'
  if (repo.endsWith('.github.io')) return '/'
  return `/${repo}/`
}

export default defineConfig({
  base: inferBase(),
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root',
    }),
    tsconfigPaths(),
  ],
})
