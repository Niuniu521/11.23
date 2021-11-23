<template>
  <PieChart
    height="80%"
    :chartData="chartData"
  />
</template>

<script>
import PieChart from "../../PieChart";
import { listData} from "./accounted";
export default {
  components: {
    PieChart
  },
  data() {
    return {
      chartData: {
        dataList: [
          {name: "吗啡超标", value: "", itemStyle: {color: "#25FFFE"}},
          {name: "甲基苯丙胺超标", value: 9, itemStyle: {color: "#1E86EB"}},
          {name: "苯丙胺超标", value: 6, itemStyle: {color: "#83D06E"}},
          {name: "氯胺酮超标", value: 3, itemStyle: {color: "#FD9F25"}},
          {name: "MDMA超标", value: 6, itemStyle: {color: "#49D1B8"}},
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
  },
created() {
    this.proportion();
  },
  methods: {
    proportion(){
      listData().then((response) => {
        console.log(response);
        this.chartData.dataList[0].value=response.morphine;
        // this.chartData.dataList[1].value=response.mamp;
        // this.chartData.dataList[2].value=response.amp;
        // this.chartData.dataList[3].value=response.ketamine;
        // this.chartData.dataList[4].value=response.mdma;
      });
    },
  },

}
</script>

<style scoped>

</style>
