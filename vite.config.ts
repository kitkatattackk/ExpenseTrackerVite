// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // bind 0.0.0.0
    allowedHosts: true,  // accept any external hostname
    hmr: {
      protocol: 'wss',
      clientPort: 443,   // HMR over HTTPS tunnels
    },
  },
})