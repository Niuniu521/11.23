<template>
  <div class="container">
    <Map height="100%" :cockpit="true" @createdMap="createdMap" :widget="true" :widgetStyle="{'left': leftShrink ? '500px' : '20px'}"/>
    <DateSwitch />
     <div class="button">
      <input class="put"   v-show="show" placeholder="请输入小区、重点区域、污水厂、泵站、窨井">
      <img class="searchImg" src="@/assets/images/cockpit/traceabilityDisposal/search.png" @click="ShowClick"  @dblclick="dbShowClick" >
    </div>

    <div class="left" :class="{'leftHide': !leftShrink}">
     <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">高危小区排名</span>
      </div>
      <div class="two item">
        <CommunityRankings />
      </div>

      <div class="LINE" />

    <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">覆盖人口统计</span>
      </div>
      <div class="two item">
        <PeopleStatistical />
      </div>

      <div class="LINE" />

     <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">预警提醒</span>
      </div>
      <div class="one item">
        <Warn @onClick="onWarnClick"/>
      </div>

      <div class="shrink" @click="leftShrink = !leftShrink">
        <i :class="leftShrink ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"/>
      </div>
    </div>

    <div class="right" :class="{'rightHide': !rightShrink}">
     <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">预警次数统计</span>
      </div>
      <div class="three item">
        <WarnStatistical />
      </div>

      <div class="LINE" />

     <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">溯源任务统计</span>
      </div>
      <div class="three item">
        <TaskStatistical />
      </div>

      <div class="LINE" />

    <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">高危原籍地分析</span>
      </div>
      <div class="three item">
        <Address />
      </div>

      <div class="shrink" @click="rightShrink = !rightShrink">
        <i :class="rightShrink ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
      </div>
    </div>
    <div class="bottomBox">
<img class="bottomBoxImg" src="@/assets/images/cockpit/globalOverview/bottomBox.png">
<img class="highImg" src="@/assets/images/cockpit/highRiskHeat/hightImg.png">
<div class="font">
  <span>高（&gt;16人）</span>
  <span>较高（12-15人）</span>
  <span>中（12-15人）</span>
  <span>较低（3-6人）</span>
  <span>低（&lt;3人）</span>
</div>
</div>
  </div>
</template>

