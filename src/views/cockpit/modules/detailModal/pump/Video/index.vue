<template>
  <div class="rightbox">
    <div class="checkWrap" id="checkWrap">
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
    </div>
    <div>
      <div class="time" style="margin-left: 43px">
        <el-time-picker
          style="width: 25%; float: left"
          v-model="value1"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
          }"
          placeholder="开始时间"
          size="mini"
        >
        </el-time-picker>
        <el-time-picker
         arrow-control
           v-model="value2"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
          }"
          style="width: 25%; margin-left: -110px"
          placeholder="结束时间"
          size="mini"
        >
        </el-time-picker>
        <span>播放</span>
      </div>
      <img
        style="margin-top: 10px"
        src="../../../../../../assets/images/cockpit/traceabilityDisposal/video.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
        value1: new Date(2016, 9, 10, 18, 40),
        value2: new Date(2016, 9, 10, 18, 40),
      typeVal: "1",
      typeList: [
        { label: "视频播放", value: "1" },
        { label: "视频回放", value: "2" },
      ],
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
 float:right;
 margin: -40px 20px 0 0;

}
.rightbox {
  text-align: center;
}
.rightbox img {
  width: 418px;
  height: 228px;
}
.time span {
  width: 49px;
  height: 25px;
  background: rgba(0, 109, 191, 0.82);
  border: 1px solid #004071;
  border-radius: 2px;

  float: right;
  margin-right: 45px;
}
</style>