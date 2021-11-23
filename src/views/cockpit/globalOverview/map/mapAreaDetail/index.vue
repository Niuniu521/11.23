<template>
  <div class="mapAreaDetail">
    <div id="map" class="mapAreaDetail"/>
  </div>
</template>

<script>
  import request from "@/utils/request";

  import jx from "../嘉兴市.json";
  import nh from "../南湖区.json";
  import js from "../嘉善县.json";
  import ph from "../平湖市.json";
  import tx from "../桐乡市.json";
  import hn from "../海宁市.json";
  import hy from "../海盐县.json";
  import xz from "../秀洲区.json";

  let mapJson = {
    '嘉兴市': jx,
    '南湖区': nh,
    '嘉善县': js,
    '平湖市': ph,
    '桐乡市': tx,
    '海宁市': hn,
    '海盐县': hy,
    '秀洲区': xz,
  };

  let centerMap = {
    '南湖区': [120.82, 30.73],
    '嘉善县': [120.89, 30.92],
    '平湖市': [121.10, 30.73],
    '桐乡市': [120.48, 30.631636],
    '海宁市': [120.68092, 30.48],
    '海盐县': [120.88, 30.50],
    '秀洲区': [120.66, 30.81],
  };
  let POINT = {
    'SEWAGE_TREATMENT_PLANT': {
      typeName: "污水厂",
      icon: {
        url: require('../../../../../assets/images/cockpit/networkResource/wsc.png'),
        // url: require('../../../../../assets/images/cockpit/networkResource/bz.png'),

        width: 25,
        height: 33
      }
    },
    'PUMPING_STATION': {
      typeName: "泵站",
      icon: {
        url: require('../../../../../assets/images/cockpit/networkResource/bz.png'),
        width: 25,
        height: 33
      }
    },
  }

  export default {
    components: {},
    props: {
      activeAreaName: '',
    },
    data() {
      return {
        map: null,
        markerLayer: null,
        lineLayer: null,

      }
    },
    mounted() {
      this.initMap();
      this.loadAllData();
    },
    methods: {
      initMap() {
        const t = this;
        var map = new AMap.Map('map', {
          mapStyle: 'amap://styles/darkblue',
          center: [120.749953, 30.764652],
          zoom: 13
        });
        this.map = map;
        const features = mapJson[this.activeAreaName].features[0];
        const center = centerMap[this.activeAreaName];
        const path = features.geometry.coordinates[0][0];
        this.drawPolygon(path, function (polygon) {
          t.map.setFitView(polygon);
          t.map.setZoom(11);

        });
        this.drawTitle(this.activeAreaName, center);


        var layer = new AMap.LabelsLayer({
          zooms: [3, 20],
          collision: false,
          // zIndex: 1000,
        });
        var lineLayer = new AMap.LabelsLayer({
          zooms: [3, 20],
          collision: false,
          // zIndex: 1000,
        });
        t.map.add(layer);
        t.map.add(lineLayer);
        t.lineLayer = lineLayer;
        t.markerLayer = layer;

      },


      loadAllData() {
        request({url: '/pipenetwork/trace/treatments_pumpstations', method: 'post'}).then(data => {
          let dataVal = {};
          if (data.code === 200 && data.data) {
            dataVal = data.data;
          }
          this.handleData(dataVal)
        })
      },

      creatMarker(model, cb) {
        if (!POINT[model.pointType]) return;
        const {icon} = POINT[model.pointType];
        if (model.geometry.x && model.geometry.y) {
          this.drawMarker([model.geometry.x, model.geometry.y], icon, model.name, model, cb);

        }

      },
      handleData(dataVal) {
        const t = this;
        const {lines, points} = dataVal;

        points.map((item, index) => {
          this.creatMarker(item, function (marker) {

          })
        })
        let linesResult = [];
        lines.map((item, index) => {

          if (item.geometry.paths) {
            item.geometry.paths && item.geometry.paths.map((m, i) => {
              this.drawLine(m, item, function (line) {
                linesResult.push(line);


                // if ((i === item.geometry.paths.length - 1) && (index === lines.length - 1)) {
                //
                //   console.log('lines11111', linesResult);
                //   t.lineLayer.add(linesResult);
                // }
              })
            })

          }

        })


      },
      drawLine(path, data, cb) {
        const t = this;
        if (!path) return;
        AMap.convertFrom(path, 'gps', function (status, result) {
          if (result.info === 'ok') {
            var lnglats = result.locations;
            var line = new AMap.Polyline({
              path: lnglats,
              isOutline: true,
              outlineColor: '#ffeeff',
              borderWeight: 0,
              strokeColor: "#ABF8FF",
              strokeOpacity: 1,
              strokeWeight: 1,
              strokeStyle: "solid",
              extData: data,

            });
            t.map.add(line);
            cb && cb(line);
          }
        });
      },
      drawMarker(position, icon, title, data, cb) {
        const t = this;

        const {url, width, height} = icon;
        AMap.convertFrom(position, 'gps', function (status, result) {
          if (result.info === 'ok') {
            var lnglats = result.locations;
            var marker = new AMap.LabelMarker({
              position: lnglats[0],
              icon: {
                image: icon.url,
                size: [width, height],
                anchor: 'bottom-center',
                zooms: [1, 20],
              },
              text: {
                content: title,
                direction: 'bottom',
                zooms: [1, 20],
                style: {
                  fillColor: '#c1c1c1',
                  fontSize: 11,
                  backgroundColor: 'transparent',
                  strokeWidth: 0,
                },
              },
              extData: data,
              // offset: new AMap.Pixel(-13, -30)
            });
            t.markerLayer.add(marker);
            cb && cb(marker);
          }


        });


      },
      drawTitle(title, center) {
        const t = this;

        AMap.convertFrom(center, 'gps', function (status, result) {
          if (result.info === 'ok') {
            var lnglats = result.locations;
            var polygon = new AMap.Text({
              text: title,
              map: t.map,
              position: center,
              style: {
                backgroundColor: 'transparent',
                color: '#fff',
                borderWidth: 0,
              }
            });

          }
        });
      },

      drawPolygon(path, cb) {
        const t = this;

        AMap.convertFrom(path, 'gps', function (status, result) {
          if (result.info === 'ok') {
            var lnglats = result.locations;
            var polygon = new AMap.Polygon({
              path: lnglats,
              fillOpacity: 0.4,
              fillColor: 'rgba(5, 33, 81, 1)', // 多边形填充颜色
              borderWeight: 2, // 线条宽度，默认为 1
              strokeColor: '#2ab8ff', // 线条颜色
            });

            t.map.add(polygon);
            cb && cb(polygon);
          }
        });

      }

    }
  }
</script>

<style lang="scss" scoped>


  .mapAreaDetail {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: rebeccapurple;
  }

</style>
