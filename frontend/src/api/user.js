import api from './index'

export function LoginCookieApi(data) {
  return api
    .post('login/cookie', {
      json: data,
    })
    .json()
}

export function getUsersApi(id) {
  return api.get(`users/${id}`).json()
}

export function delUsersApi(id) {
  return api.delete(`users/${id}`).json()
}

export function addUserEnvApi(data) {
  return api.post(`envs`, data).json()
}

export function updateUserEnvApi(id, data) {
  return api.put(`envs/${id}`, data).json()
}

export function delUserEnvApi(id) {
  return api.delete(`envs/${id}`).json()
}
