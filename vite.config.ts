import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// GitHub Pages serves the site from https://chelzzzs.github.io/sofi-s-gallery/,
// so the build (and `vite preview` of it) use that prefix; only the dev server
// stays at the root.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'serve' && !isPreview ? '/' : '/sofi-s-gallery/',
  plugins: [react(), imagetools()],
}))
