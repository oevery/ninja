import api from './index.js'

export function getInfoApi() {
  return api.get('info').json()
}

export function getStatusApi() {
  return api.get('status').json()
}
