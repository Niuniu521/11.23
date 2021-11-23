<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/mixins/resize";

let textColor = "#FFFFFF";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    name: String,
    color: Array,
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ xAxisData, dataList,average} = {}) {
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: { color: textColor, interval: 0, rotate: 45 },
          axisLine: { show: true },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: "#525D70",
              opacity: 0.2,
            },
          },
        },
        grid: {
          left: 10,
          right: "10%",
          bottom: 10,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          padding: [5, 10],
        },
        yAxis: {
          type: "value",
          color: textColor,
          nameTextStyle: { color: textColor, fontSize: 10 },
          axisLabel: { color: textColor },
          axisTick: { show: false },
          axisLine: { show: true },
          splitArea: { show: false },
          splitLine: { lineStyle: { color: "#0A3B52", type: "dashed" } },
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: this.name,
            smooth: true,
            barMaxWidth: 20,
            type: "bar",
            data: dataList,
            animationDuration: 2000,
            animationEasing: "quadraticOut",
            markLine : average,
            // {
            //   silent:true,
            // data:[{ type: 'average', name: 'Avg' }]
            // },
            label: {
              show: true,
              position: "top",
              color: textColor,
              padding: [4, 10],
              borderRadius: 0,
            },
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0], //（顺时针左上，右上，右下，左下）
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.color[0] },
                { offset: 1, color: this.color[1] },
              ]),
            },
          },
        ],
      });
    },
  },
};
</script>
