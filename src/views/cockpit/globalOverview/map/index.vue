<template>
  <div class="chart-wrap">
    <div id="chart-city" class="chart-city" />

    <!--<MapAreaDetail :activeAreaName="activeAreaName"  v-if="backShow" />-->
    <div class="chart-back" v-if="backShow" @click="mapBack">
      <i class="el-icon-arrow-left"></i>
      返回
    </div>

    <!--<div class="bottom" v-if="!backShow"/>-->
  </div>
</template>

<script>

import echarts from "echarts";
import detailBg from "../../../../assets/images/cockpit/globalOverview/detailBg.png";
import pointBg from "../../../../assets/images/cockpit/globalOverview/pointBg.png";
import request from "@/utils/request";
import MapTool from "@/services/MapTool";
import MapAreaDetail from "@/views/cockpit/globalOverview/map/mapAreaDetail";
import PublicService from "@/services/PublicService";

import jx from "./嘉兴市.json";
import nh from "./南湖区.json";
import js from "./嘉善县.json";
import ph from "./平湖市.json";
import tx from "./桐乡市.json";
import hn from "./海宁市.json";
import hy from "./海盐县.json";
import xz from "./秀洲区.json";
require('echarts/theme/macarons') // echarts theme

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
let POINT = {
  'SEWAGE_TREATMENT_PLANT': {
    typeName: "污水厂",
    icon: {
      url: require('../../../../assets/images/cockpit/networkResource/wsc.png'),
      width: 46.5,
      height: 53.4
    }
  },
  'PUMPING_STATION': {
    typeName: "泵站",
    icon: {
      url: require('../../../../assets/images/cockpit/networkResource/bz.png'),
      width: 42,
      height: 47
    }
  },
}

