<template>
  <div class="content">
    <div class="checkWrap">
      <div class="checkItem" v-for="(item, index) in typeList" :key="index" @click="onChecked(item)">
        <div class="checkContent" :class="{'checked': typeVal === item.value}">{{item.label}}</div>
      </div>
      <span class="check">单位：个</span>
    </div>

    <div class="chartWrap">
      <BarChart
        key="w1"
        v-if="typeVal === '1'"
    name="预警总数"
    height="100%"
    :chartData="chartData1"
    :color="['rgba(0, 205, 193, 1)', 'rgba(0, 255, 204, 1)']"
  />

      <BarChart
        key="w1"
         v-else-if="typeVal === '2'"
    name="排泄物预警"
    height="100%"
    :chartData="chartData2"
    :color="['rgba(0, 175, 207, 1)', 'rgba(0, 234, 255, 1)']"
  />
  <BarChart
        key="w1"
         v-else
    name="高危人员聚集预警"
    height="100%"
    :chartData="chartData"
    :color="['rgba(197, 162, 0, 1)', 'rgba(250, 224, 0, 1)']"
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
        {label: "预警总数", value: "1"},
        {label: "排泄物预警", value: "2"},
        {label: "高危人员聚集预警", value: "3"},
      ],
 chartData1: {
        xAxisData: ["南湖", "秀洲", "嘉善", "平湖", "海盐", "海宁", "桐乡", "经开", "港区"],
        dataList: [1, 5, 4, 6, 5, 3, 6, 1, 5,1]
      },
      chartData2: {
        xAxisData: ["杭州", "宁波", "台州", "嘉兴", "温州", "湖州", "绍兴", "金华", "舟山","丽水","衢州"],
        dataList: [1, 2, 1, 1, 2, 3, 6, 1, 2,5,4]
      },
      chartData: {
        xAxisData: ["南湖", "秀洲", "嘉善", "平湖", "海盐", "海宁", "桐乡", "经开", "港区"],
        dataList: [3, 1, 5, 3, 1, 2, 5, 2, 2]
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
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C5F3FF;
      font-size: 12px;
      cursor: pointer;
      margin-right:10px;
      padding-left: 10px;
      background: url("../../../../assets/images/cockpit/detectionControls/tab_check.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .checked {
      background: url("../../../../assets/images/cockpit/detectionControls/tab_checked.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .check{
      margin-left: 40px;
      font-size: 12px;
    }
  }
}

.chartWrap {
  height: calc(100% - 20px);
}
</style>

