<template>
  <div class="container">
    <Map
      height="100%"
      :cockpit="true"
      :widget="true"
      :widgetStyle="{ left: leftShrink ? '500px' : '20px' }"
    />
    <DateSwitch />

    <div class="left" :class="{ leftHide: !leftShrink }">
      <div style="height: 55px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">毒品滥用程度</span>
      </div>
      <div class="three item"><DuQing /></div>

      <div style="height: 55px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">消费综合指标</span>
      </div>
      <div class="one item"><AggregateConsumption /></div>

      <div style="height: 55px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">主要毒品消耗</span>
        <div class="font-company">单位：mg/天/千人</div>
      </div>
      <div class="three item"><DrugConcentration /></div>

      <div class="shrink" @click="leftShrink = !leftShrink">
        <i :class="leftShrink ? 'el-icon-arrow-left' : 'el-icon-arrow-right'" />
      </div>
    </div>

    <div class="right" :class="{ rightHide: !rightShrink }">
      <div style="height: 55px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">检测预警</span>
      </div>
      <div class="two item">
        <DetectionWarn @onShut="onWarnShut" />
      </div>

      <div style="height: 55px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">毒品滥用占比</span>
      </div>
      <div class="three item"><DrugPercentagebuse /></div>

      <div style="height: 55px; margin-top: -30px; position: relative">
        <img
          src="@/assets/images/cockpit/font-title.png"
          style="height: 55px"
        />
        <span class="font-title">溯源战果</span>
      </div>
      <div class="three item"><TraceabilityResults /></div>

      <div class="shrink" @click="rightShrink = !rightShrink">
        <i
          :class="rightShrink ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        />
      </div>
    </div>
    <div class="bottomBox">
      <img src="@/assets/images/cockpit/globalOverview/bottomBox.png" />
      <span class="font">毒品滥用程度</span>
      <div class="degree">
        <el-row>
          <el-col :span="4"
            ><div
              style="background: #3afed9"
              id="color"
              class="grid-content bg-purple"
            ></div
          ></el-col>
          <el-col :span="14"
            ><div
              style="line-height: 11px"
              class="grid-content bg-purple-light"
            >
              较轻
            </div></el-col
          >
          <el-col :span="6"
            ><div style="line-height: 11px" class="grid-content bg-purple">
              25≥Q≥0
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div
              style="background: #3af1fe"
              id="color"
              class="grid-content bg-purple"
            ></div
          ></el-col>
          <el-col :span="14"
            ><div
              style="line-height: 11px"
              class="grid-content bg-purple-light"
            >
              一般
            </div></el-col
          >
          <el-col :span="6"
            ><div style="line-height: 11px" class="grid-content bg-purple">
              40≥Q≥25
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div
              style="background: #d9fe3a"
              id="color"
              class="grid-content bg-purple"
            ></div
          ></el-col>
          <el-col :span="14"
            ><div
              style="line-height: 11px"
              class="grid-content bg-purple-light"
            >
              严重
            </div></el-col
          >
          <el-col :span="6"
            ><div style="line-height: 11px" class="grid-content bg-purple">
              80≥Q≥40
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div
              style="background: #ffa922"
              id="color"
              class="grid-content bg-purple"
            ></div
          ></el-col>
          <el-col :span="14"
            ><div
              style="line-height: 11px"
              class="grid-content bg-purple-light"
            >
              较严重
            </div></el-col
          >
          <el-col :span="6"
            ><div style="line-height: 11px" class="grid-content bg-purple">
              150≥Q≥80
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div
              style="background: #ff0f00"
              id="color"
              class="grid-content bg-purple"
            ></div
          ></el-col>
          <el-col :span="14"
            ><div
              style="line-height: 11px"
              class="grid-content bg-purple-light"
            >
              非常严重
            </div></el-col
          >
          <el-col :span="6"
            ><div style="line-height: 11px" class="grid-content bg-purple">
              150≥Q
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <div class="bottom" />
     <DetailModal
      ref="detailModal"
      v-if="modalShow"
      :title="modalTitle"
      :modalType="modalType"
      :modalVal="modalVal"
      @onClose="onModalClose"
        >
        </DetailModal>
  </div>
