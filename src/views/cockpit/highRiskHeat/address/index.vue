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
          {name: "四川省", value: 62, itemStyle: {color: "#FDDC2E"}},
          {name: "贵州省", value: 40, itemStyle: {color: "#FF7723"}},
          {name: "安徽省", value: 40, itemStyle: {color: "#1D62E7"}},
          {name: "云南省", value: 30, itemStyle: {color: "#22CAFC"}},
          {name: "河南省", value: 26, itemStyle: {color: "#25FFFE"}},
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
