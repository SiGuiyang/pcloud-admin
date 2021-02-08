import service from '@/utils/request'

// table list
export function fetchRoleList (data) {
  return service({
    url: '/admin/role/page',
    method: 'post',
    data
  })
}

// 新增
export function addRole (data) {
  return service({
    url: '/admin/role/create',
    method: 'post',
    data
  })
}

// 修改系统角色
export function modifyRole (data) {
  return service({
    url: '/admin/role/modify',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole (data) {
  return service({
    url: `/admin/role/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取角色
export function postRoleList (data) {
  return service({
    url: '/admin/role/list',
    method: 'post',
    data
  })
}

/**
 * 刷新缓存
 */
export function getRoleRefresh () {
  return service({
    url: '/admin/role/refresh',
    method: 'get'
  })
}

// 查看某个系统角色所具有的权限
export function postRolePermission (data) {
  return service({
    url: `/admin/role/${data.roleId}/menu`,
    method: 'post',
    data
  })
}

// 菜单授权
export function grantAuthorization (data) {
  return service({
    url: '/admin/permission/grant',
    method: 'post',
    data
  })
}

// 非路由级权限，按钮级权限
export function getPermission (data) {
  return service({
    url: '/admin/permission/' + data.id,
    method: 'get'
  })
}
