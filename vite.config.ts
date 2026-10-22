import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// GitHub Pages serves the site from https://chelzzzs.github.io/sofi-s-gallery/,
// so built asset URLs need that prefix; the dev server stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sofi-s-gallery/' : '/',
  plugins: [react(), imagetools()],
}))
