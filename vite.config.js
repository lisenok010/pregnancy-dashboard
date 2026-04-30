import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ВАЖНО: замени 'pregnancy-dashboard' на имя твоего GitHub репозитория
export default defineConfig({
  plugins: [react()],
  base: '/pregnancy-dashboard/',
})
