import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/pipenetwork/residentials',
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
    url: '/pipenetwork/residentials/' + id,
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
    url: '/pipenetwork/residentials',
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
    url: '/pipenetwork/residentials',
    method: 'put',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

export function bindYJ(data) {
  return request({
    url: '/pipenetwork/residentials/batch_bind_outlets',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      data = res.data;
      return data;
    }
  })
}

// 查询详细
export function getYJ(residentialCode) {
  return request({
    url: 'pipenetwork/residentials/outlets',
    method: 'get',
    params: {residentialCode}
  }).then(res => {
    console.log("res:", res);
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 删除
export function delData(id) {
  return request({
    url: '/pipenetwork/residentials/' + id,
    method: 'delete'
  })
}

// 导出
export function exportData(query) {
  return request({
    url: '/pipenetwork/residentials/export',
    method: 'get',
    params: query
  })
}
