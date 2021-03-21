import service from '@/utils/request'

// table list
export function postOpenPage (data) {
  return service({
    url: '/open/admin/account/page',
    method: 'post',
    data
  })
}

// 新增
export function postAccountCreate (data) {
  return service({
    url: '/open/admin/account/create',
    method: 'post',
    data
  })
}

// 更新状态
export function putAccountStatus (data) {
  return service({
    url: '/open/admin/account/status',
    method: 'put',
    data
  })
}

// 查看
export function getAccountView (data) {
  return service({
    url: `/open/admin/account/${data.id}/view`,
    method: 'get'
  })
}

// 删除
export function deleteAccount (data) {
  return service({
    url: `/open/admin/account/${data.id}/delete`,
    method: 'delete'
  })
}

// table list
export function postOpenResourcePage (data) {
  return service({
    url: '/open/admin/resource/page',
    method: 'post',
    data
  })
}

// table list
export function postOpenResourceList (data) {
  return service({
    url: '/open/admin/resource/list',
    method: 'post',
    data
  })
}

// 新增
export function addOpenResource (data) {
  return service({
    url: '/open/admin/resource/create',
    method: 'post',
    data
  })
}

// 修改
export function modifyOpenResource (data) {
  return service({
    url: '/open/admin/resource/modify',
    method: 'put',
    data
  })
}

// 删除
export function deleteOpenResource (data) {
  return service({
    url: `/open/admin/resource/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取授权
export function postOpenPermission (data) {
  return service({
    url: `/open/admin/resource/permission`,
    method: 'post',
    data
  })
}

// 授权
export function postOpenGrant (data) {
  return service({
    url: `/open/admin/resource/grant`,
    method: 'post',
    data
  })
}

// 刷新
export function getOpenRefresh (data) {
  return service({
    url: `/open/admin/resource/${data.accountId}/refresh`,
    method: 'get'
  })
}
