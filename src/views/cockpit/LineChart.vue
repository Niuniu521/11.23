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
    color: {
      type: String,
      default: '#FFEE7C'
    },
    areaColor: {
      type: Array
    },
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
    getLine({name, data, areaColor, color, seriesConfig,average}) {
      return {
        name,
        smooth: true,
        type: 'line',
        symbolSize: 6,
        connectNulls: true,
        itemStyle: {
          normal: {
            color: color,
            lineStyle: {
              color: color,
              width: 2
            },
            ...((areaColor && areaColor.length) ? {
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {"offset": 1, "color": areaColor[1]}, /* 100% 处的颜色*/
                    {"offset": 0.5, "color": areaColor[0]} /*0% 处的颜色*/
                  ],
                  "globalCoord": false // 缺省为 false
                },
                opacity: 0.2
              }
            }: {})
          }
        },
        data,
        markLine: average,
        animationDuration: 2000,
        animationEasing: 'quadraticOut',
        ...seriesConfig
      }
    },
    setOptions({ xAxisData, dataList, legendConfig, gridConfig, lines } = {}) {
      let series = [this.getLine({name: this.name, data: dataList, areaColor: this.areaColor, color: this.color})];

      if (lines && lines.length) {
        series = [];
        lines.map(item => {
          series.push(this.getLine(item))
        })
      }
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: xAxisData,
          boundaryGap: false,
          axisLabel: {color: textColor},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: "#525D70",
              opacity: 0.2
            }
          },
        },
        grid: {
          left: "3%",
          right: "7%",
          bottom: 10,
          top: 10,
          containLabel: true,
          ...gridConfig
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'},
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          color: textColor,
          nameTextStyle: {color: textColor, fontSize: 12},
          axisLabel: {color: textColor},
          axisTick: {show: false},
          axisLine: {show: false},
          splitArea: {show: false},
          splitLine: {lineStyle: {color: "#0A3B52", type: "dashed"}}
        },
        legend: {
          show: false,
          textStyle: {
            color: textColor,
          },
          ...legendConfig
        },
        series
      })
    }
  }
}
</script>
