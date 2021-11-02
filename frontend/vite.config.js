import vue from '@vitejs/plugin-vue'
import path from 'path'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import AsyncCatch from 'vite-plugin-async-catch'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AsyncCatch({ catchCode: `console.error(e)` }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus(),
    viteCompression(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../backend/static',
    emptyOutDir: true,
    brotliSize: false,
  },
})
