import service from '@/utils/request'

// table list
export function fetchLogList (data) {
  return service({
    url: '/admin/log/action/page',
    method: 'post',
    data
  })
}

/**
 * 首页访问
 * @param {*} data 
 */
export function postStatistics (data) {
  return service({
    url: '/admin/log/action/statistics',
    method: 'post',
    data
  })
}
