import service from '@/utils/request'

// 运行报表
export function postJobStatistics (data) {
  return service({
    url: '/job/statistics',
    method: 'post',
    data
  })
}

// 运行报表
export function postJobChartInfo (data) {
  return service({
    url: '/job/chartInfo',
    method: 'post',
    data
  })
}

// table list
export function postJobList (data) {
  return service({
    url: '/job/jobinfo/pageList',
    method: 'post',
    data
  })
}

/**
 * 新增
 * @param {*} data 
 */
export function postJobAdd (data) {
  return service({
    url: '/job/jobinfo/add',
    method: 'post',
    data
  })
}

/**
 * 更新
 * @param {*} data 
 */
export function postJobUpdate (data) {
  return service({
    url: '/job/jobinfo/update',
    method: 'post',
    data
  })
}

/**
 * 下次执行时间
 * @param {*} data 
 */
export function postjobinfoNextTriggerTime (data) {
  return service({
    url: '/job/jobinfo/nextTriggerTime',
    method: 'get',
    params: data
  })
}

/**
 * job删除
 * @param {*} data 
 */
export function postJobRemove (data) {
  return service({
    url: `/job/jobinfo/${data.id}/remove`,
    method: 'post'
  })
}

/**
 * job停止
 * @param {*} data 
 */
export function postJobStop (data) {
  return service({
    url: `/job/jobinfo/${data.id}/stop`,
    method: 'post'
  })
}

/**
 * job启动
 * @param {*} data 
 */
export function postJobStart (data) {
  return service({
    url: `/job/jobinfo/${data.id}/start`,
    method: 'post'
  })
}

/**
 * 执行一次
 * @param {*} data 
 */
export function postTriggerJob (data) {
  return service({
    url: '/job/jobinfo/trigger',
    method: 'post',
    data
  })
}

/**
 * job调度日志
 * @param {*} data 
 */
export function postJoblogPageList (data) {
  return service({
    url: '/job/joblog/pageList',
    method: 'post',
    data
  })
}

/**
 * 根据jobGroup查询job
 * @param {*} data 
 */
export function getJobsByGroup (data) {
  return service({
    url: '/job/joblog/getJobsByGroup',
    method: 'get',
    params: data
  })
}

/**
 * 清空日志
 * @param {*} data 
 */
export function postJoblogClearLog (data) {
  return service({
    url: '/job/joblog/clearLog',
    method: 'post',
    data
  })
}

/**
 * 所有job执行器
 * @param {*} data 
 */
export function postJobgroupFindAll (data) {
  return service({
    url: '/job/jobgroup/findAll',
    method: 'post'
  })
}

/**
 * job执行器
 * @param {*} data 
 */
export function postJobgroupPageList (data) {
  return service({
    url: '/job/jobgroup/pageList',
    method: 'post',
    data
  })
}

/**
 * 保存执行器
 * @param {*} data 
 */
export function postJobgroupSave (data) {
  return service({
    url: '/job/jobgroup/save',
    method: 'post',
    data
  })
}

/**
 * 更新执行器
 * @param {*} data 
 */
export function postJobgroupUpdate (data) {
  return service({
    url: '/job/jobgroup/update',
    method: 'post',
    data
  })
}

/**
 * 删除执行器
 * @param {*} data 
 */
export function postJobGroupDelete (data) {
  return service({
    url: `/job/jobgroup/${data.id}/remove`,
    method: 'post'
  })
}

/**
 * 根据主键查询执行器
 * @param {*} data 
 */
export function postJobgroupLoadById (data) {
  return service({
    url: `/job/jobgroup/${data.id}/loadById`,
    method: 'post'
  })
}
