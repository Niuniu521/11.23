export function  monthDate(a){
        const loadYear = new Date().getFullYear()
        let loadMonth = new Date().getMonth() + 1
        let loadDay = new Date().getDate()
        if (loadMonth >= 1 && loadMonth <= 9) {
          loadMonth = '0' + loadMonth
        }
        if (loadDay >= 0 && loadDay <= 9) {
          loadDay = '0' + loadDay
        }
        const date = loadYear + '-' + loadMonth + '-' + loadDay
        const dates = new Date()
        dates.setMonth(dates.getMonth() - 1)
        var pastMonth = dates.getMonth() + 1
        var pastDay = dates.getDate()
        if (pastMonth >= 1 && pastMonth <= 9) {
          pastMonth = '0' + pastMonth
        }
        if (pastDay >= 0 && pastDay <= 9) {
          pastDay = '0' + pastDay
        }
        const endDate = dates.getFullYear() + '-' + pastMonth + '-' + pastDay
  //       console.log(endDate);
  //       console.log(date);
  var arr=[endDate,date]
  var str=arr.toString()
  a=str
      
  return a
  }