export default {
  components: {
    Map, MapAreaDetail
  },
  data() {
    return {
      myChart: null,
      backShow: false,
      isSearch: {},
      activeAreaName : '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mapInit("嘉兴市")
    })
  },
  methods: {
    mapBack() {
      this.mapInit("嘉兴市");
    },
    openAcitveArea(mapName) {
      this.backShow = mapName !== "嘉兴市";
      this.activeAreaName = mapName;
    },
    mapInit(mapName) {
      this.isSearch = {};
      this.backShow = mapName !== "嘉兴市";
      const allAreaData = []; // 所有区县的统计数据
      // const cityCodeArr = ["5100", "5101"]; // ["5100", "5101"] [省、市]
      if (this.myChart) {
        this.myChart.dispose(); // 销毁实例，实例销毁后无法再被使用。
      }

      this.myChart = echarts.init(document.getElementById('chart-city'), 'macarons')

      // 显示加载动画效果,可以在加载数据前手动调用该接口显示加载动画，在数据加载完成后调用 hideLoading 隐藏加载动画。
      this.myChart.showLoading();

      let mapDate = [
        {
          name: '嘉善县',
          value: [120.89,30.92],
          level: 4,
        },{
          name: '秀洲区',
          value: [120.66,30.81],
          level: 1,
        },{
          name: '南湖区',
          value: [120.82,30.73],
          level: 2,
        },{
          name: '平湖市',
          value: [121.10,30.73],
          level: 3,
        },{
          name: '海盐县',
          value: [120.88,30.50],
          level: 2,
        },{
          name: '海宁市',
          value: [120.68092,30.48],
          level: 1,
        },{
          name: '桐乡市',
          value: [120.48,30.631636],
          level: 2,
        }
      ];

      const data = mapJson[mapName].features.map((item, index) => {
        const {name, id} = item.properties; // geo文件中的地理名称

        const currentArea = allAreaData.find(v => {
          return v.name === name
        })
        let taskNumber = index, volunteerNumber = index;
        if (currentArea) {
          taskNumber = currentArea.taskNumber;
          volunteerNumber = currentArea.volunteerNumber;
        }

        return {
          name,
          value: mapDate.find(v => v.name === name).level,
          taskNumber: taskNumber, // 活动总数
          volunteerNumber: volunteerNumber * 10, // 志愿者总数
          coord: id,
        }
      })

      echarts.registerMap(mapName, mapJson[mapName]);

      // 隐藏动画加载效果。
      this.myChart.hideLoading();

      // 图表配置项
      let option = {
        tooltip: { // 提示框
          trigger: 'item',
          show: mapName === "嘉兴市",
          backgroundColor: "transparent",
          borderWidth: 0,
          formatter: function (params) {
            let str = `
              <div style="background: url('${detailBg}') no-repeat 0 0; background-size: 100% 100%; width:128px;height:124px; padding: 20px">
                <div>水厂：4</div>
                <div>监测点位：60</div>
                <div>泵站：30</div>
                <div>预警：1</div>
              </div>`;
            return str;
          },
          color: '#fff',
          rich: {
            fline: {
              padding: [0, 25],
              color: '#fff',
              textShadowColor: '#030615',
              textShadowBlur: '0',
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              fontSize: 14,
              fontWeight: 400,
            },
            tline: {
              padding: [0, 27],
              color: '#ABF8FF',
              fontSize: 12,
            },
          },
        },
        geo: {
          map: mapName,
          layoutCenter: ['50.2%', '50.7%'],
          layoutSize: mapName === "嘉兴市" ? '100%' : '84%',
          zoom: 0.72,
          aspectScale: 0.9,
          silent: true,
          roam: false,
          label: {
            normal: {
              show: mapName !== "嘉兴市",
              textStyle: {
                color: '#fff',
                fontSize: 16
              },
            },
            emphasis: {
              textStyle: {
                color: '#fff',
              },
            },
          },
          itemStyle: {
            normal: {
              ...(mapName === "嘉兴市" ? {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                  },{
                    offset: 1,
                    color: 'rgba(0, 164, 236, 1)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(0, 164, 236, 1)',
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 1,
              } : {
                borderColor: '#2ab8ff',
                borderWidth: 2,
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                  },{
                    offset: 1,
                    color: 'rgba(5, 33, 81, 1)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(0, 255, 255, 0.7)',
                shadowBlur: 6,
                shadowOffsetX: 0,
                shadowOffsetY: 1,
              }),
            },
            emphasis: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                },{
                  offset: 1,
                  color: 'rgba(5, 33, 81, 0.7)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              borderColor: '#2ab8ff',
              borderWidth: 2,
              shadowColor: 'rgba(0, 255, 255, 0.7)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 1,
              label: {
                show: false,
              },
            },
          },
        },
        visualMap: {
          show: false,
          min: 1,
          max: 5,
          inRange: {
            color: [
              '#3AFED9',
              '#3AF1FE',
              '#D9FE3A',
              '#FFA922',
              '#FF0F00',
            ]
          },
          calculable: true
        },
        series: [
        ...(mapName === "嘉兴市" ? [
          {
            name: 'map',
            type: "map", // map3D / map
            map: mapName,
            roam: false,
            aspectScale: 0.9,
            zoom: 0.75,
            itemStyle: {
              normal: {
                borderColor: '#2ab8ff',
                borderWidth: 2,
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                  },{
                    offset: 1,
                    color: 'rgba(5, 33, 81, 1)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(0, 255, 255, 0.7)',
                shadowBlur: 6,
                shadowOffsetX: 0,
                shadowOffsetY: 1,
              },
              emphasis: {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                  },{
                    offset: 1,
                    color: 'rgba(5, 33, 81, 0.6)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                borderColor: '#2ab8ff',
                borderWidth: 2,
                shadowColor: 'rgba(0, 255, 255, 0.7)',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 1,
                label: {
                  show: false,
                },
              },
            },
            label: {
              normal: {
                show: mapName !== "嘉兴市",
                textStyle: {
                  color: '#fff',
                  fontSize: 16
                },
              },
              emphasis: {
                textStyle: {
                  color: '#fff',
                },
              },
            },
            data,
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.name;
                },
                color: '#585858',
                fontSize: 15,
                padding: [10, 0, 0, 0]
              },
              emphasis: {
                show: true,
              },
            },
            symbol: `image://${pointBg}`,
            symbolSize: [24, 80],
            data: mapDate,
          }
        ] : [])
        ],
      };

      // 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      this.myChart.setOption(option, false);

      this.myChart.on('click', (e) => {
        console.log("e:", e);
        this.$store.commit("upacan",e)
        // console.log(this.$store.state.area);
        // s

        // if (mapName === "嘉兴市") {
        //   this.openAcitveArea(e.name);
        // }

        this.areaName = e.name;
        if (e.data) {
          let {pointType, attributes} = e.data;
          if (pointType === "PUMPING_STATION") {
            this.onPumpClick(attributes)
          }
        }
        if (mapName === "嘉兴市") {
          this.mapInit(e.name);
          if (e.name === "嘉善县") {
            this.onAreaClick();
            this.setMapArea();
          }
        }
      });

      // 动态显示tootip /*map3D中 不生效*/
      // setTimeout(() => {
      //   console.log('dispatchAction');
      //   myChart.dispatchAction({
      //     type: 'showTip',
      //     seriesIndex: 0,
      //     dataIndex: 1
      //   });
      // }, 3000);
    },
    showLoading() {
      this.myChart.showLoading({text: "加载中...", maskColor: 'rgba(0, 0, 0, 0.65', color: "#1890FF", textColor: "#1890FF"})
    },
    onPumpClick(val) {
      // 判断是否查询过
      if (this.isSearch[val.objectId]) {
        return
      }

      this.isSearch[val.objectId] = true;
      this.showLoading();
      request({url: '/pipenetwork/trace/pumpstations?pumpStationPointId='+val.objectId, method: 'post'}).then(data => {
        let dataVal = {};
        if (data.code === 200 && data.data) {
          dataVal = data.data;
        }

        this.handleData(dataVal)
        this.myChart.hideLoading()
      })
    },
    onAreaClick() {
      this.showLoading();
      request({url: '/pipenetwork/trace/treatments_pumpstations', method: 'post'}).then(data => {
        let dataVal = {};
        if (data.code === 200 && data.data) {
          dataVal = data.data;
        }

        this.handleData(dataVal)
        this.myChart.hideLoading()
      })
    },
    handleData(data) {
      let configList = [];
      let {lines, points, specialResults} = data;
      let options = this.myChart.getOption();
      let {series} = options;

      if (points && points.length) {
        let P = {};
        for (let TYPE in POINT) {
          points.map(item => {
            let {geometry = {}, pointType, objectId, name} = item;

            if (TYPE === pointType && !this.isSearch[objectId]) {
              let {icon} = POINT[TYPE];
              P[TYPE] = P[TYPE] || {
                IS_OTHER: true,
                type: 'scatter',
                coordinateSystem: 'geo',
                itemStyle: {
                  color: '#f00',
                },
                symbol: `image://${icon.url}`,
                symbolSize: [icon.width, icon.height],
                symbolOffset: [0, -(icon.height / 2)],
                zlevel: 99,
                data: [],
                label: {
                  show: true,
                  position: "bottom",
                  formatter: "{b}",
                  color: "#ccc"
                }
              }

              // 经纬度转换
              let {x, y} = geometry;
              if (x && y && POINT[pointType]) {
                let point = MapTool.wgs84togcj02(x, y);
                let marker = {
                  name: item.name,
                  value: point,
                  datas: 2468,
                  pointType,
                  attributes: item
                };
                P[TYPE].data.push(marker)
              }
            }
          })
        }

        for (let i in P) {
          configList.push(P[i])
        }
      }
      if (lines && lines.length) {
        let lineItem = {
          IS_OTHER: true,
          type: 'lines',
          coordinateSystem: 'geo',
          polyline: true,
          silent: true,
          data: [],
          lineStyle: {
            color: '#44f8c1',
            opacity: 0.2,
            width: 5
          },
          progressiveThreshold: 500,
          progressive: 200
        }
        let lineItem2 = {
          IS_OTHER: true,
          type: 'lines',
          coordinateSystem: 'geo',
          polyline: true,
          silent: true,
          data: [],
          zlevel: 4,
          lineStyle: {
            width: 0
          },
          effect: {
            constantSpeed: 20,
            show: true,
            trailLength: 0.1,
            symbolSize: 4
          },
        }

        lines.map(item => {
          let {geometry = {}} = item;
          let {paths} = geometry;
          if (paths && paths.length) {
            paths.map(path => {
              let coords = [];
              path.map(v => {
                let point = MapTool.wgs84togcj02(v[0], v[1]);
                coords.push(point);
              })

              lineItem.data.push({name: item.code, coords})
              lineItem2.data.push({name: item.code, coords})
            })
          }
        })
        configList.push(lineItem)
        configList.push(lineItem2)
      }

      options.series = [...series, ...configList];
      this.myChart.setOption(options, false);
    },
    setMapArea() {
      request({url: '/pipenetwork/treatmentplantcoverarea/nlist'}).then(data => {
        if (data.code === 200 && data.data) {
          let features = [];
          let levelList = [];
          data.data.map((item, index) => {
            let {geometry, name} = item;
            if (geometry && geometry.rings && geometry.rings.length) {
              let pointList = [];
              geometry.rings[0].map(points => {
                pointList.push(MapTool.wgs84togcj02(points[0], points[1]))
              })

              features.push({
                "type": "Feature",
                "geometry": {
                  "type": "MultiPolygon",
                  "coordinates": [[pointList]]
                },
                "id": PublicService.RandomId(),
                "properties": {
                  "name": name
                },
              })

              levelList.push({
                name,
                value: name === "西塘污水厂" ? 4 : (index % 3) + 1
              })
            }
          })

          echarts.registerMap(this.areaName, {...mapJson[this.areaName], features: [...mapJson[this.areaName].features, ...features]});

          let options = this.myChart.getOption();
          options.series = [
            {
              name: 'map',
              type: "map", // map3D / map
              map: this.areaName,
              roam: false,
              aspectScale: 0.9,
              zoom: 0.75,
              itemStyle: {
                normal: {
                  borderColor: '#2ab8ff',
                  borderWidth: 2,
                  areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                    },{
                      offset: 1,
                      color: 'rgba(5, 33, 81, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: 'rgba(0, 255, 255, 0.7)',
                  shadowBlur: 6,
                  shadowOffsetX: 0,
                  shadowOffsetY: 1,
                  label: {
                    show: true,
                  }
                },
                emphasis: {
                  areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(5, 33, 81, 1)' // 0% 处的颜色
                    },{
                      offset: 1,
                      color: 'rgba(5, 33, 81, 0.6)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  borderColor: '#2ab8ff',
                  borderWidth: 2,
                  shadowColor: 'rgba(0, 255, 255, 0.7)',
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 1,
                  label: {
                    show: true,
                  },
                },
              },
              label: {
                normal: {
                  textStyle: {
                    color: '#585858',
                    fontSize: 16
                  },
                },
                emphasis: {
                  textStyle: {
                    color: '#fff',
                  },
                },
              },
              data: levelList,
            }
          ]

          this.myChart.setOption(options, false);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
}

.chart-city {
  width: 100%;
  height: 100%;
}

.chart-back {
  position: absolute;
  right: 510px;
  top: 140px;
  font-size: 15px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 0 10px rgba(24, 144, 255, 1) inset;
  background: rgba(0, 0, 0, 0.7);
  color: #FFF;
  padding: 4px 10px;
  border-radius: 4px;
}
.bottom {
  position: absolute;
  z-index: 2;
  bottom: 10px;
  width: calc(100vw - 940px);
  height: 227px;
  left: 50%;
  transform: translateX(-50%);

  background: url("../../../../assets/images/cockpit/globalOverview/bottom.png") no-repeat 0 0;
  background-size: 100% 100%;
}
</style>
