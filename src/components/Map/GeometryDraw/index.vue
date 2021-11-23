<template>
  <Map :height="height" @createdMap="createdMap">
    <div class="headerLeft" v-if="!disabled">
      <el-autocomplete v-model="address" :fetch-suggestions="querySearch" placeholder="请输入地址" :trigger-on-focus="false">
        <template slot="prepend">嘉兴市</template>
        <el-button slot="append" icon="el-icon-search" @click="onMapAddress"/>
      </el-autocomplete>
    </div>

    <div class="headerRight" v-if="!disabled">
      <span v-if="maxLength > graphicLength">
        <a @click="deactivateDrawTool" v-if="drawing">停止绘制</a>
        <a @click="activateDrawTool" v-else>绘制</a>
      </span>
      <el-divider direction="vertical" v-if="maxLength > graphicLength"></el-divider>
      <a @click="clear">清除</a>
<!--      <el-divider direction="vertical"></el-divider>-->
<!--      <a>全屏</a>-->
    </div>
  </Map>
</template>

<script>
import Map from "../index.vue";
import MapTool from "../MapTool";
import { loadModules } from "esri-loader";
import MapService from "../MapService";
import config from "../config";
export default {
  name: "GeometryDraw",
  components: {
    Map
  },
  props: {
    disabled: {
      type: Boolean, // 是否禁用
      default: false
    },
    drawType: { // 绘制类型 point multipoint line polyline polygon arrow triangle circle ellipse
      type: String,
      default: "point"
    },
    maxLength: { // 最大绘制数量
      type: Number,
      default: 1
    },
    height: {
      type: String,
      default: "400px"
    }
  },
  data() {
    return {
      address: "",
      graphicLength: 0,
      drawing: false
    }
  },
  beforeDestroy() {
    this.drawToolbar && this.drawToolbar.deactivate();
    this.editToolbar && this.editToolbar.deactivate();
  },
  methods: {
    createdMap(map) {
      this.map = map;

      loadModules(
        [
          "esri/Color",

          "esri/toolbars/draw",
          "esri/toolbars/edit",

          "esri/graphic",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/SimpleFillSymbol",

          "dojo/_base/event",
        ],
        config.arcGisOption
      ).then(([Color, Draw, Edit, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, event]) => {
        this.mapTool = {Color, Draw, Edit, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, event};

        this.map.graphics.clear();

        this.map.graphics.on("graphic-add", evt => {
          this.graphicChange(evt);
        });

        this.map.graphics.on("graphic-remove", evt => {
          this.graphicChange(evt);
        });

        this.map.graphics.on("graphics-clear", () => {
          this.graphicLength = 0;
        });

        if (!this.disabled) {
          this.createDrawToolbar(); // 创建绘制工具
          this.createEditToolbar(); // 创建编辑工具
        }

        this.$emit("createdMap", this.map);
      })
    },
    graphicChange(evt) {
      // 判断是否超出最大绘制数量
      if (this.maxLength && evt.target.graphics) {
        let graphicLength = evt.target.graphics.length;
        if (graphicLength >= this.maxLength) {
          this.deactivateDrawTool();
        }
      }

      this.graphicLength = evt.target.graphics.length;
    },
    createDrawToolbar() {
      if (this.map && this.mapTool) {
        let {Draw} = this.mapTool;
        this.drawToolbar = new Draw(this.map);
        this.drawToolbar.on("draw-end", this.addToMap);
      }
    },
    deactivateDrawTool() {
      this.drawing = false; // 关闭绘制状态
      this.drawToolbar && this.drawToolbar.deactivate(); // 关闭绘制工具
      this.map.showZoomSlider(); // 展示层级控件
    },
    activateDrawTool() {
      if (this.map && this.mapTool) {
        this.drawing = true; // 设置绘制状态
        this.editToolbar.deactivate(); // 关闭编辑
        this.map.hideZoomSlider(); // 隐藏层级控件

        let {Draw} = this.mapTool;
        let tool = this.drawType.toUpperCase().replace(/ /g, "_");
        this.drawToolbar.activate(Draw[tool]);
      }
    },
    addToMap(evt) {
      let symbol;
      let {Color, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Graphic} = this.mapTool;
      switch (evt.geometry.type) {
        case "point":
        case "multipoint":
          symbol = new SimpleMarkerSymbol({
            size: 16,
            color: new Color([34, 145, 252, 0.35]),
            outline: {
              color: new Color("#2491fc"),
              width: 2
            }
          });
          break;
        case "polyline":
          symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 3);
          break;
        default:
          symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 3), new Color([34, 145, 252, 0.35]));
          break;
      }
      let graphic = new Graphic(evt.geometry, symbol, {drawType: this.drawType});
      this.map.graphics.add(graphic);
    },
    createEditToolbar() {
      let {Edit, event} = this.mapTool;
      this.editToolbar = new Edit(this.map);

      // 单击图形时激活工具栏
      this.map.graphics.on("click", evt => {
        // 判断是否为绘制中
        if (!this.drawing) {
          event.stop(evt);
          this.activateEditToolbar(evt.graphic);
        }
      });

      // 在图形外单击时禁用工具栏
      this.map.on("click", () => {
        this.editToolbar.deactivate();
      });
    },
    activateEditToolbar(graphic) {
      let {Edit} = this.mapTool;
      let tool = Edit.MOVE | Edit.EDIT_VERTICES | Edit.SCALE | Edit.ROTATE;

      // 针对点位只做移动操作
      let drawType = this.drawType.toLowerCase();
      if (drawType.indexOf("point") !== -1) {
        tool = Edit.MOVE;
      }

      // 指定工具栏选项
      let options = {
        allowAddVertices: true,
        allowDeleteVertices: true,
        uniformScaling: true
      };
      this.editToolbar.activate(tool, graphic, options);
    },
    querySearch(queryString, cb) {
      MapService.addressSearch(queryString, geocodes => {
        geocodes.map(v => {
          v.value = v.formatted_address
        })
        cb(geocodes);
      })
    },
    // 地图地点查询
    onMapAddress() {
      if (this.address) {
        MapService.addressSearch(this.address, geocodes => {
          if (geocodes && geocodes.length) {
            let {location} = geocodes[0];
            if (location) {
              location = location.split(',');
              let result = MapTool.gcj02towgs84(Number(location[0]), Number(location[1]));
              MapService.mapPanTo(this.map, result, 14);
            }
          }
        })
      }
    },
    clear() {
      this.map && this.map.graphics.clear();
      this.drawToolbar && this.drawToolbar.deactivate();
      this.editToolbar && this.editToolbar.deactivate();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.headerLeft {
  position: absolute;
  top: 10px;
  left: 60px;
  z-index: 2;
  display: flex;

  .LonLat {
    display: flex;
    margin-left: 20px;
    border-radius: 4px;
    font-weight: 600;
    text-shadow: 0 0 3px rgba(0, 0, 0, .3);

    .LonLatItem {
      font-size: 14px;
      margin-right: 10px;
    }
  }
}

.headerRight {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  background: #FFF;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #00afff;
}

.right {
  position: absolute;
  top: 80px;
  right: 10px;
  z-index: 2;
  background: #FFF;
  border-radius: 4px;
  padding: 0 10px;
  .rightItem {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #00afff;
    padding: 5px 0;
    border-bottom: 1px dashed #cccccc;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
