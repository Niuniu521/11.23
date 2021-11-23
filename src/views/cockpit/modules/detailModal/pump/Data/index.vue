<template>
  <div class="leftbox">
    <div class="down-menu">
      <sapn style="margin-right: 10px">单位：ng/L</sapn>
      <el-select
        v-model="value"
        placeholder="吗啡"
        size="mini"
        style="width: 50%"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- <div class="checkWrap" id="checkWrap">
      <div
        class="checkItem"
        v-for="(item, index) in typeList"
        :key="index"
        @click="onChecked(item)"
      >
        <div class="checkContent" :class="{ checked: typeVal === item.value }">
          {{ item.label }}
        </div>
      </div>
    </div> -->
    <LineChart
      key="w1"
      v-if="typeVal === '1'"
      height="249px"
      :chartData="chartData"
      color="#FFF"
      :areaColor="['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 225, 0.1)']"
    />
    <LineChart
      key="w1"
      v-else-if="typeVal === '2'"
      height="249px"
      :chartData="chartData2"
      color="#FFF"
      :areaColor="['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 225, 0.1)']"
    />
    <LineChart
      key="w1"
      v-else
      height="249px"
      :chartData="chartData3"
      color="#FFF"
      :areaColor="['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 225, 0.1)']"
    />
  </div>
</template>

<script>
import LineChart from "../../../../LineChart"
export default {
  components: {
      LineChart
  },
  data() {
    return {
      typeVal: "1",
      typeList: [
    
      ],
      chartData: {
        xAxisData: [
          "2021/8/26",
          "2021/8/27",
          "2021/8/28",
          "2021/8/29",
          "2021/8/30",
        ],
        legendConfig: { show: true, right: 0 },
        gridConfig: { top: 30 },
        lines: [
          {
            data: [40, 52, 48, 90, 86],
            color: "rgba(255, 255, 255, 0.5)",
            areaColor: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"],
            seriesConfig: { smooth: false },
            average: {
              symbol: ["none", "none"],
              data: [
                {
                  type: "average",
                  lineStyle: {
                    type: "dashed",
                    color: "#ff6600",
                  },
                },
              ],
            },
          },
        ],
      },
      chartData2: {
        xAxisData: [
          "2021/8/26",
          "2021/8/27",
          "2021/8/28",
          "2021/8/29",
          "2021/8/30",
        ],
        legendConfig: { show: true, right: 0 },
        gridConfig: { top: 30 },
        lines: [
          {
            data: [30, 26, 59, 88, 90],
            color: "rgba(255, 255, 255, 0.5)",
            areaColor: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"],
            seriesConfig: { smooth: false },
            average: {
              symbol: ["none", "none"],
              data: [
                {
                  type: "average",
                  lineStyle: {
                    type: "dashed",
                    color: "#ff6600",
                  },
                },
              ],
            },
          },
        ],
      },
      chartData3: {
        xAxisData: [
          "2021/8/26",
          "2021/8/27",
          "2021/8/28",
          "2021/8/29",
          "2021/8/30",
        ],
        legendConfig: { show: true, right: 0 },
        gridConfig: { top: 30 },
        lines: [
          {
            data: [95, 62, 45, 80, 86],
            color: "rgba(255, 255, 255, 0.5)",
            areaColor: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"],
            seriesConfig: { smooth: false },
            average: {
              symbol: ["none", "none"],
              data: [
                {
                  type: "average",
                  lineStyle: {
                    type: "dashed",
                    color: "#ff6600",
                  },
                },
              ],
            },
          },
        ],
      },
      options: [
        {
          value: "选项1",
          label: "吗啡",
        },
        {
          value: "选项2",
          label: "海洛因",
        },
        {
          value: "选项3",
          label: "冰毒",
        },
        {
          value: "选项4",
          label: "摇头丸",
        },
      ],
      value: "",
      options: [
        {
          value: "选项1",
          label: "吗啡",
        },
        {
          value: "选项2",
          label: "海洛因",
        },
        {
          value: "选项3",
          label: "冰毒",
        },
        {
          value: "选项4",
          label: "摇头丸",
        },
      ],
      value: "",
    };
  },
  methods: {
    onChecked({ value }) {
      this.typeVal = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkWrap {
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: -30px;

  .checkContent {
    width: 110px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c5f3ff;
    font-size: 14px;
    cursor: pointer;
    background: url("../../../../../../assets/images/cockpit/detectionControls/tab_check.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .checked {
    background: url("../../../../../../assets/images/cockpit/detectionControls/tab_checked.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
}
#checkWrap {
  margin-top: -10px;
}
.down-menu {
  float: right;
  margin-top: -30px;
  margin-right: -20px;
}
.el-input__inner {
  color: #c5f3ff;
}
</style>