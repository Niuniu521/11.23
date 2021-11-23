import request from '@/utils/request'
//预警列表
 export function detectionData(query) {
    return request({
      url: '/alarm-record/poisonList',
      method: 'get',
      params: query={
        timeType:2
      }
    }).then(res => {
      let data =res.data;
      return data;
    })
  }
//预警统计
  export function statisticalData(query) {
    return request({
      url: '/alarm-record/poisonTotal',
      method: 'get',
      params: query={
        timeType:1
      }
    }).then(res => {
      let data =res.data;
      return data;
    })
  }