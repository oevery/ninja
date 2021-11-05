import store from '@/store'
import api from './index'

export function LoginCookieApi(data) {
  return api.post('login/cookie', { json: data }).json()
}

export function getUsersApi() {
  if (!store.state.user.id || !store.state.user.token) {
    throw new Error('获取用户信息失败！请先登录')
  }
  return api.get(`users/${store.state.user.id}`).json()
}

export function delUsersApi() {
  if (!store.state.user.id || !store.state.user.token) {
    throw new Error('获取用户信息失败！请先登录')
  }
  return api.delete(`users/${id}`).json()
}

export function addUserEnvApi(data) {
  if (!store.state.user.id || !store.state.user.token) {
    throw new Error('获取用户信息失败！请先登录')
  }
  return api.post(`users/${store.state.user.id}/envs`, { json: data }).json()
}

export function updateUserEnvApi(data) {
  if (!store.state.user.id || !store.state.user.token) {
    throw new Error('获取用户信息失败！请先登录')
  }
  return api
    .put(`users/${store.state.user.id}/envs/${id}`, { json: data })
    .json()
}

export function delUserEnvApi(id) {
  if (!store.state.user.id || !store.state.user.token) {
    throw new Error('获取用户信息失败！请先登录')
  }
  return api.delete(`users/${store.state.user.id}/envs/${id}`).json()
}
