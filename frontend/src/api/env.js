import api from './index'

export function getEnvsApi() {
  return api.get(`envs`).json()
}
