import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ This is the key change
  },
  server: {
    port: 3000, // optional: adjust as needed
  }
})
