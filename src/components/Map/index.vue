<template>
  <div class="MAP" :style="{width, height}" :class="{'black': cockpit}">
    <div :id="ID" class="map"></div>
    <div class="widget" v-if="widget" :style="widgetStyle">
      <div class="widgetItem" @click="onMapCenter">
        <i class="el-icon-location" />
      </div>
      <div class="widgetItem" @click="onMapTheme">
        <i class="el-icon-map-location" v-if="theme === 'vector'"/>
        <i class="el-icon-picture-outline-round" v-else/>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import config from "./config.js";
import MapService from "./MapService.js";
import { loadModules } from "esri-loader";
export default {
  name: "Map",
  props: {
    hideMap: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    cockpit: {
      type: Boolean,
      default: false
    },
    mapTheme: {
      type: String,
      default: 'vector'
    },
    widget: Boolean,
    widgetStyle: Object,
    maxZoom: {
      type: Number,
      default: 16
    },
    minZoom: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      theme: this.mapTheme,
      ID: Math.random().toString(36).substr(3, 6),
      MAP_THEME: [
        {title: "卫星影像", mapTheme: "img", imgLayer: "img_c", textLayer: "cia_c"},
        {title: "二维影像", mapTheme: "vector", imgLayer: "vec_c", textLayer: "cva_c"},
      ]
    }
  },
  created() {
    this.initMap();
  },
  beforeDestroy() {
    this.map && this.map.destroy();
  },
  methods: {
    // 初始化地图
    initMap() {
      let t = this;

      loadModules(
        [
          "esri/layers/ArcGISTiledMapServiceLayer",
          "esri/dijit/BasemapLayer",
          "esri/dijit/Basemap",
          "esri/map",
          "esri/layers/WebTiledLayer",
          "esri/layers/TileInfo",
        ],
        config.arcGisOption
      ).then(([ArcGISTiledMapServiceLayer, BasemapLayer, Basemap, Map, WebTiledLayer, TileInfo]) => {
        let tileInfo = new TileInfo({
          dpi: 90.71428571427429,
          rows: 256,
          cols: 256,
          compressionQuality: 0,
          origin: {
            x: -180,
            y: 90
          },
          spatialReference: {
            wkid: 4326
          },
          lods: [
            {
              level: 2,
              levelValue: 2,
              resolution: 0.3515625,
              scale: 147748796.52937502
            },
            {
              level: 3,
              levelValue: 3,
              resolution: 0.17578125,
              scale: 73874398.264687508
            },
            {
              level: 4,
              levelValue: 4,
              resolution: 0.087890625,
              scale: 36937199.132343754
            },
            {
              level: 5,
              levelValue: 5,
              resolution: 0.0439453125,
              scale: 18468599.566171877
            },
            {
              level: 6,
              levelValue: 6,
              resolution: 0.02197265625,
              scale: 9234299.7830859385
            },
            {
              level: 7,
              levelValue: 7,
              resolution: 0.010986328125,
              scale: 4617149.8915429693
            },
            {
              level: 8,
              levelValue: 8,
              resolution: 0.0054931640625,
              scale: 2308574.9457714846
            },
            {
              level: 9,
              levelValue: 9,
              resolution: 0.00274658203125,
              scale: 1154287.4728857423
            },
            {
              level: 10,
              levelValue: 10,
              resolution: 0.001373291015625,
              scale: 577143.73644287116
            },
            {
              level: 11,
              levelValue: 11,
              resolution: 0.0006866455078125,
              scale: 288895.277144
            },
            {
              level: 12,
              levelValue: 12,
              resolution: 0.00034332275390625,
              scale: 144447.638572
            },
            {
              level: 13,
              levelValue: 13,
              resolution: 0.000171661376953125,
              scale: 72223.819286
            },
            {
              level: 14,
              levelValue: 14,
              resolution: 8.58306884765625e-5,
              scale: 36111.909643
            },
            {
              level: 15,
              levelValue: 15,
              resolution: 4.291534423828125e-5,
              scale: 18055.954822
            },
            {
              level: 16,
              levelValue: 16,
              resolution: 2.1457672119140625e-5,
              scale: 9027.977411
            },
            {
              level: 17,
              levelValue: 17,
              resolution: 1.0728836059570313e-5,
              scale: 4508.9354409599309
            },
            {
              level: 18,
              levelValue: 18,
              resolution: 5.3644180297851563e-6,
              scale: 2254.4677204799655
            },
            {
              level: 19,
              levelValue: 19,
              resolution: 2.68220901489257815e-6,
              scale: 1127.23386023998275
            },
            {
              level: 20,
              levelValue: 2,
              resolution: 1.341104507446289075e-6,
              scale: 563.616930119991375
            }
          ]
        });

        let layer = new BasemapLayer({
          url:"https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/"
        });

        let basemap = new Basemap({
          layers: [layer],
          title:"Public Safety",
        });

        // 创建地图，不设置底图，如果设置底图会造成坐标系无法被转换成 ESPG:4326 (WGS1984)
        t.map = new Map(this.ID, {
          // basemap,
          center: [108.5, 34],
          zoom: 11,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          spatialReference: {
            wkid: 3857
          },
          logo: false,
          showLabels: true,
          // basemap,
        });


        // 加载经纬度矢量底图
        var tiledMapServiceLayer = new ArcGISTiledMapServiceLayer("http://47.98.112.19:6080/arcgis/rest/services/jiaxing/ImageServer");

        let layers = [];
        t.MAP_THEME.map(item => {
          let {mapTheme, imgLayer, textLayer} = item;
          // 加载经纬度底图
          let layerUrl = `http://{subDomain}.tianditu.gov.cn/DataServer?T=${imgLayer}&x={col}&y={row}&l={level}&tk=13b4890427f17c692f9efed46b98db81`;
          let layer1 = WebTiledLayer(layerUrl, {
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            tileInfo: tileInfo,
            visible: this.hideMap ? false : mapTheme === this.mapTheme,
            id: `${mapTheme}a`,
            className: `${mapTheme}a`
          });


          //加载经纬度中文注记（配合底图使用）
          let layerUrl2 = `http://{subDomain}.tianditu.gov.cn/DataServer?T=${textLayer}&x={col}&y={row}&l={level}&tk=13b4890427f17c692f9efed46b98db81`;
          let layer2 = WebTiledLayer(layerUrl2, {
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            tileInfo: tileInfo,
            visible: this.hideMap ? false : mapTheme === this.mapTheme,
            id: `${mapTheme}b`,
            className: `${mapTheme}b`
          });

          layers.push(layer1, layer2);
        });
        t.map.addLayers(layers);

        // let point = new esri.geometry.Point({x: 120.92183, y: 30.83365, spatialReference: {wkid: 4326}});
        // const market = new esri.symbol.PictureMarkerSymbol("http://api.tianditu.gov.cn/v4.0/image/marker-icon.png", 30, 35);
        // let graphic = new esri.Graphic(point, market);
        // t.map.graphics.add(graphic);

        MapService.setCenter(t.map);

        this.$emit('createdMap', t.map);

        window.onresize= () =>{
          t.map.resize(true);
          t.map.reposition();
        }
      })
    },
    onMapCenter() {
      MapService.setCenterAndZoom(this.map);
    },
    onMapTheme() {
      this.theme = this.theme === "vector" ? "img" : "vector";
      this.setBaseMap();
    },
    // 获取地图主题
    setBaseMap() {
      const t = this;
      t.MAP_THEME.map(item => {
        let {mapTheme} = item;
        let visible = false;
        if (this.theme === item.mapTheme) {
          visible = true;
        }
        t.map.getLayer(`${mapTheme}a`).setVisibility(visible);
        t.map.getLayer(`${mapTheme}b`).setVisibility(visible);
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.MAP {
  position: relative;

  .map {
    height: 100%;
    position: relative;
    background: #CCC;
  }
}

.widget {
  position: absolute;
  z-index: 2;
  display: flex;
  top: 100px;
  left: 500px;
  transition: all .35s;

  .widgetItem {
    cursor: pointer;
    border-radius: 4px;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 29, 54, 1);
    box-shadow: 0 0 10px 2px rgba(24, 144, 255, 0.35) inset;
    margin-left: 6px;

    color: #12d0ff;
    i {
      font-size: 20px;
    }

    &:first-child {
      margin-left: 0;
    }
  }
}

.black {
  .map {
    background: #152937;

    ::v-deep .vectora {
      -webkit-filter: grayscale(80%) invert(100%);
      filter: sepia(100%) hue-rotate(-15deg) invert(100%);
      //opacity: .5 !important;
    }

    ::v-deep .vectorb {
      -webkit-filter: invert(100%);
      -ms-filter: invert(100%);
      filter: invert(100%);
      // -ms-filter: invert(100%);
      // opacity: 0.8 !important;
    }
  }
}

::v-deep .esriPopup .esriPopupWrapper {
  box-shadow: 0 0 0 0 !important;
}
::v-deep .esriPopup .sizer {
  width: auto;
}
::v-deep .esriPopup .outerPointer {
  display: none;
}
::v-deep .esriPopup .pointer {
  display: none;
}
::v-deep .esriPopup .titlePane {
  display: none;
}
::v-deep .esriPopup .titleButton.maximize {
  display: none;
}
::v-deep .esriPopup .contentPane {
  background-color: rgba(0, 12, 26, 0.7) !important;
  color: #FFF !important;
  font-style: normal !important;
  font-size: 14px !important;
  min-height: 40px;
  height: auto;
  min-width: 100px;
  padding-right: 20px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: visible;
  white-space: nowrap;

  &::before, &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 2;
  }
  &::before {
    top: -2px;
    left: -2px;
    border-top: 3px solid #dedede;
    border-left: 3px solid #dedede;
  }
  &::after {
    bottom: -2px;
    right: -2px;
    border-bottom: 3px solid #dedede;
    border-right: 3px solid #dedede;
  }
}
::v-deep .esriPopup .actionsPane {
  display: none;
  background: rgba(90, 111, 128, 0.5);
}
::v-deep .esriPopup .outerPointer.left {
  background: #0f1f2d;
}

::v-deep .hoverconteneName {
  color: #FFF;
}
::v-deep .hoverconteneValue {
  margin-left: 30px;
  color: #fff;
}

::v-deep path.flow {
  stroke-dashoffset: 0;
  animation: flex-draw 20s linear infinite;
}

@keyframes flex-draw {
  from {
    stroke-dashoffset: 100%;
  }
  to {
    stroke-dashoffset: 0;
  }
}

::v-deep image.jump {
  animation: jump 2s infinite;
}
::v-deep image.jumpOne {
  animation: jump 2s;
}
@keyframes jump {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(0px, -30px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

</style>
