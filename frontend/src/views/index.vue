<template>
  <div class="content">
    <div class="card-no-shodow">
      <div class="card-header">
        <p class="card-title">个人中心</p>
      </div>
      <div class="card-body">
        <p>昵称：{{ nickname }}</p>
        <p>更新时间：{{ updated_at }}</p>
      </div>
      <div class="card-footer">
        <el-button size="small" auto @click="logout">退出登录</el-button>
        <el-button type="danger" size="small" auto @click="delAccount">删除账号</el-button>
      </div>
    </div>

    <div class="card-no-shodow">
      <div class="card-header">
        <p class="card-title">变量管理</p>
      </div>
      <div class="card-body pl-0 pr-0">
        <div class="p-4 flex justify-around">
          <div>
            <el-select v-model="addEnvName" placeholder="变量" size="small">
              <el-option
                v-for="env in envs"
                :key="env.value"
                :value="env.value"
                :label="env.description"
                :disabled="env.disabled"
                @change="addEnvSelectionChange"
              ></el-option>
            </el-select>
          </div>
          <el-input
            v-model="addEnvValue"
            :placeholder="addEnvPlaceholder"
            class="ml-3 mr-3"
            size="small"
          />
          <el-button size="small" :loading="isAddEnvLoading" @click="addEnv">添加</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="120px"
            align="center"
            :formatter="formatTitle"
          />
          <el-table-column prop="value" label="值" min-width="200px" show-overflow-tooltip />
          <el-table-column
            prop="updated_at"
            label="更新时间"
            width="100px"
            :formatter="formatDate"
            align="center"
          />
          <el-table-column align="center" width="122px" label="操作">
            <template #default="scope">
              <el-icon
                color="#409EFF"
                size="20"
                class="mr-3 cursor-pointer"
                title="修改"
                @click="editEnv"
              >
                <edit />
              </el-icon>
              <el-icon
                color="#F56C6C"
                size="20"
                class="cursor-pointer"
                title="删除"
                @click="delEnv(scope.row.id)"
              >
                <delete />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card-footer"></div>
    </div>

    <div class="card-no-shodow">
      <div class="card-header">
        <p class="card-title">常见活动位置</p>
        <span class="card-subtitle">下面是一些常见活动的位置</span>
      </div>
      <div class="card-body">
        <ul>
          <li v-for="(item, index) in activity" :key="index" class="leading-normal">
            <span>{{ item.name }}：</span>
            <span class="pr-2">{{ item.address }}</span>
            <a
              v-if="item.href"
              class="text-blue-400"
              href="#"
              @click="openUrlWithJD(item.href)"
            >直达链接</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getEnvsApi } from '@/api/common'
import { addUserEnvApi, delUserEnvApi, delUsersApi, getUsersApi } from '@/api/user'
import store from '@/store'
import { wait } from '@/utils'
import { Delete, Edit } from '@element-plus/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// get user info
const nickname = ref('')
const updated_at = ref('')
const tableData = ref([])
async function getUserInfo() {
  const { data } = await getUsersApi()
  if (!data) {
    throw new Error('获取用户信息失败，请刷新重试或重新登录')
  }
  nickname.value = data.nickname
  updated_at.value = dayjs(data.updated_at).fromNow()
  tableData.value = data.envs
}

// get envs
const envs = ref([])
async function getEnvs() {
  const { data } = await getEnvsApi()
  await Promise.all(data.map(async (item) => {
    const created = _.some(tableData.value, { name: item.value });
    if (item.single && created) {
      item.disabled = true
    } else {
      item.disabled = false
    }
  }))
  envs.value = data || []
}

// add env
const addEnvName = ref('')
const addEnvValue = ref('')
const isAddEnvLoading = ref(false)
const addEnvPlaceholder = ref("请输入变量值")

async function addEnvSelectionChange(value) {
  const item = _.find(envs.value, { value })
  addEnvPlaceholder.value = item.placeholder || "请输入变量值";
}

async function addEnv() {
  try {
    isAddEnvLoading.value = true
    if (!addEnvName.value) {
      throw new Error('请选择变量')
    }
    if (!addEnvValue.value) {
      throw new Error('请输入变量值')
    }
    const { data, message } = await addUserEnvApi({
      name: addEnvName.value,
      value: addEnvValue.value,
    })
    if (!data) {
      throw new Error('添加失败，请重试')
    }
    await getUserInfo()
    ElMessage.success(message || '变量添加成功')
    addEnvValue.value = ''
  } catch (error) {
    if (error.response) return
    ElMessage.error(error.message)
  } finally {
    isAddEnvLoading.value = false
  }
}

// edit env
async function editEnv() { }

// del env
async function delEnv(id) {
  const { message } = await delUserEnvApi(id)
  if (message) {
    await getUserInfo()
    ElMessage.success(message)
  }
}

// logout
function logout() {
  store.removeUserAction()
  const router = useRouter()
  router.push('/login')
}

// del account
async function delAccount() {
  const { code } = await delUsersApi()
  if (code === 200) {
    ElMessage.success(body.message)
    await wait(1000)
    logout()
  }
}

// format updated_at
function formatDate(row, column, cellValue, index) {
  if (!cellValue) return dayjs(row.created_at).fromNow()
  return dayjs(cellValue).fromNow()
}

// format name
function formatTitle(row, column, cellValue, index) {
  return _.find(envs.value, { value: cellValue })?.description || cellValue
}

const openUrlWithJD = (url) => {
  const params = encodeURIComponent(
    `{"category":"jump","des":"m","action":"to","url":"${url}"}`
  )
  window.location.href = `openapp.jdmobile://virtual?params=${params}`
}

const activity = [
  {
    name: '玩一玩（可找到大多数活动）',
    address: '京东 APP 首页-频道-边玩边赚',
    href: 'https://funearth.m.jd.com/babelDiy/Zeus/3BB1rymVZUo4XmicATEUSDUgHZND/index.html',
  },
  {
    name: '宠汪汪',
    address: '京东APP-首页/玩一玩/我的-宠汪汪',
  },
  {
    name: '东东萌宠',
    address: '京东APP-首页/玩一玩/我的-东东萌宠',
  },
  {
    name: '东东农场',
    address: '京东APP-首页/玩一玩/我的-东东农场',
  },
  {
    name: '东东工厂',
    address: '京东APP-首页/玩一玩/我的-东东工厂',
  },
  {
    name: '东东超市',
    address: '京东APP-首页/玩一玩/我的-东东超市',
  },
  {
    name: '领现金',
    address: '京东APP-首页/玩一玩/我的-领现金',
  },
  {
    name: '东东健康社区',
    address: '京东APP-首页/玩一玩/我的-东东健康社区',
  },
  {
    name: '京喜农场',
    address: '京喜APP-我的-京喜农场',
  },
  {
    name: '京喜牧场',
    address: '京喜APP-我的-京喜牧场',
  },
  {
    name: '京喜工厂',
    address: '京喜APP-我的-京喜工厂',
  },
  {
    name: '京喜财富岛',
    address: '京喜APP-我的-京喜财富岛',
  },
  {
    name: '京东极速版红包',
    address: '京东极速版APP-我的-红包',
  },
]

onMounted(async () => {
  try {
    const promises = Promise.all([getUserInfo(), getEnvs()])
    await promises
  } catch (error) {
    if (error.response) return
    ElMessage.error(error.message)
  }
})
</script>
