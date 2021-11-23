<template>
  <PieChart
    height="100%"
    :chartData="chartData"
    :color="['rgba(0, 254, 215, 1)', 'rgba(59, 194, 233, 1)']"
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
          {name: "正常", value: 46, itemStyle: {color: "#44C800"}},
          {name: "异常", value: 4, itemStyle: {color: "#F5A100"}},
        ],
        legendConfig: {
          show: false
        },
        seriesConfig: {
          radius: ['0%', '70%'],
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
