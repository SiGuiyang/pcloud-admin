import service from '@/utils/request'

// 下载文件
export function downloadFile (data) {
  return service({
    url: '/oss/download',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

/**
 * 云服务桶列表
 * @param {*} data 
 */
export function getBucket (data) {
  return service({
    url: '/oss/cloud/bucket',
    method: 'get',
    params: data
  })
}

/**
 * 云服务文件列表
 * @param {*} data 
 */
export function postObjects (data) {
  return service({
    url: '/oss/cloud/objects',
    method: 'post',
    data
  })
}
