<template>
  <div class="container">
    <Map height="100%" :cockpit="true" @createdMap="createdMap" :widget="true" :widgetStyle="{'left': leftShrink ? '500px' : '20px'}"/>
    <DateSwitch />

    <div class="left" :class="{'leftHide': !leftShrink}">
      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">管网设备统计</span>
      </div>
      <div class="one item">
        <DataStatistics />
      </div>

      <div class="LINE" />

      <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">建设服务情况</span>
      </div>
      <div class="two item">
        <ServiceCondition />
      </div>

      <div class="LINE" />

       <div style="height: 55px;position: relative;">
        <img src="@/assets/images/cockpit/font-title.png" style="height: 55px"/>
        <span class="font-title">流量流速检测</span>
      </div>
      <div class="three item">
        <FlowDetection />
      </div>

      <div class="shrink" @click="leftShrink = !leftShrink">
        <i :class="leftShrink ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"/>
      </div>
    </div>
     <div v-if="showRoots" class="right" :class="{'rightHide': !rightShrink}">
      <div class="rootsWrap" v-if="rootsModel">
        <div class="rootsTop">
          <div
            :class="{'topActive': roots.topActive === item.value}"
            class="topItem"
            v-for="item in roots.top"
            @click="roots.topActive = item.value"
            :key="item.label">
            {{item.label}}
          </div>
        </div>
        <div class="rootsContainer">
          <div class="rootsLeft">
            <div
              :class="{'leftActive': roots.leftActive === item.value}"
              class="leftItem"
              @click="roots.leftActive = item.value"
              v-for="item in roots.left"
              :key="item.label">
              {{item.label}}
            </div>
          </div>
          <div class="rootsContent">
            <div v-if="showRootsVal[roots.topActive][roots.leftActive]">
              <div
                class="contentItem"
                v-for="(item, index) in showRootsVal[roots.topActive][roots.leftActive]"
                @click="onRootClick(item)"
                :key="index">
                <i class="el-icon-location" style="color: #0CF6FF; margin-right: 4px" />
                {{item.name}}
              </div>
            </div>
            <div v-else class="empty">
              暂无数据
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rootsWrap">
        <div style="height: 55px">
          <img src="@/assets/images/cockpit/globalOverview/roots-title.png" style="height: 55px"/>
        </div>
        <div class="rootsContent">
          <div class="rootsContentItem">
            <div class="rootsTitle">
              <img src="@/assets/images/cockpit/roots/blue.png" style="height: 50px"/>
              <span>建议溯源泵站</span>
              <img src="@/assets/images/cockpit/roots/blue.png" style="height: 50px"/>
            </div>
            <div class="rootsContentList" v-if="showRootsVal.bz && showRootsVal.bz.length">
              <div @click="onRootClick(item)" class="rootsItem rootsBZ" v-for="(item, index) in showRootsVal.bz" :key="index">
                <div class="bzItem">
                  <img src="@/assets/images/cockpit/roots/bz.png" alt="" style="width: 13px">
                  {{item.name}}
                </div>
                <div class="bzItem">
                  <img src="@/assets/images/cockpit/roots/people.png" alt="" style="width: 17px">
                  {{item.bindList && item.bindList[0] && item.bindList[0].concats}}
                </div>
                <div class="bzItem">
                  <img src="@/assets/images/cockpit/roots/phone.png" alt="" style="width: 12px">
                  {{item.bindList && item.bindList[0] && item.bindList[0].phone}}
                </div>
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </div>

          <div class="rootsContentItem">
            <div class="rootsTitle">
              <img src="@/assets/images/cockpit/roots/blue.png" style="height: 50px"/>
              <span style="color: #0CFFB8">建议溯源窨井</span>
              <img src="@/assets/images/cockpit/roots/blue.png" style="height: 50px"/>
            </div>
            <div class="rootsContentList" v-if="showRootsVal.yj && showRootsVal.yj.length">
              <div @click="onRootClick(item)" class="rootsItem rootsYJ" v-for="(item, index) in showRootsVal.yj" :key="index">

                <img src="@/assets/images/cockpit/roots/yj.png" alt="" style="width: 18px">
                <span style="color: #0CFFB8; margin-left: 10px">{{item.code}}</span>
                <span>-{{item.bindName}}</span>
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </div>

          <div class="rootsContentItem">
            <div class="rootsTitle">
              <img src="@/assets/images/cockpit/roots/red.png" style="height: 50px"/>
              <span style="color: #FF0A03">疑似高危窨井</span>
              <img src="@/assets/images/cockpit/roots/red.png" style="height: 50px"/>
            </div>
            <div class="rootsContentList" v-if="showRootsVal.yj_gw && showRootsVal.yj_gw.length">
              <div @click="onRootClick(item)" class="rootsItem rootsYJGW" v-for="(item, index) in showRootsVal.yj_gw" :key="index">
                <img src="@/assets/images/cockpit/roots/warn.png" alt="" style="width: 18px">
                <span style="color: #FF0A03; margin-left: 10px">{{item.code}}</span>
                <span>-{{item.bindName}}</span>
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </div>
        </div>
        <div class="rootsFooter">
          <div class="roots-footer-item">发送信息</div>
          <div class="roots-footer-item">打印方案</div>
        </div>

      </div>

      <div class="shrink" @click="rightShrink = !rightShrink">
        <i :class="rightShrink ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
      </div>
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
      v-show="show"
      :title="modalTitle"
      :modalType="modalType"
      :titleStyle="titleStyle"
      :modalVal="modalVal"
      @onClose="onModalClose">
    </DetailModal>
  </div>
