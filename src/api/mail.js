import service from '@/utils/request'

// 站内信列表
export function postMail (data) {
  return service({
    url: '/integration/admin/mail/page',
    method: 'post',
    data
  })
}

// 未读站内信数量
export function getMailQuantity () {
  return service({
    url: '/integration/admin/mail/quantity',
    method: 'get'
  })
}

/**
 * 详情
 * @param {*} data 
 */
export function postMailDetail (data) {
  return service({
    url: `/admin/mail/${data.id}/detail`,
    method: 'post',
    data
  })
}
