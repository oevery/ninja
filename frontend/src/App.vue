<template>
  <div>
    <Header />
    <div class="main">
      <router-view />
      <!-- <el-message></el-message> -->
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