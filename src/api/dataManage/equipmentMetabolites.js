import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/config/datathreshold/pageList',
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
export function getData(targetCode, targetType) {
  return request({
    url: '/config/datathreshold/detail',
    method: 'get',
    params: {targetCode, targetType}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 增加
export function addData(data) {
  return request({
    url: '/config/datathreshold/add',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 修改
export function updateData(data) {
  return request({
    url: '/config/datathreshold/update',
    method: 'post',
    data: data
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 删除
export function delData(ids) {
  return request({
    url: '/config/datathreshold/deletes',
    method: 'post',
    data: Array.isArray(ids) ? ids : [ids]
  })
}
