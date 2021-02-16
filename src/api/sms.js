import service from '@/utils/request'

// table list
export function postSmsPage (data) {
  return service({
    url: '/integration/admin/sms/page',
    method: 'post',
    data
  })
}

// 新增
export function postSmsCreate (data) {
  return service({
    url: '/integration/admin/sms/create',
    method: 'post',
    data
  })
}

// 修改
export function putSmsModify (data) {
  return service({
    url: '/integration/admin/sms/modify',
    method: 'put',
    data
  })
}

// 删除
export function deleteSms (data) {
  return service({
    url: `/integration/admin/sms/${data.id}/delete`,
    method: 'delete'
  })
}
