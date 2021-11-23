<template>
  <div class="content">
    <div class="top"><span style="margin-right: 10px">--</span>省平均</div>
    <!-- <hr class="oneLine" /> -->
    <BarChart
      name="省消费综合指标"
      :title="name"
      height="170px"
      :chartData="chartData"
      :color="['rgba(0, 205, 193, 1)', 'rgba(0, 255, 204, 1)']"
    />
    <div class="top">
      <span style="margin-right: 10px;color: #ffd800">--</span>市平均
      <span style="margin-right: 10px; color: #ff6600">--</span>省平均
    </div>
    <!-- <hr class="twoLine" />
    <hr class="threeLine" /> -->
    <BarChart
      name="市消费综合指标"
      :title="name"
      height="170px"
      :chartData="chartDataTwo"
      :color="['rgba(0, 175, 207, 1)', 'rgba(0, 234, 255, 1)']"
    />
  </div>
</template>

<script>
import BarChart from "../../BarChart";
import { listData, chartData } from "./comprehensive.js";
export default {
  components: {
    BarChart,
  },
  data() {
    return {
      chartData: {
        xAxisData: [],
        dataList: [],
        name: "省消费综合指标",
        average: {
           symbol:['none','none'],
          data: [{ yAxis: "" , lineStyle: {
                    type: 'dashed',
                    color: '#ff6600'
                },}]
          },
      },
      chartDataTwo: {
        xAxisData: [],
        dataList: [],
        name: "省消费综合指标",
        average: {
          symbol:['none','none'],
          data: [
          { yAxis: "" ,lineStyle: {
                    type: 'dashed',
                    color: '#ffd800',
                }},
           { yAxis: "" ,lineStyle: {
                    type: 'dashed',
                    color: '#ff6600'
                }},
        ] },
      },
    };
  },
  created() {
    this.zhuzhuang();
  },
  methods: {
    zhuzhuang() {
      listData().then((response) => {
        // console.log(response);
        let county = [];
        let indicators = [];
        let average = response.cityValue.value;
        let averages = response.provinceValue.value;
        this.chartDataTwo.average.data[0].yAxis = average;
        this.chartDataTwo.average.data[1].yAxis = averages;
        for (let value of response.childValues) {
          county.push(value.targetName);
          indicators.push(value.value);
        }
        this.chartDataTwo.xAxisData = county;
        this.chartDataTwo.dataList = indicators;
      });
      chartData().then((response) => {
        let city = [];

        let indicators = [];
        let average = response.provinceValue.value;
        this.chartData.average.data[0].yAxis = average;
        for (let value of response.childValues) {
          city.push(value.targetName);
          indicators.push(value.value);
        }
        this.chartData.xAxisData = city;
        this.chartData.dataList = indicators;
      });
    },
  },
};
</script>

<style scoped>
.content {
  position: relative;
}
.top {
  float: right;
  font-size: 12px;
  margin-right: 10px;
}
.top span {
  color: #ff6600;
}
/* .oneLine {
  border: #ff6600 1px dashed;
  width: 340px;
  position: absolute;
  top: 84px;
  left: 30px;
} */
/* .twoLine {
  border: #ff6600 1px dashed;
  width: 340px;
  position: absolute;
  top: 245px;
  left: 30px;
}
.threeLine {
  border: #ffd800 1px dashed;
  width: 340px;
  position: absolute;
  top: 265px;
  left: 30px;
} */
</style>
