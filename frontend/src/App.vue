<template>
  <div>
    <Header />
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { getInfoApi } from '@/api/common.js'
import store from '@/store.js'
import { onMounted } from 'vue'

async function getInfo() {
  const data = (await getInfoApi()).data
  store.setInfoAction(data)
  document.title = data.title
}

onMounted(getInfo)
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  @apply bg-gray-50 min-h-screen pb-5 select-none;
}

a {
  color: var(--el-color-primary);
}

a:hover {
  color: #66b1ff;
}
</style>
