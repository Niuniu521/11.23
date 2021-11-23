<template>
  <div class="content">
    <div class="checkWrap">
      <div class="checkItem" v-for="(item, index) in typeList" :key="index" @click="onChecked(item)">
        <div class="checkContent" :class="{'checked': typeVal === item.value}">{{item.label}}</div>
      </div>
    </div>

    <div class="chartWrap">
      <LineChart
        key="w1"
        v-if="typeVal === '1'"
        name="实时采集"
        height="100%"
        :chartData="chartData"
        color="#FFEE7C"
        :areaColor="['rgba(255,152,9, 0.8)', 'rgba(255,238,144, 0.1)']"
      />

      <LineChart
        key="w2"
        v-else
        name="第三检测"
        height="100%"
        :chartData="chartData"
        color="#00F0FF"
        :areaColor="['rgba(0, 240, 255, 0.8)', 'rgba(124, 255, 223, 0.1)']"
      />
    </div>
  </div>
</template>

<script>
import LineChart from "../../LineChart";
export default {
  components: {
    LineChart
  },
  data() {
    return {
      typeVal: "1",
      typeList: [
        {label: "实时采集", value: "1"},
        {label: "第三检测", value: "2"},
      ],

      chartData: {
        xAxisData: ["西塘污水厂", "大成污水厂", "洪溪污水厂", "姚庄污水厂"],
        dataList: [20, 10, 30, 40]
      }
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
      background: url("../../../../assets/images/cockpit/networkResource/tab_check.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .checked {
      background: url("../../../../assets/images/cockpit/networkResource/tab_checked.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
}

.chartWrap {
  height: calc(100% - 20px);
}
</style>
