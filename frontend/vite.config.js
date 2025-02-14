import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Expose to network
    port: 5173, // Optional: specify a port
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
})
