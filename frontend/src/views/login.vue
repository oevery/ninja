<template>
  <div class="content">
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <p class="card-title">扫码登录</p>
          <span
            class="ml-2 px-2 py-1 bg-gray-200 rounded-full font-normal text-xs"
            >余量：{{ marginCount }}</span
          >
        </div>
        <span class="card-subtitle">
          请点击下方按钮登录，点击按钮后回到本网站查看是否登录成功，京东的升级提示不用管。
        </span>
      </div>
      <div class="card-body text-center">
        <div v-if="!qrCodeVisibility" class="flex flex-col w-48 m-auto mt-4">
          <el-button type="primary" round @click="showQrcode"
            >扫描二维码登录</el-button
          >
          <el-button class="mt-4 ml-0" type="primary" round @click="jumpLogin"
            >跳转到京东 App 登录</el-button
          >
        </div>
        <img v-else :src="QRCode" :width="256" class="m-auto" />
      </div>
      <div class="card-footer"></div>
    </div>

    <div class="card hidden">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <p class="card-title">CK 登录</p>
          <span
            class="ml-2 px-2 py-1 bg-gray-200 rounded-full font-normal text-xs"
            >余量：{{ marginCount }}</span
          >
        </div>
        <span class="card-subtitle"> 请在下方输入您的 cookie 登录。 </span>
      </div>
      <div class="card-body text-center">
        <el-input v-model="cookie" size="small" clearable class="my-4 w-full" />
        <el-button type="primary" size="small" round @click="CKLogin"
          >登录</el-button
        >
      </div>
      <div class="card-footet"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getInfoAPI,
  getQrcodeAPI,
  CKLoginAPI,
  checkLoginAPI,
} from '@/api/index'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    let data = reactive({
      marginCount: 0,
      allowAdd: true,
      cookie: '',
      QRCode: undefined,
      qrCodeVisibility: false,
      token: undefined,
      okl_token: undefined,
      cookies: undefined,
      timer: undefined,
      waitLogin: false,
    })

    const getInfo = async () => {
      const info = (await getInfoAPI()).data
      data.marginCount = info.marginCount
      data.allowAdd = info.allowAdd
    }

    const getQrcode = async () => {
      try {
        const body = await getQrcodeAPI()
        data.token = body.data.token
        data.okl_token = body.data.okl_token
        data.cookies = body.data.cookies
        data.QRCode = body.data.QRCode
        if (data.QRCode) {
          // data.qrCodeVisibility = true
          data.waitLogin = true
          clearInterval(data.timer) // 清除定时器
          data.timer = setInterval(ckeckLogin, 3000) // 设置定时器
        }
      } catch (e) {
        console.error(e)
        ElMessage.error('生成二维码失败！请重试或放弃')
      }
    }

    const showQrcode = async () => {
      data.qrCodeVisibility = true
    }

    const jumpLogin = async () => {
      const href = `openapp.jdmobile://virtual/ad?params={"category":"jump","des":"ThirdPartyLogin","action":"to","onekeylogin":"return","url":"https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${data.token}","authlogin_returnurl":"weixin://","browserlogin_fromurl":"${window.location.host}"}`
      window.location.href = href
    }

    const ckeckLogin = async () => {
      try {
        const body = await checkLoginAPI({
          token: data.token,
          okl_token: data.okl_token,
          cookies: data.cookies,
        })

        switch (body?.data.errcode) {
          case 0:
            localStorage.setItem('eid', body.data.eid)
            ElMessage.success(body.message)
            clearInterval(data.timer)
            router.push('/')
            break
          case 176:
            break
          default:
            ElMessage.error(body.message)
            data.waitLogin = false
            clearInterval(data.timer)
            break
        }
      } catch (error) {
        clearInterval(data.timer)
        data.waitLogin = false
      }
    }

    const CKLogin = async () => {
      const ptKey =
        data.cookie.match(/pt_key=(.*?);/) &&
        data.cookie.match(/pt_key=(.*?);/)[1]
      const ptPin =
        data.cookie.match(/pt_pin=(.*?);/) &&
        data.cookie.match(/pt_pin=(.*?);/)[1]
      if (ptKey && ptPin) {
        const body = await CKLoginAPI({ pt_key: ptKey, pt_pin: ptPin })
        if (body.code === 200 && body.data.eid) {
          localStorage.setItem('eid', body.data.eid)
          ElMessage.success(body.message)
        } else {
          ElMessage.error(body.message || 'cookie 解析失败，请检查后重试！')
        }
      } else {
        ElMessage.error('cookie 解析失败，请检查后重试！')
      }
    }

    onMounted(() => {
      getInfo()
      getQrcode()
    })

    return {
      ...toRefs(data),
      getInfo,
      getQrcode,
      showQrcode,
      ckeckLogin,
      jumpLogin,
      CKLogin,
    }
  },
}
</script>

<style scoped></style>
