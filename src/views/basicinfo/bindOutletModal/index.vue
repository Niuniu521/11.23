<template>
  <!-- 绑定窨井 -->
  <ModalForm
    :title="formYJ.name +' => 绑定窨井'"
    :visible="visible"
    :items="modalYJItems"
    :form="formYJ"
    :rules="rulesYJ"
    @cancel="cancelYJ"
    @submitForm="submitYJForm"
    :loading="modalLoading">
    <Map v-if="visible" slot="map" height="400px" @createdMap="createdMap">
      <div class="headerRight" v-if="maxLength !== 1">
        <a @click="activateDrawTool">{{ drawing ? "取消框选" : "框选" }}</a>
      </div>
    </Map>
  </ModalForm>
</template>

<script>
import { loadModules } from "esri-loader";
import Map from "@/components/Map";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import config from "../../../components/Map/config";
import YJ from "@/assets/svg/yj.svg";
import YJ_SELECT from "@/assets/svg/yj-select.svg";

let yj, yj_select;
export default {
  components: {
    Map,
    ModalForm,
  },
  name: "Data",
  props: {
    visible: Boolean,
    form: Object,
    maxLength: {
      type: Number,
      default: 999
    }
  },
  data() {
    return {
      formYJ: {...this.form},
      modalLoading: false,
      modalYJItems: [
        {
          type: 'select',
          label: '窨井',
          paramName: 'pointCodes',
          multiple: true,
          options: [],
          span: 24,
          removeTag: this.removeTag
        },
      ],
      rulesYJ: {},
      drawing: false,
      map: null,
      mapTool: null,
    };
  },
  beforeDestroy() {
    this.drawToolbar && this.drawToolbar.deactivate();
  },
  methods: {
    createdMap(map) {
      this.map = map;
      yj = new esri.symbol.PictureMarkerSymbol(YJ, 20, 20);
      yj_select = new esri.symbol.PictureMarkerSymbol(YJ_SELECT, 20, 20);
      if (this.maxLength !== 1) {
        this.createDrawToolbar(); // 创建绘制工具
      }
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        if (geometry) {
          let layer = new esri.layers.GraphicsLayer({id: "geometry"});
          map.addLayer(layer);
          if (geometry.x && geometry.y) {
            MapService.addPoint({map, geometry, zoom: 14, layer});
          } else {
            MapService.addPolygon({map, geometry, layer});
          }
        }

        if (geometry) {
          this.modalLoading = true;
          MapService.getAroundYJPoints(map, geometry).then(data => {
            this.modalLoading = false;
            if (data && data.length) {
              data.map(v => {
                let {type, features, geometry} = v;
                if (type === 'point') {
                  this.renderPoint(features, geometry)
                } else if (type === 'line') {
                  this.renderLine(features, geometry)
                }
              })
            }
          });
        }
      }
    },
    createDrawToolbar() {
      loadModules(["esri/toolbars/draw"], config.arcGisOption).then(([Draw]) => {
        this.mapTool = {Draw};
        this.drawToolbar = new Draw(this.map);
        this.drawToolbar.on("draw-end", e => {
          if (e.geometry) {
            let layer = this.map.getLayer("GL_YJ");
            let {graphics = []} = layer;
            for(let i= 0, total= graphics.length; i < total; i++) {
              let {geometry, attributes} = graphics[i];
              if(geometry && attributes && e.geometry.contains(geometry)){
                let {EXP_NO} = attributes;
                if (EXP_NO) {
                  if (this.formYJ.pointCodes.includes(EXP_NO)) {
                    graphics[i].setSymbol(yj);
                    this.formYJ.pointCodes = this.formYJ.pointCodes.filter(v => v !== EXP_NO);
                  } else {
                    graphics[i].setSymbol(yj_select);
                    this.formYJ.pointCodes = [...this.formYJ.pointCodes, EXP_NO];
                  }
                }
              }
            }
          }
        });
      })
    },
    activateDrawTool() {
      if (this.drawing) {
        this.drawing = false; // 设置绘制状态
        this.drawToolbar.deactivate();
        return
      }

      if (this.map && this.mapTool) {
        this.drawing = true; // 设置绘制状态
        this.map.hideZoomSlider(); // 隐藏层级控件

        let {Draw} = this.mapTool;
        this.drawToolbar.activate(Draw.RECTANGLE);
      }
    },
    renderLine(data, geometry) {
      let {map} = this;
      let imgLayer = new esri.layers.MapImageLayer({id: "GL_IMG"});
      map.addLayer(imgLayer);
      let layer = new esri.layers.ArcGISDynamicMapServiceLayer(config.arcGisMapServer, {
        id: 'PipeLine',
      });
      layer.setVisibleLayers([5]);
      this.getImg(layer, imgLayer, geometry);
      dojo.connect(map, "onExtentChange", () => {
        let mapExtent = new esri.geometry.Extent(map.extent);
        let newExtent = mapExtent.intersects(geometry)
        this.getImg(layer, imgLayer, newExtent);
      })
    },
    getImg(layer, imgLayer, geometry) {
      let {map} = this;
      let imageParameters = new esri.layers.ImageParameters();
      imageParameters.layerIds = [5];
      imageParameters.bbox = geometry;
      imageParameters.width = map.width;
      imageParameters.height = map.height;
      imageParameters.transparent = true;

      layer.exportMapImage(imageParameters, img => {
        const imgHref = img.href
        let splitArr = imgHref.split('//')
        let index = splitArr[1].indexOf('/')
        let href = splitArr[1].slice(index)
        img.href = href
        imgLayer.removeAllImages();
        imgLayer.addImage(img)
      })
    },
    renderPoint(data) {
      let {map} = this;
      let layer = new esri.layers.GraphicsLayer({id: "GL_YJ"});
      map.addLayer(layer);

      let pointCodes = this.formYJ.pointCodes || [];
      data.map(v => {
        let {attributes = {}, geometry} = v;
        let {EXP_NO} = attributes;
        let symbol = yj;
        if (pointCodes && pointCodes.length && EXP_NO && pointCodes.includes(EXP_NO)) {
          symbol = yj_select
        }

        let graphic = new esri.Graphic(geometry, symbol, attributes);
        layer.add(graphic)
      })

      // 图层点击
      layer.on('click', evt => {
        let {attributes = {}} = evt.graphic;
        let {EXP_NO} = attributes;
        if (EXP_NO) {

          this.formYJ.pointCodes = this.formYJ.pointCodes || [];

          // 判断长度限制
          if (this.maxLength && this.formYJ.pointCodes.length >= this.maxLength) {
            return
          }

          if (this.formYJ.pointCodes.includes(EXP_NO)) {
            evt.graphic.setSymbol(yj);
            this.formYJ.pointCodes = this.formYJ.pointCodes.filter(v => v !== EXP_NO);
          } else {
            evt.graphic.setSymbol(yj_select);
            this.formYJ.pointCodes = [...this.formYJ.pointCodes, EXP_NO];
          }
        }
      })
    },
    removeTag(val) {
      let {map} = this;
      if (map) {
        let layer = map.getLayer("GL_YJ");
        if (layer) {
          let {graphics = []} = layer;
          if (graphics && graphics.length) {
            graphics.map(v => {
              let {attributes} = v;
              let {EXP_NO} = attributes;
              if (EXP_NO && EXP_NO === val) {
                v.setSymbol(yj)
              }
            })
          }
        }
      }
    },
    cancelYJ() {
      this.resetYJ();
      this.$emit('cancel')
    },
    resetYJ() {
      this.formYJ = {};
      this.resetForm("formYJ");
    },
    submitYJForm() {
      let val = {
        pointCodes: this.formYJ.pointCodes,
        id: this.form.objectId
      }
      this.$emit('submitForm', val)
    },
  }
};
</script>
<style lang="scss">
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
</style>
