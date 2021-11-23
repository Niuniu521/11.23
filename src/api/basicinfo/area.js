import request from '@/utils/request'

// 查询树列表
export function getTreeData(query) {
  return request({
    url: '/basic/jx-area/getAllByParentId',
    method: 'get',
    params: query
  }).then(res => {
    let data = [];
    if (res.code === 200) {
      data = res.data;

      function loopData(list) {
        list.map(v => {
          if (v.childs.length) {
            loopData(v.childs)
          } else {
            v.childs = null
          }
        })
      }
      loopData(data);
    }

    return data;
  })
}

// 查询列表
export function listData(query) {
  return request({
    url: '/basic/jx-area/getAreas',
    method: 'get',
    params: query
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
export function getData(id) {
  return request({
    url: '/pipenetwork/pumpstations/' + id,
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
    url: '/basic/jx-area/addOrUpdate',
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
    url: '/basic/jx-area/addOrUpdate',
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
    url: '/basic/jx-area/deleteById',
    method: 'get',
    params: {
      id
    }
  })
}

// 导出
export function exportData(query) {
  return request({
    url: '/pipenetwork/pumpstations/export',
    method: 'get',
    params: query
  })
}
// Q值查询省市区
export function getPcity(query) {
  return request({
    url: '/basic/jx-area/getByAreaLevel',
    method: 'get',
    params: query
  })
}