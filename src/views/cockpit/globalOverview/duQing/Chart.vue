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
    setOptions(data = {}) {
      let value = data.value;
      let max = 100;
     let degrees = 210 - (240 * value) / max; //蓝色刻度尺计算


      let num = value / max;
      let colorSet = [
        [num, "#77d7f5"],
        [1, "#192d48"]
      ];
      let centerArr = ["50%", "50%"];

      this.chart.setOption({
        series: [{
          name: "白色圈刻度",
          type: "gauge",
          radius: "100%",
          splitNumber: 14,
          center: centerArr,
          startAngle: 210,
          endAngle: -30,
          z: 4,
          axisTick: {
            show: false
          },
          splitLine: {
            length: 35, //刻度节点线长度
            lineStyle: {
              width: 3,
              color: "#101f33"
            } //刻度节点线
          },
          axisLabel: {
            show: false,
            color: "#",
            fontSize: 12
          }, //刻度节点文字颜色
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              opacity: 0
            }
          },
          detail: {
            show: false
          },
          data: [{
            value: 0,
            name: ""
          }]
        },
          {
            name: "紫色外圈", //刻度背景
            type: "gauge",
            z: 2,
            radius: "100%",
            splitNumber: 2,
            startAngle: 210,
            endAngle: -30,
            min: 0,
            max: max,
            center: centerArr, //整体的位置设置
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: colorSet,
                width: 10,
                opacity: 1 //刻度背景宽度
              }
            },
            splitLine: {
              show: false
            },
            data: [{
              show: false,
              value: "80"
            }],
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            detail: {
              show: 0
            }
          },
          ...(value ? [
            {
              name: "紫色刻度尺", //刻度背景
              type: "gauge",
              z: 5,
              radius: "70%",
              splitNumber: 3,
              startAngle: 210,
              endAngle: degrees,
              center: centerArr, //整体的位置设置
              axisLine: {
                // 坐标轴线
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [
                    [0.8, "#00B3FE"],
                    [1, "#212D43"]
                  ],
                  width: 10,
                  opacity: 0 //刻度背景宽度
                }
              },
              data: [{value}],
              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: "#FFF",
                  width: 1
                },
                length: 8,
                splitNumber: value / 10
              },
              detail: {
                formatter: function(params) {//图表中间文字数据展示
                  return (
                    "{gray|" + data.title + "\n" + "}{white|" + value + "\n" + "}{company|" + data.company + "}"
                  );
                },
                rich: {
                  gray: {
                    fontSize: 12,
                    color: "#FFF",
                  },
                  white: {
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#71ceeb",
                    padding: [20, 0, 5, 0]
                  },
                  company: {
                    fontSize: 14,
                    color: "#71dba7",
                    fontWeight: 700,
                  }
                },
                offsetCenter: ["0", "35%"]
              },
              splitLine: {
                show: false
              }
            }
          ] : []),
          {
            radius: [40, 41],
            z: 4,
            center: ['50%', '50%'],
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
                color: '#28354e'
              }
            },
            data: [{value: 1}],
          },
          {
            radius: [0, 35],
            z: 4,
            center: ['50%', '50%'],
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
                color: '#192d48'
              }
            },
            data: [{value: 1}],
          }
        ]
      })
    }
  }
}
</script>
