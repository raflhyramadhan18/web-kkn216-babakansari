import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'KKN 216 Babakansari',
        short_name: 'KKN 216',
        description: 'Aplikasi Absensi dan Informasi KKN 216',
        theme_color: '#fde047',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/734622969_18159090112426253_7593957458933089080_n.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/734622969_18159090112426253_7593957458933089080_n.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
