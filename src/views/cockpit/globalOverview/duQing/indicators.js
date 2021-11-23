import request from '@/utils/request'
 export function indicatorsData(query) {
    return request({
      url: '/qvalues/comprehensive/dashboard',
      method: 'get',
      params: query
    }).then(res => {
      let data =res.data;
      return data;
    })
  }