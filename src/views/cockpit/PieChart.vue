<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/utils/mixins/resize'

let textColor = "#FFFFFF";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    name: String,
    color: Array,
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ dataList, color, seriesConfig, otherSeriesConfig, legendConfig ,word} = {}) {
      let total = 0;
      if (dataList && dataList.length) {
        dataList.map(i => {
          total = total + i.value
        })
      }
      this.chart.setOption({
        color,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          show: true,
          orient: "vertical",
          right: 50,
          top: 'left',
          itemGap: 14,
          icon: 'circle',
          data: dataList,
          formatter: (name) => {
            const currentItem = dataList.find((item) => item.name === name);
            if (currentItem) {
              return `${currentItem.name} ${Number(currentItem.value / total).toFixed(2) * 100}%`
            }
          },
          ...legendConfig
        },
        title:word,
        series: [
          {
            name: "命令",
            type: "pie",
            radius: [60, 75],
            center: ["35%", "50%"],
            data: dataList,
            animationEasing: "cubicInOut",
            animationDuration: 1000,
            label: {
              show: false
            },
            ...seriesConfig
          },{
            radius: [45, 46],
            center: ['35%', '50%'],
            type: 'pie',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            animation: false,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#093244'
              }
            },
            data: [{value: 1}],
            ...otherSeriesConfig
          }
        ],
      })
    }
  }
}
</script>
