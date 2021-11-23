import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/pipenetwork/line/queryPage\n',
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

// 新增
export function addData(data) {
  return request({
    url: '/pipenetwork/line/addOrUpdate',
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
    url: '/pipenetwork/line/addOrUpdate',
    method: 'post',
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
    url: '/pipenetwork/line/binds',
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
    url: '/pipenetwork/line/deletes',
    method: 'post',
    data: Array.isArray(ids) ? ids : [ids]
  })
}
