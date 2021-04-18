import service from '@/utils/request'

// table list
export function postDeptPage (data) {
  return service({
    url: '/admin/dept/page',
    method: 'post',
    data
  })
}

// 新增
export function postDeptCreate (data) {
  return service({
    url: '/admin/dept/create',
    method: 'post',
    data
  })
}

// 修改系统部门
export function putDeptModify (data) {
  return service({
    url: '/admin/dept/modify',
    method: 'put',
    data
  })
}

// 删除部门
export function deleteDept (data) {
  return service({
    url: `/admin/dept/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取部门
export function postDeptList (data) {
  return service({
    url: '/admin/dept/list',
    method: 'post',
    data
  })
}

// 获取部门树
export function postDeptTree (data) {
  return service({
    url: '/admin/dept/tree',
    method: 'post',
    data
  })
}

// 获取部门架构
export function getDeptOrg (data) {
  return service({
    url: '/admin/dept/org',
    method: 'get'
  })
}
