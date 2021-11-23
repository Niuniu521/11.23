<template>
  <div class="container">
    <Map height="100%" :cockpit="true" @createdMap="createdMap" :widget="true" :widgetStyle="{'left': leftShrink ? '500px' : '20px'}"/>
    <DateSwitch />
    <div class="button">
      <input
        class="put"
        placeholder="请输入小区、重点区域、污水厂、泵站、窨井"
        v-show="showTow"
      />
      <img
        class="searchImg"
        src="@/assets/images/cockpit/traceabilityDisposal/search.png"
        @click="ShowClick"
        style="cursor:pointer;"
        @dblclick="dbShowClick"
      />
    </div>

    <div class="left" :class="{'leftHide': !leftShrink}">
      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">采样任务统计</span>
      </div>
      <div class="one item">
        <QValue />
      </div>

      <div class="LINE" />

      <div style="height: 55px;position: relative;">
       <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">检测方式统计</span>
      </div>
      <div class="two item">
        <MethodsStatistical />
      </div>

      <div class="LINE" />

      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">检测次数统计</span>
      </div>
      <div class="three item">
        <NumberStatistics />
      </div>

      <div class="shrink" @click="leftShrink = !leftShrink">
        <i :class="leftShrink ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"/>
      </div>
    </div>

    <div class="right" :class="{'rightHide': !rightShrink}">
      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">代谢物检测</span>
      </div>
      <div class="one item">
        <DetectionRank />
      </div>

      <div class="LINE" />

      <div style="height: 55px;position: relative;">
         <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">检测结果统计</span>
      </div>
      <div class="two item">
        <ResultsStatistical />
      </div>

      <div class="LINE" />

      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">检测记录</span>
      </div>
      <div class="three item">
        <Records />
      </div>
 <div class="legendWrap" v-if="!showRoots">
        <div class="legendItem" v-for="(item, index) in legendList" :key="index" @click="onLegend(item)">
          <img class="checkImg" v-if="legendActive.includes(item.value)" src="@/assets/images/cockpit/networkResource/radio_checked.png" alt="">
          <img class="checkImg" v-else src="@/assets/images/cockpit/networkResource/radio_check.png" alt="">
          <img class="checkImg" style="margin: 0 6px" :src="item.img" alt="">
          <div>{{item.label}}</div>
        </div>
      </div>

     <DetailModal
      ref="detailModal"
      v-if="modalShow"
      :title="modalTitle"
      :modalType="modalType"
      :titleStyle="titleStyle"
      :modalVal="modalVal"
      @onClose="onModalClose">
        <div slot="btn" class="btn" :class="{'btnActive': showRoots}" @click="onRoots">上下游溯源</div>
    </DetailModal>
      <div class="shrink" @click="rightShrink = !rightShrink">
       <i :class="rightShrink ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
      </div>
    </div>
  </div>
</template>

