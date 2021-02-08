import service from '@/utils/request'

// table list
export function postGradePage (data) {
  return service({
    url: '/admin/grade/page',
    method: 'post',
    data
  })
}

// 新增
export function postGradeCreate (data) {
  return service({
    url: '/admin/grade/create',
    method: 'post',
    data
  })
}

// 修改职级
export function putGradeModify (data) {
  return service({
    url: '/admin/grade/modify',
    method: 'put',
    data
  })
}

// 删除职级
export function deleteGrade (data) {
  return service({
    url: `/admin/grade/${data.id}/delete`,
    method: 'delete'
  })
}

// 获取职级
export function postGradeList (data) {
  return service({
    url: '/admin/grade/list',
    method: 'post',
    data
  })
}
