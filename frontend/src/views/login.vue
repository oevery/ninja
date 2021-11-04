<template>
  <div class="content">
    <el-skeleton v-if="store.state.info.notice.show" :loading="loading" animated class="card p-4">
      <template #default>
        <div class="card">
          <div class="card-header">
            <p class="card-title">{{ store.state.info.notice.title }}</p>
          </div>
          <div class="card-body text-base leading-6" v-html="store.state.info.notice.content"></div>
        </div>
      </template>
    </el-skeleton>

    <el-skeleton :loading="loading" animatedn class="card p-4">
      <template #default>
        <div class="relative">
          <span
            class="absolute z-50 top-2 right-3 px-2 py-1 bg-gray-200 rounded-full font-normal text-xs"
          >余量：{{ available }}</span>
          <el-tabs type="border-card" class="card">
            <el-tab-pane label="Cookie">
              <div class="card-header">
                <span class="card-subtitle">{{ store.state.info.login_notice.cookie }}</span>
              </div>
              <div class="card-body text-center">
                <el-input v-model="cookie" size="small" clearable class="my-4 w-full" />
                <el-button
                  :loading="logging"
                  type="primary"
                  size="small"
                  round
                  @click="loginCookie"
                >登录</el-button>
              </div>
              <div class="card-footer"></div>
            </el-tab-pane>

            <!-- <el-tab-pane label="Wskey">
            <div class="card-header">
              <span class="card-subtitle">{{
                store.state.info.login_notice.wskey
              }}</span>
            </div>
            <div class="card-body text-center">
              <el-input
                v-model="wskey"
                size="small"
                clearable
                class="my-4 w-full"
              />
              <el-button type="primary" size="small" round @click="loginWskey"
                >登录</el-button
              >
            </div>
            <div class="card-footer"></div>
            </el-tab-pane>-->
          </el-tabs>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { getStatusApi } from '@/api/common'
import { LoginCookieApi } from '@/api/user'
import store from '@/store'
import { wait } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// get status
const loading = ref(true)
const available = ref(0)
const enable = ref(true)
async function getStatus() {
  try {
    const { data } = await getStatusApi()
    available.value = data.available
    enable.value = data.enable
  } finally {
    loading.value = false
  }
}

// login
const logging = ref(false)

// ck login
const cookie = ref('')
async function loginCookie() {
  try {
    const ptKey =
      cookie.value.match(/pt_key=(.*?);/) &&
      cookie.value.match(/pt_key=(.*?);/)[1]
    const ptPin =
      cookie.value.match(/pt_pin=(.*?);/) &&
      cookie.value.match(/pt_pin=(.*?);/)[1]
    if (!ptKey || !ptPin) {
      throw new Error('cookie 格式错误')
    }
    logging.value = true
    const { data, message } = await LoginCookieApi({
      pt_key: ptKey,
      pt_pin: ptPin,
    })
    if (!data.id || !data.token) {
      throw new Error('登录失败，请重试或联系管理员')
    }
    store.setUserAction(data)
    ElMessage.success(message)
    await wait(2000)
    const router = useRouter()
    router.push('/')
  } catch (error) {
    if (error.response) return
    ElMessage.error(error.message)
  } finally {
    logging.value = false
  }
}

// wskey login
const wskey = ref('')
const loginWskey = async () => {
  if (wskey.value !== '') {
  }
}

onMounted(() => {
  getStatus()
})
</script>

<style scoped>
.card :deep() .el-tabs__content {
  padding: 0;
}
</style>
