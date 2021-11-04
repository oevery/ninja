import store from '@/store'
import { ElMessage } from 'element-plus'
import ky from 'ky'

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = ky.extend({
  prefixUrl: VITE_API_BASE_URL,
  retry: { limit: 0 },
  hooks: {
    beforeRequest: [
      (request) => {
        if (request.headers.get('Authorization')) {
          return
        }
        const token = store.state.user.token
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const { message } = await response.json()
          ElMessage.error(message || response.statusText)
        }
        if (response.status === 401) {
          store.removeUserAction()
          window.location.href = '/login'
        }
      },
    ],
  },
})

export default api
