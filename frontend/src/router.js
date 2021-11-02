import store from '@/store'
import Index from '@/views/index.vue'
import Login from '@/views/login.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from) => {
  // not login redirect to login
  if (!store.state.user.token && to.path !== '/login') {
    console.log('redirect to login')
    router.replace('/login')
  }

  // login redirect to index
  if (store.state.user.token && to.path === '/login') {
    console.log('redirect to index')
    router.replace('/')
  }
})

export default router
