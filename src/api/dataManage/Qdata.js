import request from '@/utils/request'

// 查询列表
export function listData(query) {
    return request({
        url: '/qvalues',
        method: 'get',
        params:query
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
        url: '/qvalues',
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
        url: '/qvalues',
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
        url: '/qvalues/deletes',
        method: 'post',
        data: Array.isArray(ids) ? ids : [ids]
    })
}
//污水厂下拉框
export function getSewage(query) {
  return request({
      url: '/pipenetwork/treatmentplants',
      method: 'get',
      params:query
  })
}