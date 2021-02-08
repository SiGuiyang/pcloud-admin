import service from '@/utils/request'

// table list
export function fetchLogList (data) {
  return service({
    url: '/log/admin/action/page',
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
    url: '/log/admin/action/statistics',
    method: 'post',
    data
  })
}
