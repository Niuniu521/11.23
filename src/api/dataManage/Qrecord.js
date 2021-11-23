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
//毒品浓度
export function drugConcen() {
  return request({
      url: '/qvalues/ofarea',
      method: 'get',
      
  }).then(res => {
      if (res.code === 200) {
          return res.data;
          
      }
  })
}
// 修改
export function updateData(data) {
    return request({
        url: '/composite-value/addOrUpdate',
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
        url: '/composite-value/deletes',
        method: 'post',
        data: Array.isArray(ids) ? ids : [ids]
    })
}

//综合消费指标
export function consumeValue(query) {
    return request({
        url: '/composite-value/consumeValue',
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