import service from '@/utils/request'

// 号段列表
export function postSegment (data) {
  return service({
    url: '/integration/admin/segment/page',
    method: 'post',
    data
  })
}

// 新增
export function postSegmentCreate (data) {
  return service({
    url: '/integration/admin/segment/create',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param {*} data 
 */
export function putSegmentModify (data) {
  return service({
    url: '/integration/admin/segment/modify',
    method: 'put',
    data
  })
}
