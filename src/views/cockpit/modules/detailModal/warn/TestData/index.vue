<template>
<div>
  单位：(ng/L)
    <LineChart
    name="检测数据"
    height="210px"
    width="980px"
    :chartData="chartData"
    color="#00F0FF"
    :areaColor="['rgba(0, 240, 255, 0.8)', 'rgba(124, 255, 223, 0.1)']"
  />
</div>

</template>

<script>
import request from '@/utils/request';
import LineChart from "../../../../LineChart";
export default {
  components: {
    LineChart
  },
  props: {
    modalVal: Object
  },
  data() {
    return {
      kinds:"",
      chartData: {
        xAxisData: [],
        lines: [
          {
            name: "流量",
            data: [],
            color: "rgba(0, 198, 255, 1)",
            areaColor: ['rgba(0, 198, 255, 1)', 'rgba(0, 255, 216, 0)'],
          }, {
            name: "标准",
            data: [],
            seriesConfig: {
              symbolSize: 0,
              itemStyle: {
                normal: {
                  color: 'rgba(237, 145, 0, 1)',
                  lineStyle: {
                    color: 'rgba(245,8,26,0.9)',
                    width: 2,
                    type: 'dotted'
                  }
                }
              }
            }
          }
        ],

        legendConfig: {show: false},
        gridConfig: {top: 10},
      }
    }
  },
    watch: {
    modalVal: {
      handler(val) {
        if (val && val.id) {
          this.getModalVal(val.id);
        }
      },
      immediate: true,
    }
  },
  methods: {
        getModalVal(alarmId) {
        request({url: '/alarm-record/dataCurve', method: 'get', params: {alarmId}}).then(res => {   
        if (res.code === 200 && res.data) {
          // this.chartData.lines[0].name=res.data[0].factorCode
          console.log(this.kinds);
            this.chartData.xAxisData=res.data[0].timeValueDTO.timesStr
            this.chartData.lines[0].data=res.data[1].timeValueDTO.values
            this.chartData.lines[1].data=res.data[0].timeValueDTO.values   
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
