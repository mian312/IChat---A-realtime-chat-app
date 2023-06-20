import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'IChat messaging app',
        short_name: 'I-Chat',
        description: 'This is a realtime 1v1 chat application made using React + Firebase',
        icons: [
          {
            src: '/icons/png-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/png-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/png-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },   
          {
            src: '/icons/png-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
        ]
      }
    })
  ],
})
