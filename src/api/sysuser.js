import service from '@/utils/request'

// 获取系统用户
export function postUserList (data) {
  return service({
    url: '/admin/system/user/page',
    method: 'post',
    data
  })
}

// 修改系统用户
export function postCreate (data) {
  return service({
    url: '/admin/system/user/create',
    method: 'post',
    data
  })
}

// 新增系统用户
export function putModify (data) {
  return service({
    url: '/admin/system/user/modify',
    method: 'put',
    data
  })
}

/**
 * 强踢下线
 * @param {*} id 
 */
export function postUserOffline (id) {
  return service({
    url: `/admin/system/user/${id}/offline`,
    method: 'get'
  })
}
