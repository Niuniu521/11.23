import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/pipenetwork/treatmentplants',
    method: 'get',
    params: query
  }).then(res => {
    let data = {
      records: [],
      total: 0
    };
    if (res.code === 200) {
      data = res.data;
    }

    return data;
  })
}

// 查询详细
export function getData(id) {
  return request({
    url: '/pipenetwork/treatmentplants/' + id,
    method: 'get'
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 新增
export function addData(data) {
  return request({
    url: '/pipenetwork/treatmentplants',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 修改
export function updateData(data) {
  return request({
    url: '/pipenetwork/treatmentplants',
    method: 'put',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 绑定窨井
export function bindYJ(data) {
  return request({
    url: '/pipenetwork/treatmentplants/binds',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 绑定影响区域
export function bindArea(data) {
  return request({
    url: '/pipenetwork/treatmentplantcoverarea',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 删除
export function delData(id) {
  return request({
    url: '/pipenetwork/treatmentplants/' + id,
    method: 'delete'
  })
}

// 导出
export function exportData(query) {
  return request({
    url: '/pipenetwork/treatmentplants/export',
    method: 'get',
    params: query
  })
}
