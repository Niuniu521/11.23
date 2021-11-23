import request from '@/utils/request'
//溯源战果统计
 export function countsData(query) {
    return request({
      url: '/alarm-record/traceResultCount',
      method: 'get',
      params: query={
        timeType:1
      }
    }).then(res => {
      let data =res.data;
      return data;

    })
  }

//溯源战果列表
  export function listData(query) {
    return request({
      url: '/alarm-record/traceResultList',
      method: 'get',
      params: query={
        timeType:1
      }
    }).then(res => {
      let data =res.data;
      return data;
    })
  }

