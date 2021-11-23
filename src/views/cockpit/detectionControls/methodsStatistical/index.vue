<template>
  <PieChart
    height="100%"
    :chartData="chartData"
  />
</template>

<script>
import PieChart from "../../PieChart";
export default {
  components: {
    PieChart
  },
  data() {
    return {
      chartData: {
        dataList: [
          {name: "固定设备检测", value: 30, itemStyle: {color: "#02FFBB"}},
          {name: "实验室检测", value: 20, itemStyle: {color: "#FD9F25"}},
          {name: "快检", value: 20, itemStyle: {color: "#25FFFE"}},
        ],
        legendConfig: {
          show: false
        },
        seriesConfig: {
          radius: ['40%', '75%'],
          center: ['50%', '50%'],
          label: {
            show: true,
            formatter: '{b}\n{d}% {c}'
          }
        },
        otherSeriesConfig: {
          data: [],
        }
      },
    }
  }
}
</script>

<style scoped>

</style>
