<template>
  <div class="content">
    <div class="checkWrap">
      <div class="checkItem" v-for="(item, index) in typeList" :key="index" @click="onChecked(item)">
        <div class="checkContent" :class="{'checked': typeVal === item.value}">{{item.label}}</div>
      </div>
    </div>

    <div class="chartWrap">
      <BarChart
        key="w1"
        v-if="typeVal === '1'"
    name="近期流入高危人员"
    height="100%"
    :chartData="chartData1"
    :color="['rgba(0, 205, 193, 1)', 'rgba(0, 255, 204, 1)']"
  />

      <BarChart
        key="w1"
        v-else
    name="近期流入高危人员"
    height="100%"
    :chartData="chartData"
    :color="['rgba(0, 175, 207, 1)', 'rgba(0, 234, 255, 1)']"
  />
    </div>
  </div>
</template>

<script>
import BarChart from "../../BarChart";
export default {
  components: {
    BarChart
  },
  data() {
    return {
      typeVal: "1",
      typeList: [
        {label: "省检任务", value: "1"},
        {label: "市检任务", value: "2"},
      ],
 chartData1: {
        // xAxisData: ["杭州", "宁波", "台州", "嘉兴", "温州", "湖州", "绍兴", "金华", "舟山","衢州"],
        xAxisData: ["南湖", "秀洲", "嘉善", "平湖", "海盐", "海宁", "桐乡", "经开", "港区"],
        dataList: [16, 25, 14, 16, 25, 30, 26, 19, 25]
      },
      chartData: {
        xAxisData: ["南湖", "秀洲", "嘉善", "平湖", "海盐", "海宁", "桐乡", "经开", "港区"],
        dataList: [30, 15, 15, 30, 15, 20, 15, 20, 25]
      },
    }
  },
  methods: {
    onChecked({value}) {
      this.typeVal = value;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden !important;

  .checkWrap {
    height: 30px;
    display: flex;
    align-items: center;

    .checkContent {
      width: 110px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C5F3FF;
      font-size: 14px;
      cursor: pointer;
      margin-right: 20px;
      background: url("../../../../assets/images/cockpit/detectionControls/tab_check.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .checked {
      background: url("../../../../assets/images/cockpit/detectionControls/tab_checked.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
}

.chartWrap {
  height: calc(100% - 20px);
}
</style>
