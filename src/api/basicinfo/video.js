import request from '@/utils/request'

// 查询树列表
export function getTreeData(query) {
  return request({
    url: '/basic/jx-video/nListAll',
    method: 'get',
    params: query
  }).then(res => {
    let data = [];
    if (res.code === 200) {
      data = res.data;
    }

    return data;
  })
}

// 查询列表
export function listData(query) {
  return request({
    url: '/basic/jx-video/pageList',
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
    url: '/basic/jx-video/addOrUpdate',
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
    url: '/basic/jx-video/addOrUpdate',
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
    url: '/basic/jx-video/binds',
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
    url: '/basic/jx-video/deletes',
    method: 'post',
    data: Array.isArray(ids) ? ids : [ids]
  })
}
