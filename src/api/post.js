import service from '@/utils/request'

// table list
export function postPostPage (data) {
  return service({
    url: '/admin/post/page',
    method: 'post',
    data
  })
}

// 新增
export function postPostCreate (data) {
  return service({
    url: '/admin/post/create',
    method: 'post',
    data
  })
}

// 修改系统部门
export function putPostModify (data) {
  return service({
    url: '/admin/post/modify',
    method: 'put',
    data
  })
}

// 删除部门
export function deletePost (data) {
  return service({
    url: `/admin/post/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取部门
export function postPostList (data) {
  return service({
    url: '/admin/post/list',
    method: 'post',
    data
  })
}