<script>
import Map from "@/components/Map";
import LayerService from "@/components/Map/LayerService";
import MapService from "@/components/Map/MapService";
import DateSwitch from "../modules/dateSwitch";
import DetailModal from "../modules/detailModal";
import DropModal from "../modules/dropModal";
import PeopleStatistical from "./peopleStatistical";
import WarnStatistical from "./warnStatistical";
import TaskStatistical from "./taskStatistical";
import CommunityRankings from "./communityRankings";
import Address from "./address";
import Warn from "../traceabilityDisposal/warn";
export default {
  components: {
    Map, DetailModal, DropModal, WarnStatistical, PeopleStatistical, TaskStatistical, CommunityRankings, Address, Warn, DateSwitch
  },
  data() {
    return {
      leftShrink: false,
      rightShrink: false,
      legendActive: ["PipeLine", "Cover", "Pump", "Plant"],
      show: false,
      showRoots: false,
      rootsModel: 0,
      modalShow: false,
      modalType: null,
      graphic: null,
      modalVal: {},
      titleStyle: {},
      modalTitle: "",
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
      LayerService.renderHighRiskHeat(map)
    },
    ShowClick(){
this.show = true;
    },
    dbShowClick(){
this.show= false
    },
    onRoots() {
      this.showRootsVal = {downstream: {}, upstream: {}, bz: [], yj: [], yj_gw: []};
      this.showRoots = !this.showRoots;
      this.rootsGraphic = null;
      this.legendList.map(v => {
        let { value } = v;
        let layer = this.map.getLayer(value);
        let textLayer = this.map.getLayer("textLayer_" + value);
        layer && layer.setVisibility(this.showRoots ? false : this.legendActive.includes(value));
        textLayer && textLayer.setVisibility(this.showRoots ? false : this.legendActive.includes(value));
      })

      if (this.showRoots) {
        let {concatCode, POINT_CODE} = this.modalVal;

        let P = {
          Community: {code: POINT_CODE},
          Plant: {code: POINT_CODE},
          Pump: {code: POINT_CODE},
          Warn: {code: concatCode},
        }
        let params = {
          sourceType: 'POINT',
          ...P[this.modalType]
        }

        // 小区特殊处理
        if (this.modalType === "Community") {
          let {listVal = {}} = this.$refs.detailModal.$refs.Community;
          let {outlets} = listVal;
          if (outlets && outlets.length) {
            params.code = outlets[0].code;
          } else {
            this.$message('该小区尚未绑定窨井！');
            return
          }
        }

        LayerService.renderWarnRoot({
          map: this.map,
          params: this.showRoots && params,
          graphic: this.showRoots && this.graphic,
          downOrUp: 'trace',
          requestCallback: data => {
            if (data) {
              let val = {...this.showRootsVal};
              for (let i in val) {
                for (let j in data) {
                  if (i === j && data[j] && data[j].specialResults) {
                    let {specialResults, points} = data[j];
                    for (let k in specialResults) {
                      val[i][k] = val[i][k] || [];
                      val[i][k] = [...val[i][k], ...specialResults[k]]
                    }

                    if (points && points.length) {
                      for (let k = 0; k < points.length; k++) {
                        let {pointType, code} = points[k];
                        // 建议泵站
                        if (pointType === "PUMPING_STATION" && this.modalVal.CODE !== code) {
                          val.bz = val.bz || [];
                          val.bz.push(points[k])
                        }

                        // 建议窨井
                        if (['POINT', 'CROSS_POINT', 'JOIN_POINT', 'RESIDENTIAL_OUTLET', 'ENTERPRISE_OUTLET', 'HOSPITAL_OUTLET', 'PLAYGROUND_OUTLET'].includes(pointType)) {
                          val.yj = val.yj || [];
                          val.yj.push(points[k])
                        }

                        // 高危窨井
                        if (['RESIDENTIAL_OUTLET'].includes(pointType)) {
                          val.yj_gw = val.yj_gw || [];
                          val.yj_gw.push(points[k])
                        }
                      }
                    }
                  }
                }
              }
              this.showRootsVal = {...val}
            }
          }
        })
      } else {
        LayerService.renderWarnRoot({map: this.map})
      }
    },
    onWarnClick(item) {
      this.modalTitle = item.alarmMessageAlias;
      this.modalVal = item;
      this.modalShow = true;
      this.modalType = "Warn";
      this.titleStyle = {color: {"1": '#f1c677', "2": '#ea6835', "3": '#e52525'}[String(item.alarmLevel)]}
    },
    onModalClose() {
      this.graphic && this.graphic.attr("class", "");
      this.rootsGraphic = null;
      if (this.showRoots) {
        this.showRoots = false;
        LayerService.renderWarnRoot({map: this.map})
        this.legendList.map(v => {
          let { value } = v;
          let layer = this.map.getLayer(value);
          let textLayer = this.map.getLayer("textLayer_" + value);

          layer && layer.setVisibility(this.legendActive.includes(value));
          textLayer && textLayer.setVisibility(this.legendActive.includes(value));
        })
        MapService.setCenterAndZoom(this.map)
      }

      this.modalShow = false;
      this.modalVal = {};
      this.titleStyle = {};
      this.modalTitle = "";
      this.graphic = null;
      this.modalType = null;
      LayerService.renderHighlight(this.map);
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
.left span,.right span{
  background: linear-gradient(0deg, #F6FEFF 0%, #5BF3FF 100%);
-webkit-background-clip: text;
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
.searchImg{
  cursor: pointer;
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
.bottomBox{
  position: absolute;
  bottom:36px;
  right:490px;
  font-size:14px;
  z-index: 30;
}
.bottomBoxImg{
  width:139px;
  height:205px;
}
.highImg{
width:14px;
height:160px;
position:absolute;
bottom:27px;
right:110px;
}
.font{
  width:110px;
  height:160px;
  position:absolute;
  right: 0px;
  bottom: 27px;
}
.font span{
  display: block;
  margin-left: 10px;
  font-size: 12px;
  color: #EDEDED;
  margin-bottom: 19px;
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
      flex: 1.5;
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
      flex: 1.5;
      margin-bottom: 10px;
    }

    .three {
      flex: 1;
    }
  }
}
</style>

