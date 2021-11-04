import api from './index.js'

/**
 * get site info
 * @returns {Promise}
 */
export function getInfoApi() {
  return api.get('info').json()
}

/**
 * get site status
 * @returns {Promise}
 */
export function getStatusApi() {
  return api.get('status').json()
}

/**
 * get envs list
 * @returns {Promise}
 */
export function getEnvsApi() {
  return api.get(`envs`).json()
}