</template>

<script>
import Map from "@/components/Map";
import DetailModal from "../modules/detailModal";
import MapService from "@/components/Map/MapService";
import DropModal from "../modules/dropModal";
import LayerService from "@/components/Map/LayerService";
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
import DataStatistics from "./dataStatistics";
import FlowDetection from "./flowDetection";
import ServiceCondition from "./serviceCondition";
import DateSwitch from "../modules/dateSwitch";

export default {
  components: {
    Map, DetailModal, DropModal, DataStatistics, FlowDetection, ServiceCondition, DateSwitch
  },
  data() {
    return {
      show: true,
      leftShrink: false,
      rightShrink: false,
      legendList: [
        {label: "一级管网", value: "PipeLine", img: one},
        {label: "窨井", value: "Cover", img: jg},
        {label: "二级管网", value: "two", img: two},
        {label: "泵站", value: "Pump", img: bz},
        {label: "三级管网", value: "three", img: three},
        {label: "污水厂", value: "Plant", img: wsc},
        {label: "重点区域", value: "Company", img:keyArea},
        {label: "小区", value: "Community", img: area},
        {label: "娱乐场所", value: "Recreation", img:happy},
        {label: "医院", value: "Hospital", img: yy},
        {label: "易制毒企业", value: "firm", img:firm},

      ],
      legendActive: ["PipeLine", "Cover", "Pump", "Plant"],

      showRoots: false,
      rootsModel: 0,
      modalShow: false,
      modalType: null,
      graphic: null,
      modalVal: {},
      titleStyle: {},
      modalTitle: "",

      roots: {
        top: [
          {label: "上游", value: 'upstream'},
          {label: "下游", value: 'downstream'},
        ],
        topActive: 'upstream',
        left: [
          {label: "小区", value: 'RESIDENTIAL'},
          {label: "娱乐场所", value: 'PLAYGROUND'},
          {label: "医疗机构", value: 'HOSPITAL'},
          {label: "重点企业", value: 'ENTERPRISE'},
        ],
        leftActive: 'RESIDENTIAL',
      },
      showRootsVal: {
        downstream: {},
        upstream: {},
        bz: [],
        yj: [],
        yj_gw: []
      },
      rootsGraphic: null,

      rootsPoint: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftShrink = true;
      this.rightShrink = true;
    })
  },
  methods: {
   onRootClick(item) {
      let {map} = this;
      let Color = esri.Color;
      let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
      let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

      let layer = map.getLayer("WarnRoot");

      // 点击高亮区域
      if (this.rootsGraphic) {
        let {attributes, geometry} = this.rootsGraphic;
        if (geometry.rings) {
          let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(attributes.color), 1), new Color([...new Color(attributes.color).toRgb(), 0.35]))
          this.rootsGraphic.setSymbol(symbol)
        } else if (geometry.x && geometry.y) {
          this.rootsGraphic.attr("class", "");
        }
      }
      if (layer && layer.graphics) {
        let color = "#fffc00";
        let lightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 1), new Color([...new Color(color).toRgb(), 0.35]))
        layer.graphics.map(graphic => {
          let {geometry, attributes} = graphic;
          if (geometry && attributes) {
            let {commonType, objectId} = attributes;
            if (commonType === item.commonType && objectId === item.objectId) {
              this.rootsGraphic = graphic;

              if (geometry.rings) {
                graphic.setSymbol(lightSymbol)
                let returnExtent = geometry.getExtent();
                if (returnExtent) {
                  let offset = 0.01;
                  returnExtent.xmin = returnExtent.xmin - offset;
                  returnExtent.ymin = returnExtent.ymin - offset;
                  returnExtent.xmax = returnExtent.xmax + offset;
                  returnExtent.ymax = returnExtent.ymax + offset;
                  map.setExtent(returnExtent);
                }
              } else if (geometry.x && geometry.y) {
                graphic.attr("class", "jumpOne");
                MapService.mapPanTo(map, geometry, 16);

                window.setTimeout(() => {
                  graphic.attr("class", "");
                }, 2000)
              }
            }
          }
        })
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
    createdMap(map) {
      this.map = map;
      map.hideZoomSlider(); // 隐藏层级控件

      LayerService.renderPiPeLine(map);
      LayerService.renderArea(map);
      // LayerService.renderPipeLine(map);
      LayerService.renderCover(map);

      ["Community", "Pump", "Plant", "Hospital", "Company", "Recreation"].map(value => {
        if (LayerService[`render${value}`]) {
          LayerService[`render${value}`](map, layer => {
            layer.on('click', evt => {
              this.layerClick(evt, value)
            })
          }, {visible: this.legendActive.includes(value)})
        }
      })
    },
    layerClick(evt, value) {
      if (value === "Community") {
        LayerService.renderCommunityYJ(this.map, evt);
      }

      LayerService.renderHighlight(this.map, evt);
      let {attributes} = evt.graphic;

      this.graphic = evt.graphic;
      this.graphic.attr("class", "jump");

      this.modalTitle = attributes.NAME;
      this.modalVal = attributes;
      this.modalShow = true;
      this.modalType = value;
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

      // 展示全部图层
      if (legendActive.length) {
        this.legendList.map(v => {
          let { value } = v;
          let vis = false;
          if (legendActive.includes(value)) {
            vis = true;
          }

          let layer = this.map.getLayer(value);
          let textLayer = this.map.getLayer("textLayer_" + value);

          layer && layer.setVisibility(vis)
          textLayer && textLayer.setVisibility(vis)
        })
      } else {
        this.legendList.map(v => {
          let { value } = v;
          let layer = this.map.getLayer(value);
          let textLayer = this.map.getLayer("textLayer_" + value);
          layer && layer.setVisibility(true)
          textLayer && textLayer.setVisibility(true)
        });
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

.btnActive {
  background: rgba(0, 12, 26, 0.9);
  box-shadow: 0 0 14px 2px rgba(2, 220, 251, .8) inset;
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
    background: url("../../../assets/images/cockpit/networkResource/rightBg.png") no-repeat 0 0;
    background-size: 100% 100%;

    .rootsWrap {
      width: 100%;
      height: 100%;

      .rootsContent {
        height: calc(100% - 120px);
        overflow-y: auto;

        .rootsContentItem {
          height: calc(100% / 3);

          .rootsContentList {
            height: calc(100% - 50px);
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

      .rootsFooter {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        .roots-footer-item {
          margin: 0 10px;
          width: 140px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url("../../../assets/images/cockpit/roots/text-active-bg.png") no-repeat 0 0;
          background-size: 100% 100%;
          color: #D9FFFE;
          cursor: pointer;

          &:last-child {
            height: 50px;
            background: url("../../../assets/images/cockpit/roots/text-bg.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
        }
      }

      .rootsTitle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        color: #50F2FF;
        font-size: 15px;
        font-weight: bold;
        letter-spacing: 1px;
        padding: 10px 0 0 0;

         span {
           padding-bottom: 10px;
         }
      }

      .rootsItem {
        width: 100%;
        height: 45px;
        background: rgba(0, 166, 191, 0.05);
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 0 10px;
        cursor: pointer;
      }

      .rootsBZ {
        justify-content: space-between;

        .bzItem {
          flex: 1;
          display: flex;
          align-items: center;

          img {
            margin-right: 10px;
          }
        }
      }

      .rootsYJGW {
        position: relative;

        &:before {
          content: "";
          position: absolute;
          top: 0;
          height: 100%;
          left: 0;
          width: 4px;
          background: #FF0A03;
        }
      }

      .empty {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;
      }

      .rootsTop {
        display: flex;
        margin: 20px 0;

        .topItem {
          width: 100px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #b7b7b7;
          font-size: 14px;
          letter-spacing: 1px;
          background: url("../../../assets/images/cockpit/networkResource/topItem.png") no-repeat 0 0;
          background-size: 100% 100%;
          cursor: pointer;
        }

        .topActive {
          color: #FFF000;
          background: url("../../../assets/images/cockpit/networkResource/topActive.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
      }

      .rootsContainer {
        display: flex;
        height: calc(100% - 80px);

        .rootsLeft {
          width: 70px;
          margin-right: 40px;

          .leftItem {
            color: rgba(12, 246, 255, 0.3);
            border-top: 1px rgba(0, 145, 255, 0.3) dashed;
            border-bottom: 1px rgba(0, 145, 255, 0.3) dashed;
            height: 85px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
          }

          .leftActive {
            color: rgba(12, 246, 255, 1)
          }
        }

        .rootsContent {
          flex: 1;
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

          .contentItem {
            margin-bottom: 20px;
            background: rgba(0, 166, 191, 0.1);
            color: #FFF;
            height: 46px;
            padding-left: 10px;
            display: flex;
            align-items: center;
            cursor: pointer;

            &:hover {
              background: rgba(0, 166, 191, 0.35)
            }
          }
        }
      }
    }

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

  .legendWrap {
    position: absolute;
    width: 255px;
    height: 190px;
    right: 20px;
    bottom: 20px;
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
      padding: 6px 6px;;

        .checkImg {
        max-width: 13px;
        max-height: 13px;
        margin-right: 4px;
      }

    }
  }
}
</style>
