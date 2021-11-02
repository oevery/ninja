<template>
  <div class="content">
    <div class="card-no-shodow">
      <div class="card-header">
        <p class="card-title">个人中心</p>
      </div>
      <div class="card-body">
        <p>昵称：{{ nickName }}</p>
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
            <el-select v-model="currentEnv" placeholder="变量" size="small">
              <el-option
                v-for="env in envs"
                :key="env.value"
                :value="env.value"
                :label="env.description"
              ></el-option>
            </el-select>
          </div>
          <el-input class="ml-3 mr-3" size="small"></el-input>
          <el-button size="small">add</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" width="120px" align="center" />
          <el-table-column prop="value" label="值" min-width="200px" show-overflow-tooltip />
          <el-table-column
            prop="updated_at"
            label="更新时间"
            width="80px"
            :formatter="formatDate"
            align="center"
          />
          <el-table-column align="center" width="122px" label="操作">
            <template #default="scope">
              <el-icon color="#409EFF" size="20" class="mr-3 cursor-pointer" title="修改">
                <edit />
              </el-icon>
              <el-icon color="#F56C6C" size="20" class="cursor-pointer" title="删除">
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

<script>
import { getUsersApi, delUsersApi } from '@/api/user'
import { getEnvsApi } from '@/api/env'
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Edit, Delete } from '@element-plus/icons'
import store from '@/store'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ElMessage } from 'element-plus'

export default {
  components: {
    Edit,
    Delete,
  },

  setup() {
    const router = useRouter()

    let data = reactive({
      nickName: undefined,
      updated_at: undefined,
      tableData: [],
      envs: [],
      currentEnv: '',
    })

    const getInfo = async () => {
      const json = await getUsersApi(store.state.user.id)
      if (!json.data) {
        ElMessage.error('获取用户信息失败，请刷新重试或重新登录')
        return
      }
      data.nickName = json.data.nickname
      data.updated_at = new Date(
        json.data.updated_at || json.data.created_at
      ).toLocaleString()
      data.tableData = json.data.envs
    }

    const getEnvs = async () => {
      const json = await getEnvsApi()
      data.envs = json.data || []
    }

    const logout = () => {

      store.removeUserAction()
      router.push('/login')
    }

    const delAccount = async () => {
      const { code } = await delUsersApi(store.state.user.id)
      if (code === 200) {
        ElMessage.success(body.message)
        setTimeout(() => {
          logout()
        }, 1000)
      }
    }

    const openUrlWithJD = (url) => {
      const params = encodeURIComponent(
        `{"category":"jump","des":"m","action":"to","url":"${url}"}`
      )
      window.location.href = `openapp.jdmobile://virtual?params=${params}`
    }

    dayjs.extend(relativeTime)
    dayjs.locale('zh-cn')
    const formatDate = (row, column, cellValue, index) => {
      return dayjs(cellValue).fromNow()
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

    onMounted(() => {
      getInfo()
      getEnvs()
    })

    return {
      Edit,
      Delete,
      ...toRefs(data),
      activity,
      getInfo,
      logout,
      delAccount,
      openUrlWithJD,
      formatDate,
    }
  },
}
</script>
