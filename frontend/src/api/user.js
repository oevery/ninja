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
