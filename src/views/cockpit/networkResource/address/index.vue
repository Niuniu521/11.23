<template>
  <div class="content">
    <PieChart
      height="100%"
      :chartData="chartData"
      :color="['rgba(0, 254, 215, 1)', 'rgba(59, 194, 233, 1)']"
    />
  </div>
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
          {name: "四川省", value: 30, textStyle: {color: "#FDDC2E"}, itemStyle: {color: "#FDDC2E"}},
          {name: "贵州省", value: 20, textStyle: {color: "#FF7723"}, itemStyle: {color: "#FF7723"}},
          {name: "河南省", value: 20, textStyle: {color: "#25FFFE"}, itemStyle: {color: "#25FFFE"}},
          {name: "云南省", value: 15, textStyle: {color: "#22CAFC"}, itemStyle: {color: "#22CAFC"}},
          {name: "安徽省", value: 13, textStyle: {color: "#1D62E7"}, itemStyle: {color: "#1D62E7"}}
        ]
      },
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden !important;
}

</style>
