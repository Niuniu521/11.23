import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/basic/jx-detection-device-alarm-record/pageList',
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
    url: '/alarm/detail',
    method: 'get',
    params: {id}
  }).then(res => {
    if (res.code === 200) {
      return res.data;
    }
  })
}

// 删除
export function delData(id) {
  return request({
    url: '/basic/jx-detection-device-alarm-record/deletes',
    method: 'post',
    data: Array.isArray(ids) ? ids : [ids]
  })
}

