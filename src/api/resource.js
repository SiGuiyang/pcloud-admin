import service from '@/utils/request'

// table list
export function postResourcePage (data) {
  return service({
    url: '/admin/resource/page',
    method: 'post',
    data
  })
}

// table list
export function postResourceList (data) {
  return service({
    url: '/admin/resource/list',
    method: 'post',
    data
  })
}

// table list
export function postResourceTree (data) {
  return service({
    url: '/admin/resource/tree',
    method: 'post',
    data
  })
}

// 新增
export function addResource (data) {
  return service({
    url: '/admin/resource/create',
    method: 'post',
    data
  })
}

// 修改
export function modifyResource (data) {
  return service({
    url: '/admin/resource/modify',
    method: 'put',
    data
  })
}

// 删除
export function deleteResource (data) {
  return service({
    url: `/admin/resource/${data.id}/delete`,
    method: 'delete'
  })
}
