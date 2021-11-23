import request from '@/utils/request'
//滥用占比
 export function listData(query) {
    return request({
      url: '/alarm-record/factorRate',
      method: 'get',
      params: query={
        timeType:1
      }
    }).then(res => {
      let data =res.data;
      return data;
    })
  }