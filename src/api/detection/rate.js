import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/basic/jx-detection-rate/pageList',
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
export function getAreaData(id) {
  return request({
    url: '/basic/jx-detection-rate/CodesByArea',
    method: 'get',
    params: {id}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 新增
export function addData(data) {
  return request({
    url: '/basic/jx-detection-rate/addOrUpdate',
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
    url: '/basic/jx-detection-rate/addOrUpdate',
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
export function delData(ids) {
  return request({
    url: '/basic/jx-detection-rate/deletes',
    method: 'post',
    data: Array.isArray(ids) ? ids : [ids]
  })
}
