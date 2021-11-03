import vue from '@vitejs/plugin-vue'
import path from 'path'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus(),
    WindiCSS(),
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