<script>
import Map from "@/components/Map";
import LayerService from "@/components/Map/LayerService";
import DateSwitch from "../modules/dateSwitch";
import DetailModal from "../modules/detailModal";
import DropModal from "../modules/dropModal";
import jg from "@/assets/images/cockpit/traceabilityDisposal/jg.png"
import one from "@/assets/images/cockpit/traceabilityDisposal/one.png";
import bz from "@/assets/images/cockpit/traceabilityDisposal/bz.png";
import wsc from "@/assets/images/cockpit/traceabilityDisposal/wsc.png";
import area from "@/assets/images/cockpit/traceabilityDisposal/area.png";
import keyArea from "@/assets/images/cockpit/traceabilityDisposal/keyArea.png";
import firm from "@/assets/images/cockpit/traceabilityDisposal/firm.png";
import happy from "@/assets/images/cockpit/traceabilityDisposal/happy.png";
import two from "@/assets/images/cockpit/traceabilityDisposal/two.png";
import three from "@/assets/images/cockpit/traceabilityDisposal/three.png";
import yy from "@/assets/images/cockpit/traceabilityDisposal/yy.png";
import MethodsStatistical from './methodsStatistical';
import NumberStatistics from './numberStatistics';
import QValue from './QValue';
import Records from './records';
import ResultsStatistical from './resultsStatistical';
import DetectionRank from '../traceabilityDisposal/detectionRank';
export default {
  components: {
    Map, DetailModal, DropModal, MethodsStatistical, NumberStatistics, QValue, Records, ResultsStatistical, DetectionRank, DateSwitch
  },
  data() {
    return {
      leftShrink: false,
      rightShrink: false,
      showTow: false,
      show: true,
      legendList: [
       {label: "代取件", value: "PipeLine", img: one},
        {label: "窨井", value: "Cover", img: jg},
        {label: "运输中", value: "two", img: two},
        {label: "泵站", value: "Pump", img: bz},
        {label: "污水厂", value: "Plant", img: wsc},
        {label: "小区", value: "Community", img: area},
        {label: "检测点", value: "Community", img: area},
        {label: "医院", value: "Hospital", img: yy},
        {label: "重点区域", value: "Company", img:keyArea},
        {label: "娱乐场所", value: "Recreation", img:happy},
        {label: "已送达，未检测", value: "three", img: three},
        {label: "易制毒企业", value: "firm", img:firm},
      ],
      legendActive: ["PipeLine", "Cover", "Pump", "Plant"],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftShrink = true;
      this.rightShrink = true;
    })
  },
  methods: {
    createdMap(map) {
      this.map = map;
      map.hideZoomSlider(); // 隐藏层级控件
      LayerService.renderArea(map)
    },
     ShowClick(){
this.showTow= true
    },
    dbShowClick(){
this.showTow= false
    },
    onLegend(item) {
      let legendActive = [...this.legendActive];
      if (item && item.value) {
        if (legendActive.includes(item.value)) {
          legendActive = legendActive.filter(i => i !== item.value);
        } else {
          legendActive.push(item.value);
        }
      }

      this.legendActive = legendActive;
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  position: absolute;
  top: 90px;
  right: 20px;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px;
  color: #12d0ff;
  user-select: none;
}
.put{
  position: absolute;
  width: 300px;
  height: 32px;
  right:80px;
  top: 10px;
  background:#021a2c;
border:#00BEDE 2px solid;
box-shadow: #00BEDE 0 0 20px;
outline:none;
color: #7E90A3;
}
input::-webkit-input-placeholder {
  font-size: 14px;
font-family: Microsoft YaHei;
font-weight: 500;
color: #7E90A3;
}
.button{
  position: absolute;
  right: 442px;
  top:145px;
}
.button img{
width:53px;
height:68px;
display:block;
margin-bottom: 16px;
}

.btnActive {
  background: rgba(0, 12, 26, 0.9);
  box-shadow: 0 0 14px 2px rgba(2, 220, 251, .8) inset;
}
.left span,.right span{
  background: linear-gradient(0deg, #F6FEFF 0%, #5BF3FF 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
font-size: 18px;
font-family: Microsoft YaHei;
font-weight: bold;
color: #FFFFFF;
}
.font-title{
position:absolute;
left:40px;
top: 10px;
}

.container {
  width: 100%;
  height: 100%;
  background: #021a2c;
  position: relative;
  overflow: hidden;
  color: #FFF;

  .left, .right {
    position: absolute;
    top: 100px;
    width: 424px;
    height: calc(100vh - 110px);
    padding: 30px;
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
      color: #FFF;
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

        &::-webkit-scrollbar { /*滚动条整体样式*/
          width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 10px;
        }

        &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner { /*滚动条里面小方块*/
          -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, .5);
           box-shadow: inset 0 0 5px rgba(255, 255, 255, .5);
           background: rgba(0, 0, 0, .2);
          border-radius: 3px;

          &:hover {
            background: rgba(0, 0, 0, 0.5);
          }
        }

        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
          background: transparent;

          &:hover {
            background: rgba(0, 0, 0, .2);
          }
        }
      }
    }
  }

  .left {
    left: 0;
    background: url("../../../assets/images/cockpit/networkResource/leftBg.png") no-repeat 0 0;
    background-size: 100% 100%;

    .shrink {
      left: 100%;
    }

    .one {
      flex: 1;
      margin-bottom: 10px;

    }

    .two {
      flex: 1;
      margin-bottom: 10px;
    }

    .three {
      flex: 1;
    }
  }

  .leftHide {
    transform: translateX(-100%);
  }

  .right {
    right: 0;
    background: url("../../../assets/images/cockpit/networkResource/rightBg.png") no-repeat 0 0;
    background-size: 100% 100%;

    .shrink {
      right: 100%;
    }

    .one {
      flex: 1;
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

  .rightHide {
    transform: translateX(100%);
  }

  .legendWrap {
    position: absolute;
    width: 255px;
    height:250px;
    right: 480px;
    bottom: 21px;
    border: 1px solid rgba(6, 211, 255, 0.49);
    background: linear-gradient(180deg, rgba(14, 63, 113, 0.49) 0%, rgba(14, 63, 113, 0.49) 72%);
    padding: 0 10px;
    border-radius: 10px;

    .legendItem {
      display: flex;
      align-items: center;
      float: left;
      color: #FFFFFF;
      font-size: 14px;
      margin-right: 14px;
      cursor: pointer;
      padding: 6px 6px;

      .checkImg {
        max-width: 13px;
        max-height: 13px;
        margin-right: 4px;
      }
    }
  }
}
// #arrow-right{
//   background: url(../);
// }
</style>

