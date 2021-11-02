import { reactive } from 'vue'

const store = {
  state: reactive({
    info: {
      title: localStorage.getItem('title') || 'Ninja',
      version: localStorage.getItem('version') || 'unknow',
      notice: JSON.parse(localStorage.getItem('notice')) || {},
      login_notice: JSON.parse(localStorage.getItem('login_notice')) || {},
    },
    user: {
      id: localStorage.getItem('user_id') || undefined,
      token: localStorage.getItem('user_token') || undefined,
    },
  }),
  setInfoAction(info) {
    this.state.info = info
    localStorage.setItem('title', info.title)
    localStorage.setItem('version', info.version)
    localStorage.setItem('notice', JSON.stringify(info.notice))
    localStorage.setItem('login_notice', JSON.stringify(info.login_notice))
  },
  setUserAction(user) {
    this.state.user = user
    localStorage.setItem('user_id', user.id)
    localStorage.setItem('user_token', user.token)
  },
  removeUserAction() {
    this.state.user = {
      id: undefined,
      token: undefined,
    }
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_token')
  },
}

export default store
