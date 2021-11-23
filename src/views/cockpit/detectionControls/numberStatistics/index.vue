<template>
  <LineChart
    name="快检设备"
    height="100%"
    :chartData="chartData"
    color="#00F0FF"
    :areaColor="['rgba(0, 240, 255, 0.8)', 'rgba(124, 255, 223, 0.1)']"
  />
</template>

<script>
import LineChart from "../../LineChart";
export default {
  components: {
    LineChart
  },
  data() {
    return {
      chartData: {
        xAxisData: ["8-26", "8-27", "8-28", "8-29"],

        legendConfig: {show: true, right: 0},
        gridConfig: {top: 30},
        lines: [
          {
            name: "固定设备",
            data: [20, 40, 30, 10],
            color: "rgba(180, 133, 255, 0.5)",
            areaColor: ['rgba(161, 103, 255, 0.3)', 'rgba(180, 133, 255, 0.1)'],
            seriesConfig: {smooth: false}
          }, {
            name: "快检设备",
            data: [30, 10, 34, 20],
            color: "rgba(101, 216, 184, 0.5)",
            areaColor: ['rgba(101, 216, 184, 0.3)', 'rgba(101, 184, 255, 0.1)'],
            seriesConfig: {smooth: false}
          }, {
            name: "实验室数据",
            data: [40, 20, 30, 40],
            color: "rgba(249, 160, 82, 0.5)",
            areaColor: ['rgba(249, 160, 82, 0.3)', 'rgba(251, 197, 0, 0.1)'],
            seriesConfig: {smooth: false}
          }
        ]
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
