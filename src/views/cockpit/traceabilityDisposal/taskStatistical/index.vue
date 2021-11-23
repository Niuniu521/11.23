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
          {name: "正在溯源", value: 8, itemStyle: {color: "#FD9F25"}},
          {name: "已完成", value: 12, itemStyle: {color: "#25FFFE"}},
        ],
        legendConfig: {
          show: false
        },
         word: {
        text:"20",
        subtext:"溯源任务总数（个）",
        left:'center',
         top:'35%',
          textStyle:{
          color:'#ffff',
          fontSize:25,
          align:'center'
        },
        subtextStyle:{
           color:'#ffff',
          fontSize:10,
          align:'center'
        }
      },
        seriesConfig: {
          radius: ['60%', '80%'],
          center: ['50%', '50%'],
          label: {
            show: true,
            formatter: '{b}\n{d}% {c}'
          },
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
