import service from '@/utils/request'
import Config from '@/utils/config'

/**
 * 密码登陆
 * @param username 用户名
 * @param password 密码
 */
export function loginByUsername (username, password) {
  const data = {
    phone: username,
    password,
    grantType: 'ADMIN'
  }
  return service({
    auth: {
      username: Config.client_id,
      password: Config.client_secret
    },
    url: '/oauth/token',
    method: 'post',
    data
  })
}

export function logout (data) {
  return service({
    url: '/admin/logout',
    method: 'post',
    data
  })
}

export function getUserInfo (sysCode) {
  const data = {
    sysCode
  }
  return service({
    url: '/admin/system/adminInfo',
    method: 'post',
    data
  })
}

