import request from '@/utils/request'
//市县柱状图
 export function listData(query) {
    return request({
      url: '/qvalues/comprehensive/cities',
      method: 'get',
      params: query
    }).then(res => {
      let data =res.data;
      return data;
    })
  }

//省市柱状图
  export function  chartData(query) {
    return request({
      url: '/qvalues/comprehensive/provinces',
      method: 'get',
      params: query={provinceAreaCode:330000}
    }).then(res => {
      let data =res.data;
      return data;
    })
  }