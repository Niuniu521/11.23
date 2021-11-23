<template>
  <div class="container">
    <FlexList :list="list" :list-val="listVal"/>

    <div class="content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <div class="content-left">
        <div class="select-wrap">
          <div class="select-item" :class="{'select-item-ed': item.value === model}" v-for="(item, index) in modelList" :key="index" @click="onModel(item)">
            <div>{{item.label}}</div>
          </div>
        </div>

        <div class="list-wrap">
          <div class="list-item" v-for="(item, index) in tableData" :key="index" @click="onCheck(index)">
            <div class="item-label" v-if="item.deviceType == 1">自动检测</div>
            <div class="item-label2" v-else-if="item.deviceType == 2">自动采水</div>

            <div class="item-check">
              <img class="checkImg" v-if="item.checked" src="@/assets/images/radio_checked_block.png" alt="">
              <img class="checkImg" v-else src="@/assets/images/radio_check_block.png" alt="">
            </div>
            <div class="item-content">
              <div class="item-title">{{item.name}}</div>
              <div class="item-text">检测点类型：{{item.typeName}}</div>
              <div class="item-text">地址：{{item.address}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <Map height="400px" :cockpit="true" @createdMap="createdMap"/>
      </div>
    </div>
  </div>
</template>

<script>
import FlexList from "../../../flexList";
import Map from "@/components/Map";
import LayerService from "@/components/Map/LayerService";
import request from '@/utils/request';

export default {
  name: "DisposalTask",
  components: {
    FlexList,
    Map
  },
  props: {
    modalVal: Object
  },
  data() {
    return {
      list: [
        {label: "预警时间", paramName: "alarmTime", width: "20%"},
        {label: "采样时间", paramName: "targetName", width: "20%"},
        {label: "预警地点", paramName: "deviceAddress", width: "20%"},
        {label: "代谢物", paramName: "factorNames", width: "20%"},
        {label: "毒品种类", paramName: "kinds", width: "20%"},
        {label: "预警地址", paramName: "deviceAddress", width: "20%"},
        {label: "绑定设备编号", paramName: "deviceCode", width: "20%"},
      ],
      listVal: {},
      alarmid:"",
      loading: false,

      model: "STEP_BY_STEP",
      modelList: [
        {label: "逐级溯源", value: "STEP_BY_STEP"},
        {label: "全线溯源", value: "WHOLE_LINE"},
        {label: "优先溯源", value: "PRIORITY"},
      ],
      tableData: []
    }
  },
  watch: {
    modalVal: {
      handler(val) {
        if (val && val.id) {
          this.alarmid=val.id
          this.getModalVal(val.id);
          this.getData()
        }
      },
      immediate: true,
    }
  },
  methods: {
    getModalVal(id) {
      this.loading = true;
      request({url: '/alarm-record/detail', method: 'get', params: {id}}).then(res => {
        this.loading = false;
        if (res.code === 200 && res.data) {
          let {type} = res.data;
          if (type) {
            res.data.typeName = {'1': "快速检测", '2': "手动检测", '3': "实验室导入"}[String(type)]
          }
          this.listVal = res.data || {};
          console.log("this.listVal:", this.listVal);
          
        }
      })
    },
    onModel(item) {
      this.model = item.value;
      this.getData();
    },
    onCheck(index) {
      let tableData = [...this.tableData];
      tableData[index].checked = !!!tableData[index].checked;
      this.tableData = tableData;
    },
    createdMap(map) {
      this.map = map;
      map.hideZoomSlider(); // 隐藏层级控件
      let layer = new esri.layers.GraphicsLayer({id: "WarnRoot"});
      let textLayer = new esri.layers.GraphicsLayer({id: "WarnRoot_TEXT"});
      map.addLayers([textLayer, layer]);

      this.getData();
    },
    getData() {
      let {map} = this;
      let layer = map.getLayer("WarnRoot");
      let textLayer = map.getLayer("WarnRoot_TEXT");
      layer.clear();
      textLayer.clear();

      this.tableData = [];

      let {id} = this.modalVal;
      let params = {
        alarmId: this.alarmid,
        tracingType: this.model
      }

      this.loading = true;
      request({url: "/alarm/tracing", params}).then(res => {
        if (res.code === 200 && res.data) {
          let pointList = [];
          let {lines, points, specialResults} = res.data;
          if (lines && lines.length) {
            let _points = LayerService.handleLineData(layer, lines, 'down')
            pointList = [...pointList, ..._points]
          }

          if (points && points.length) {
            let _points = LayerService.handlePointData(layer, points, 'down');
            pointList = [...pointList, ..._points]
          }

          if (specialResults) {
            let P = {
              "PUMPSTATION": "泵站",
              "RESIDENTIAL": "小区"
            }
            let tableData = [];
            for (let i in specialResults) {
              for (let j in specialResults[i]) {
                let {tracingObject} = specialResults[i][j];
                specialResults[i][j] = {...specialResults[i][j], ...tracingObject};

                tableData.push({
                  ...specialResults[i][j],
                  typeName: P[i],
                  checked: false
                })
              }
            }

            this.tableData = tableData;
            LayerService.handlePolygon(layer, textLayer, specialResults, 'down');
          }


          let polygon = new esri.geometry.Polygon([pointList]);
          let returnExtent = polygon.getExtent();
          if (returnExtent) {
            let offset = 0.01;
            returnExtent.xmin = returnExtent.xmin - offset;
            returnExtent.ymin = returnExtent.ymin - offset;
            returnExtent.xmax = returnExtent.xmax + offset;
            returnExtent.ymax = returnExtent.ymax + offset;
            map.setExtent(returnExtent);
          }
        }

        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;

  .content {
    display: flex;
    border: 1px solid #093C5C;

    .content-left {
      width: 220px;
      border-right: 1px solid #093C5C;

      .select-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 30px;
        padding: 0 5px;

        .select-item {
          flex: 1;
          color: #FFF;
          box-shadow: 0 0 8px 4px RGBA(107, 232, 243, 1) inset;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 18px;
          opacity: 0.7;
          cursor: pointer;

          &:nth-child(2) {
            margin: 0 5px;
          }
        }

        .select-item-ed {
          opacity: 1;
        }
      }

      .list-wrap {
        max-height: calc(400px - 30px);
        overflow-y: auto;

        &::-webkit-scrollbar { /*滚动条整体样式*/
          width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        }

        &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner { /*滚动条里面小方块*/
          background: #1AD0F3;;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
          background: #003659;
        }

        .list-item {
          display: flex;
          position: relative;
          padding: 10px 4px;
          border-bottom: 1px solid #093C5C;
          cursor: pointer;

          .item-label, .item-label2 {
            position: absolute;
            top: 4px;
            right: 4px;
            border-radius: 4px;
            padding: 0 2px;
            font-size: 12px;
            border: 1px solid #EEA12F;
            color: #EEA12F;
          }

          .item-label2 {
            border: 1px solid #00CCFF;
            color: #00CCFF;
          }

          .item-check {
            width: 20px;
            text-align: center;

            .checkImg {
              width: 10px;
              height: 10px;
            }
          }

          .item-content {
            flex: 1;
            color: #FFFFFF;
            font-size: 12px;

            .item-title {
              font-weight: bold;
            }

            .item-text {
              margin-top: 4px;
            }
          }
        }

      }
    }

    .content-right {
      flex: 1;
    }
  }
}
</style>
