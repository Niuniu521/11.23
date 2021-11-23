import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/alarm-task/taskPage',
    method: 'post',
    data: query
  }).then(res => {
    let data = {
      records: [],
      total: 0
    };
    if (res.code === 200 && res.data) {
      data = res.data;
    }

    return data;
  })
}

// 查询详细
export function getTaskData(taskCode) {
  return request({
    url: '/alarm-task/taskLocationList',
    method: 'post',
    data: {taskCode}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 新增
export function reportNew(data) {
  return request({
    url: '/alarm-task/reportNew',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 导出数据
export function exportData(query) {
  return request({
    url: '/alarm-task/exportData',
    method: 'get',
    params: query
  })
}

// 导出模版
export function exportTemplate(query) {
  return request({
    url: '/alarm-task/exportTemplate',
    method: 'get',
    params: query
  })
}
//导入
export function importData(taskCode) {
  return request({
    url: '/alarm-task/importData',
    method: 'post',
    data: {taskCode}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

//完成任务
export function finishTask(taskCode) {
  return request({
    url: '/alarm-task/finishTask',
    method: 'post',
    data: {taskCode}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}
