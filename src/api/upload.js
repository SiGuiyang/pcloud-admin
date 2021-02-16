import service from '@/utils/request'

// table list
export function postUploadPage (data) {
  return service({
    url: '/admin/upload/page',
    method: 'post',
    data
  })
}

// 新增
export function postUploadCreate (data) {
  return service({
    url: '/admin/upload/create',
    method: 'post',
    data
  })
}

// 修改
export function putUploadModify (data) {
  return service({
    url: '/admin/upload/modify',
    method: 'put',
    data
  })
}

// 删除
export function deleteUpload (data) {
  return service({
    url: `/admin/upload/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取
export function postUploadList (data) {
  return service({
    url: '/admin/upload/list',
    method: 'post',
    data
  })
}
