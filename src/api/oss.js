import service from '@/utils/request'

// 下载文件
export function downloadFile (data) {
  return service({
    url: `/oss/download/${data.ossKey}/${data.fileName}/${data.ossType}`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 云服务桶列表
 * @param {*} data 
 */
export function getBucket (data) {
  return service({
    url: `/oss/cloud/bucket/${data.ossType}`,
    method: 'get'
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
