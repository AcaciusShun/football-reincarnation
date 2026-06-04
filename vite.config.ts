import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // served from https://acaciusshun.github.io/football-reincarnation/
  base: '/football-reincarnation/',
  plugins: [react(), tailwindcss()],
})