</template>

<script>
import Map from "./map";
import DuQing from "./duQing";
import AggregateConsumption from "./AggregateConsumption";
import DrugConcentration from "./drugConcentration";
import DetectionWarn from "./detectionWarn";
import DrugPercentagebuse from "./drugPercentagebuse";
import TraceabilityResults from "./traceabilityResults";
import DateSwitch from "../modules/dateSwitch";
import DetailModal from "../modules/detailModal";
export default {
  components: {
    Map,
    DuQing,
    AggregateConsumption,
    DrugConcentration,
    DetectionWarn,
    DrugPercentagebuse,
    TraceabilityResults,
    DateSwitch,
    DetailModal,
  },
  data() {
    return {
      leftShrink: false,
      rightShrink: false,
      modalShow: false,
      modalType: null,
      // graphic: null,
      modalVal: {},
      titleStyle: {},
      modalTitle: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.leftShrink = true;
      this.rightShrink = true;
    });
  },
  methods: {
    onWarnShut(item) {
      this.modalVal = item;
      this.modalShow = true;
      this.modalType = "CloseAlert";
    },

    onModalClose() {
      this.modalShow = false;
      this.modalVal = {};
      this.titleStyle = {};
      this.modalTitle = "";
      this.modalType = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: url("../../../assets/images/cockpit/contentBg.png") no-repeat 0 0;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  color: #fff;
  .bottomBox {
    position: absolute;
    bottom: 150px;
    right: 480px;
    font-size: 14px;
    z-index: 30;
  }
  .bottomBox img {
    width: 180px;
    height: 151px;
  }
  .left span,
  .right span {
    background: linear-gradient(0deg, #f6feff 0%, #5bf3ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
  }
  .font-title {
    position: absolute;
    left: 40px;
    top: 10px;
  }
  .font-company {
    font-size: 13px;
    position: absolute;
    top: 18px;
    right: 10px;
  }
  .font {
    width: 200px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(0deg, #f6feff 0%, #5bf3ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .degree {
    position: absolute;
    top: 40px;
    left: 10px;
  }
  #color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .el-row {
    margin-bottom: 10px;
  }
  .left,
  .right {
    position: absolute;
    top: 100px;
    width: 424px;
    height: calc(100vh - 110px);
    padding: 20px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.35s;

    .shrink {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(24, 144, 255, 1) inset;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      width: 20px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .item {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;

      .content {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 10px;
        }

        &::-webkit-scrollbar-thumb,
        &::-webkit-scrollbar-corner {
          /*滚动条里面小方块*/
          -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;

          &:hover {
            background: rgba(0, 0, 0, 0.5);
          }
        }

        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          background: transparent;

          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }

  .left {
    left: 0;
    background: url("../../../assets/images/cockpit/globalOverview/leftBg.png")
      no-repeat 0 0;
    background-size: 100% 100%;
    z-index: 5;

    .shrink {
      left: 100%;
    }

    .one {
      height: auto;
      margin-bottom: 10px;
    }

    .two {
      flex: 1;
      margin-bottom: 10px;
    }

    .three {
      flex: 1.5;
    }
  }

  .leftHide {
    transform: translateX(-100%);
  }

  .right {
    right: 0;
    background: url("../../../assets/images/cockpit/globalOverview/rightBg.png")
      no-repeat 0 0;
    background-size: 100% 100%;
    z-index: 5;

    .shrink {
      right: 100%;
    }

    .one {
      flex: 1;
      margin-bottom: 10px;
    }

    .two {
      flex: 1.5;
      margin-bottom: 10px;
    }

    .three {
      flex: 1;
    }
  }

  .rightHide {
    transform: translateX(100%);
  }

  .bottom {
    position: absolute;
    z-index: 1;
    bottom: 10px;
    width: calc(100vw - 940px);
    height: 227px;
    left: 50%;
    transform: translateX(-50%);
    background: url("../../../assets/images/cockpit/globalOverview/bottom.png")
      no-repeat 0 0;
    background-size: 100% 100%;
  }
}
</style>
