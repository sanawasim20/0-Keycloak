import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': {  // Proxy Keycloak requests
        target: 'http://localhost:4000', // Keycloak backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''), // Removes /auth prefix when forwarding
      },
    },
  },
  plugins: [react()],
})
