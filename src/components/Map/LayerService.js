import config from "./config";
import request from '@/utils/request';
import * as communityAPI from "@/api/basicinfo/community";
import yj_light from "@/assets/svg/yj-light.svg";

const S_T_Y = -28; // 文本偏移
const S_V_Y = -48; // 数值偏移
const T_S = 10; // 文本大小

// 获取文字长度
function chkStrLen(str) {
  let strLen = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
      strLen += 2;
    else
      strLen++;
  }
  return strLen;
}

export default class LayerService {
  static renderPiPeLine(map, callback) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;

    let layerConfig = {
      layerId: 22,
      featureConfig: {
        id: "PiPeLine",
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1)
      },
      labelField: "NAME"
    }
    this.renderLayer(map, {...layerConfig, featureConfig: {id: "PiPeLine2"}})
    this.renderLayer(map, {...layerConfig, simpleJson: {
        "type": "simple",
        "symbol": new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 3)
      }}, layer => {
      layer.on("graphic-node-add", ({graphic}) => {
        let node  = graphic.getNode();
        if (node) {
          node.style.strokeDasharray = node.getTotalLength();
          graphic.attr("class", "flow");
        }
      });
    })
  }

  // 高危热力图
  static renderHighRiskHeat(map, callback) {
    let layerConfig = {
      layerId: 10,
      featureConfig: {
        id: "HighRiskHeat",
      }
    }
    this.renderLayer(map, layerConfig, layer => {
      let heatmapRenderer = new esri.renderer.HeatmapRenderer({
        blurRadius: 15,
        colorStops: [
          {ratio: 0, color: "rgba(0, 255, 150, 0)"},
          {ratio: 0.6, color: "rgb(250, 250, 0)"},
          {ratio: 0.85, color: "rgb(250, 150, 0)"},
          {ratio: 0.95, color: "rgb(246,80,39)"}
        ],
      });
      layer.setRenderer(heatmapRenderer);

      callback && callback(layer)
    })
  }

  // 污水厂覆盖范围
  static renderPlantArea(map, callback, featureConfig) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    let color = "#f66619"
    let layerConfig = {
      layerId: 21,
      featureConfig: {
        id: "PlantArea",
        ...featureConfig
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 1), new Color([...new Color(color).toRgb(), 0.35]))
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  // 医院
  static renderHospital(map, callback, featureConfig) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    let layerConfig = {
      layerId: 12,
      featureConfig: {
        id: "Hospital",
        ...featureConfig
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.35]))
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  // 企业
  static renderCompany(map, callback, featureConfig) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    let layerConfig = {
      layerId: 13,
      featureConfig: {
        id: "Company",
        ...featureConfig
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.35]))
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  // 娱乐
  static renderRecreation(map, callback, featureConfig) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    let layerConfig = {
      layerId: 15,
      featureConfig: {
        id: "Recreation",
        ...featureConfig
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.35]))
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  // 溯源
  static renderWarnRoot({map, params, graphic, requestCallback}) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    // 高亮点位
    let newGraphic, newText, isSearch = {};
    if (graphic) {
      let {geometry, attributes} = graphic;
      let {renderer = {}} = graphic.getLayer();
      let {symbol} = renderer;
      newGraphic = new esri.Graphic(geometry, symbol, attributes);
      newGraphic.attr('class', 'jump');

      let textSymbol = new esri.symbol.TextSymbol(attributes.NAME).setColor(new esri.Color("#FFF")).setOffset(0, -45)
      newText = new esri.Graphic(geometry, textSymbol, attributes);
    }

    // 创建相关图层
    let layer = map.getLayer("WarnRoot");
    let textLayer = map.getLayer("WarnRoot_TEXT");
    if (layer) {
      map.removeLayer(layer)
      map.removeLayer(textLayer)
    }
    layer = new esri.layers.GraphicsLayer({id: "WarnRoot"});
    textLayer = new esri.layers.GraphicsLayer({id: "WarnRoot_TEXT"});
    map.addLayers([textLayer, layer]);

    newGraphic && layer.add(newGraphic);
    newText && layer.add(newText);

    if (params) {
      let pointList = []; // 点位集合

      // 查询溯源信息
      let requestData = (type, val) => {
        // 判断是否查询过
        if (isSearch[val.code]) {
          return
        }

        isSearch[val.code] = true;
        request({url: `/pipenetwork/trace/${type}`, method: 'post', data: {...val}}).then(res => {
          this.loading = false;
          if (res.code === 200 && res.data) {
            let downstream, upstream
            if(type === 'trace'){
              downstream = res.data.downstream;
              upstream = res.data.upstream;
            } else if(type === 'downstream') {
              downstream = res.data;
              upstream = null;
            } else if(type === 'upstream') {
              downstream = null;
              upstream = res.data;
            }


            let dataVal = {downstream, upstream};
            for (let i in dataVal) {
              let {specialResults, references, points} = dataVal[i] || {};
              // 处理窨井相关联的小区等
              if (points && points.length) {
                for (let k = 0; k < points.length; k++) {
                  let {code} = points[k];
                  if (references && references[code] && references[code].length) {
                    let bindList = [], names = [];
                    references[code].map(v => {
                      if (specialResults && specialResults[v.type]) {
                        specialResults[v.type].map(special => {
                          if (special.name && special.code === v.code) {
                            names.push(special.name);
                            bindList.push(special)
                          }
                        })
                      }
                    })

                    points[k].bindName = names.join("，")
                    points[k].bindList = bindList;
                  }
                }
              }

              // 处理小区绑定窨井
              if (specialResults) {
                for (let j in specialResults) {
                  let itemList = specialResults[j];
                  if (itemList && itemList.length) {
                    itemList.map(item => {
                      let codes = [];
                      for (let k in references) {
                        let list = references[k];
                        list.map(v => {
                          if (v.type === item.commonType && v.code === item.code) {
                            codes.push(k)
                          }
                        })
                      }
                      item.bindYJ = codes
                    })
                  }
                }
              }
            }

            requestCallback && requestCallback(dataVal)

            // 下游
            if (downstream) {
              let {lines, points, specialResults} = downstream;
              if (lines && lines.length) {
                let _points = this.handleLineData(layer, lines, 'down')
                pointList = [...pointList, ..._points]
              }

              if (points && points.length) {
                let _points = this.handlePointData(layer, points, 'down', val);
                pointList = [...pointList, ..._points]
              }

              if (specialResults) {
                this.handlePolygon(layer, textLayer, specialResults, 'down')
              }
            }

            // 上游
            if (upstream) {
              let {lines, points, specialResults} = upstream;
              if (lines && lines.length) {
                let _points = this.handleLineData(layer, lines, 'up')
                pointList = [...pointList, ..._points]
              }

              if (points && points.length) {
                let _points = this.handlePointData(layer, points, 'up', val);
                pointList = [...pointList, ..._points]
              }

              if (specialResults) {
                this.handlePolygon(layer, textLayer, specialResults, 'up')
              }
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
        })
      }
      requestData('trace', params);

      layer.on('click', evt => {
        let {attributes} = evt.graphic;
        if (attributes.downOrUp === 'down') {
          evt.graphic.attr('class', 'jump')
          requestData('downstream', {...params, code: attributes.code})
        } else if (attributes.downOrUp === 'up') {
          evt.graphic.attr('class', 'jump')
          requestData('upstream', {...params, code: attributes.code})
        }
      })


      // 鼠标移入小区相关窨井高亮功能
      let lightList = [];

      // 清除高亮
      const clearLight = () => {
        if (lightList && lightList.length) {
          lightList.map(graphic => {
            let {geometry, attributes} = graphic;
            if (geometry && attributes) {
              let {color, url} = attributes
              if (url) {
                graphic.setSymbol(new esri.symbol.PictureMarkerSymbol(url, 20, 20))
              }

              if (color) {
                graphic.setSymbol(SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 1), new Color([...new Color(color).toRgb(), 0.35])))
              }
            }
          });
          lightList = [];
        }
      }

      let points = ['POINT', 'CROSS_POINT', 'JOIN_POINT', 'RESIDENTIAL_OUTLET', 'ENTERPRISE_OUTLET', 'HOSPITAL_OUTLET', 'PLAYGROUND_OUTLET'];
      layer.on("mouse-over", evt => {
        clearLight();
        let lightColor = "#ffdd00";
        let {commonType, pointType, code, bindList, bindYJ} = evt.graphic.attributes;
        if (bindList && bindList.length) {
          // 针对点位
          if (points.includes(pointType)) {
            evt.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol(yj_light, 20, 20));
            lightList.push(evt.graphic);

            bindList.map(bindItem => {
              layer.graphics.map(item => {
                let {attributes = {}} = item;
                let {commonType, objectId} = attributes;
                if (commonType === bindItem.commonType && objectId === bindItem.objectId) {
                  item.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lightColor), 1), new Color([...new Color(lightColor).toRgb(), 0.35])))
                  lightList.push(item)
                }
              })
            })
          }
        }

        // 针对小区、娱乐场所、医院、重要企业
        if (["RESIDENTIAL", "PLAYGROUND", "HOSPITAL", "ENTERPRISE"].includes(commonType) && code) {
          evt.graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lightColor), 1), new Color([...new Color(lightColor).toRgb(), 0.35])));
          lightList.push(evt.graphic)

          if (bindYJ && bindYJ.length) {
            layer.graphics.map(item => {
              let {attributes = {}} = item;
              let {pointType, code} = attributes;
              if (points.includes(pointType)) {
                let highlightIndex = bindYJ.findIndex(v => v === code);
                if (highlightIndex !== -1) {
                  item.setSymbol(new esri.symbol.PictureMarkerSymbol(yj_light, 20, 20))
                  lightList.push(item)
                }
              }
            })
          }
        }
      });

      layer.on("mouse-out", clearLight);
    }
  }

  static handlePolygon(layer, textLayer, data, type) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

    let color = {
      'down': { // 下游
        "RESIDENTIAL": "#fd5f76", // 小区
        "PLAYGROUND": "#eddd9e", // 娱乐场所
        "HOSPITAL": "#ffff4d", // 医疗机构
        "ENTERPRISE": "#02b340", // 重点企业
      },
      'up':{ // 上游
        "RESIDENTIAL": "#ef5b96", // 小区
        "PLAYGROUND": "#79d2d2", // 娱乐场所
        "HOSPITAL": "#2e62cd", // 医疗机构
        "ENTERPRISE": "#ff99ff", // 重点企业
      }
    }

    for (let i in data) {
      let colorVal = color[type][i];
      let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(colorVal), 1), new Color([...new Color(colorVal).toRgb(), 0.35]));

      data[i].map(item => {
        let {geometry, name} = item;
        if (geometry) {
          item.color = colorVal;
          let {rings} = geometry;
          if (rings && rings.length) {

            let polygon = new esri.geometry.Polygon({rings, spatialReference: {wkid: 4326}});
            layer.add(new esri.Graphic(polygon, symbol, item));

            // 设置名称
            if (name) {
              let point = polygon.getCentroid();
              let symbol = new esri.symbol.TextSymbol(name).setColor(new esri.Color("#FFF"))
              textLayer.add(new esri.Graphic(point, symbol, item))
            }
          }
        }
      })
    }
  }


  static handlePointData(layer, data, type, val) {
    let yjIcon = {
      'down': require('@/assets/svg/yj.svg'),
      'up': require('@/assets/svg/yj-select.svg')
    }[type]
    let P = {
      'POINT': {
        typeName: "点",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
      'CROSS_POINT': {
        typeName: "分叉点",
        icon: {
          url: yjIcon,
          width: 5,
          height: 5
        }
      },
      'JOIN_POINT': {
        typeName: "连接点",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
      'SEWAGE_TREATMENT_PLANT': {
        typeName: "污水厂",
        icon: {
          url: require('../../assets/images/cockpit/networkResource/wsc.png'),
          width: 46.5,
          height: 53.4
        }
      },
      'PUMPING_STATION': {
        typeName: "泵站",
        icon: {
          url: require('../../assets/images/cockpit/networkResource/bz.png'),
          width: 60,
          height: 65
        }
      },
      'RESIDENTIAL_OUTLET': {
        typeName: "小区排水口",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
      'ENTERPRISE_OUTLET': {
        typeName: "企业排水口",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
      'HOSPITAL_OUTLET': {
        typeName: "医院排水口",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
      'PLAYGROUND_OUTLET': {
        typeName: "娱乐场所排水口",
        icon: {
          url: yjIcon,
          width: 20,
          height: 20
        }
      },
    }

    let pointList = [];

    data.map(item => {
      let {geometry, pointType, name, code} = item;
      if (pointType && P[pointType] && geometry && code !== (val && val.code)) {
        let {x, y} = geometry;
        let {icon} = P[pointType];
        if (x && y) {
          pointList.push([x, y])
          let point = new esri.geometry.Point({x: Number(x), y: Number(y), spatialReference: {wkid: 4326}});
          let market = null;
          if (icon) {
            let {url, path, color, width = 20, height = 20} = icon;
            if (url) {
              item.url = url;
              market = new esri.symbol.PictureMarkerSymbol(url, width, height);
            }
            if (path) {
              market = this.createSymbol(path, color)
            }
          }

          let graphic = new esri.Graphic(point, market, item);
          layer.add(graphic)

          if (name && (["PUMPING_STATION", 'SEWAGE_TREATMENT_PLANT'].includes(pointType))) {
            item.downOrUp = type
            let symbol = new esri.symbol.TextSymbol(name).setColor(new esri.Color("#FFF")).setOffset(0, -25)
            let graphic = new esri.Graphic(point, symbol, item);
            layer.add(graphic)
          }
        }
      }
    })

    return pointList
  }

  static handleLineData(layer, data, type) {
    let color = {
      'down': "#4348ea",
      'up': "#ec9433"
    }
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;

    let pointList = [];
    data.map(item => {
      let {geometry} = item;
      if (geometry) {
        let {paths} = geometry;
        if (paths && paths.length) {
          paths.map(path => {
            pointList = [...pointList, ...path]
          })

          let geometry = new esri.geometry.Polyline(paths);
          let symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new esri.Color(color[type]), 3);

          let graphic = new esri.Graphic(geometry, symbol, item);
          layer.add(graphic)
        }
      }
    })

    return pointList;
  }



  // 区域
  static renderArea(map, callback) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;
    let layerConfig = {
      layerId: 6,
      featureConfig: {
        id: "AREA2",
        definitionExpression: "行政区划_1='嘉兴市'",
      },
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.05])),
      }
    }


    this.renderLayer(map, layerConfig, callback)
  }

  // 管线
  static renderPipeLine(map, callback) {
    let layer = new esri.layers.ArcGISDynamicMapServiceLayer(config.arcGisMapServer, {
      id: 'PipeLine',
      definitionExpression: "WATERLEVEL='1级管网'",
    });
    layer.setVisibleLayers([1]);
    let layerDefinitions = [];
    layerDefinitions[1] = "WATERLEVEL='1级管网'";
    layer.setLayerDefinitions(layerDefinitions);
    map.addLayer(layer);
    dojo.connect(map, "onZoomEnd", () => {
      let zoom = map.getZoom();
      layer.setVisibleLayers([1]);
      let layerDefinitions = [];
      layerDefinitions[1] = "WATERLEVEL='1级管网'";
      if (zoom >= 12) {
        layerDefinitions[1] = null;
      }
      layer.setLayerDefinitions(layerDefinitions);
    });

    callback && callback(layer)
  }

  // 窨井盖
  static renderCover(map, callback) {
    let layerConfig = {
      layerId: 0,
      featureConfig: {
        id: "Cover",
        definitionExpression: "WATERLEVEL='1级管网'",
        // mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      },
      simpleJson: {
        "type": "simple",
        "symbol": new esri.symbol.PictureMarkerSymbol(require(`../../assets/images/cockpit/networkResource/yj.png`), 20, 20)
      }
    }

    // 渲染图层
    this.renderLayer(map, layerConfig, layer => {
      callback && callback(layer);

      dojo.connect(map, "onZoomEnd", () => {
        let zoom = map.getZoom();
        let definitionExpression = "WATERLEVEL='1级管网'";
        if (zoom >= 12) {
          definitionExpression = "WATERLEVEL='1级管网' or WATERLEVEL='2级管网'";
        }
        layer.setDefinitionExpression(definitionExpression);
      });
    })
  }

  //  泵站
  static renderPump(map, callback) {
    let layerConfig = {
      layerId: 2,
      featureConfig: {
        id: "Pump",
      },
      simpleJson: {
        "type": "simple",
        "symbol": new esri.symbol.PictureMarkerSymbol(require(`@/assets/images/cockpit/networkResource/bz.png`), 60, 65)
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  //  污水厂
  static renderPlant(map, callback) {
    let layerConfig = {
      layerId: 3,
      featureConfig: {
        id: "Plant",
      },
      simpleJson: {
        "type": "simple",
        "symbol": new esri.symbol.PictureMarkerSymbol(require(`@/assets/images/cockpit/networkResource/wsc.png`), 64.5, 73.4)
      },
      labelField: "NAME"
    }
    this.renderLayer(map, layerConfig, callback)
  }

  //  小区
  static renderCommunity(map, callback, featureConfig) {
    let Color = esri.Color;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;
    let layerConfig = {
      layerId: 4,
      featureConfig: {
        id: "Community",
        ...featureConfig
      },
      hoverName: "NAME",
      simpleJson: {
        "type": "simple",
        "symbol": new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.35]))
      }
    }
    this.renderLayer(map, layerConfig, layer => {
      callback && callback(layer)

      layer.on("mouse-over", evt => {
        evt.graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#2491fc"), 1), new Color([34, 145, 252, 0.65])));
      });

      layer.on("mouse-out", (evt) => {
        evt.graphic.setSymbol();
      });
    })
  }

  static renderCommunityYJ(map, data) {
    let layer = map.getLayer("CommunityYJ");
    if (data && !layer) {
      layer = new esri.layers.GraphicsLayer({id: "CommunityYJ"});
      map.addLayer(layer);
    }
    layer && layer.clear(); // 清除图层

    if (data && data.graphic) {
      let {attributes = {}} = data.graphic;
      let {OBJECTID} = attributes;
      if (OBJECTID) {
        communityAPI.getData(OBJECTID).then(data => {
          if (data) {
            let {outlets} = data;
            if (outlets && outlets.length) {
              outlets.map(item => {
                let {geometry = {}} = item;
                let {x, y} = geometry;
                if (x && y) {
                  let point = new esri.geometry.Point({x: Number(x), y: Number(y), spatialReference: {wkid: 4326}});
                  const market = new esri.symbol.PictureMarkerSymbol(require(`../../assets/images/cockpit/networkResource/yj.png`), 20, 20);
                  let graphic = new esri.Graphic(point, market);
                  layer.graphics.add(graphic);
                }
              })
            }
          }
        });
      }
    }
  }

  // 渲染图层
  static renderLayer(map, layerConfig, callback) {
    let {layerId, featureConfig, simpleJson, labelField, hoverName} = layerConfig;
    const layer = new esri.layers.FeatureLayer(`${config.arcGisFeatureServer}/${layerId}`, {
      mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
      outFields: ['*'],
      showLabels: true,
      ...featureConfig,
    });

    if (simpleJson) {
      let renderer = new esri.renderer.SimpleRenderer(simpleJson);
      layer.setRenderer(renderer);
    }

    if (hoverName) {
      layer.on("mouse-over", evt => {
        this.hover(map, evt, hoverName)
      });

      layer.on("mouse-out", () => {
        map.infoWindow.hide();
      });
    }

    if (labelField) {
      let textLayer = map.getLayer("textLayer_"+featureConfig.id);
      if (!textLayer) {
        textLayer = new esri.layers.GraphicsLayer({id: "textLayer_"+featureConfig.id});
        map.addLayer(textLayer);
      }
      textLayer && textLayer.clear(); // 清除图层
      layer.on("update-end", (e) => {
        for (let i = 0; i < layer.graphics.length; i++) {
          let {attributes, geometry} = layer.graphics[i];
          if (attributes && geometry) {
            let text = attributes[labelField];
            if (text) {
              if (geometry.type === "point") {
                this.renderTextBg({layer: textLayer, text: text, geometry, H: 28});
                this.renderText({
                  layer: textLayer,
                  text: text,
                  geometry,
                  attributes,
                  offset_y: -34
                }); // 文本
              }
            }
          }
        }
      });
    }


    map.addLayer(layer);

    callback && callback(layer);
  }

  // 标注
  static renderText({layer, text, color, font, geometry, attributes, offset_y, offset_x, horizontal, vertical}) {
    let Color = esri.Color;
    let Graphic = esri.Graphic;
    let Point = esri.geometry.Point;
    let Font = esri.symbol.Font;
    let TextSymbol = esri.symbol.TextSymbol;
    let textSym = new TextSymbol({
      text: text || "--",
      color: new Color(color || "#c1c1c1"),
      horizontalAlignment: horizontal || "center",
      verticalAlignment: vertical || "baseline",
      font: new Font(font || T_S, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD),
      // font: new Font(font || T_S),
      yoffset: offset_y || S_T_Y
    });

    if (offset_x) {
      textSym.xoffset = offset_x
    }
    let graphicText = new Graphic(geometry, textSym, attributes);
    if (geometry && geometry.type === "polyline" && geometry.paths) {
      let path = geometry.paths[0];
      let point = new Point({x: path[0], y: path[1], spatialReference: {wkid: 4326}});
      graphicText = new Graphic(point, textSym, attributes);
    }

    layer.add(graphicText);
  };

  // 标注背景
  static renderTextBg({layer, text = "", geometry, R, S, H, W, offset_y, bg, lineColor, offset_x, attributes, P}) {
    let Color = esri.Color;
    let Graphic = esri.Graphic;
    let Point = esri.geometry.Point;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleMarkerSymbol = esri.symbol.SimpleMarkerSymbol;

    let _fontsize = S || T_S;

    let _radius = R || 6;

    let _infoTem = text + "";

    let bgLineSymbol = new SimpleLineSymbol("solid", new Color(lineColor || "#00BBFA"), 1);
    let width = (chkStrLen(_infoTem)) * 0.5 * (_fontsize + 3) + 30; // 宽度

    if (W) {
      width = W
    }

    if (P) {
      width += P;
    }

    let height = H || _fontsize * 1.8;

    // 背景框圆角半径
    let radius = _radius;

    // 设置背景框的大小
    let path = "M0" + " " + radius + "L0" + " " + (height - radius) + "Q0" + " " + height + " " + radius + " " + height + "L" + (width - radius) + " " + height + "Q" + width + " " + height + " " + width + " " + (height - radius) + "L" + width + " " + radius + "Q" + width + " " + "0" + " " + (width - radius) + " " + "0L" + radius + " " + "0Q0" + " " + "0" + " " + "0" + " " + radius;

    let bgSymbol = new SimpleMarkerSymbol();
    bgSymbol.setPath(path);
    bgSymbol.setColor(new Color(bg || "rgba(18, 42, 60, 0.8)"));

    bgSymbol.setOutline(bgLineSymbol);

    let size = Math.max(height, width);
    bgSymbol.setSize(size);

    let bgGraphic = new Graphic(geometry, bgSymbol, attributes);
    if (geometry && geometry.type === "polyline" && geometry.paths) {
      let path = geometry.paths[0];
      let point = new Point({x: path[0], y: path[1], spatialReference: {wkid: 4326}});
      bgGraphic = new Graphic(point, bgSymbol);
    }

    bgSymbol.yoffset = offset_y || S_V_Y + 6;

    if (offset_x) {
      bgSymbol.xoffset = offset_x
    }

    layer.add(bgGraphic);
  };

  // 高亮
  static renderHighlight(map, data) {
    let layer = map.getLayer("Highlight");
    if (data && !layer) {
      layer = new esri.layers.GraphicsLayer({id: "Highlight"});
      map.addLayer(layer, 2);
    }
    layer && layer.clear(); // 清除图层

    if (data && data.graphic) {
      let {geometry = {}} = data.graphic;
      let {declaredClass} = geometry;

      if (declaredClass) {
        let type = declaredClass.split(".").pop();
        if (type === "Point") {
          const market = new esri.symbol.PictureMarkerSymbol({
            "url": require('../../assets/images/pointGL.png'),
            "width": 60,
            "height": 130,
            "yoffset": 40,
          });

          let graphic = new esri.Graphic(geometry, market);
          layer.add(graphic);
        } else if (type === "Polygon") {
          let Color = esri.Color;
          let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
          let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;

          const color = new Color([255, 255, 255, 0.75]);
          const lineStyle = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 1);

          let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineStyle, color);
          let graphic = new esri.Graphic(geometry, symbol);
          layer.add(graphic);
        }
      }
    }
  }

  /**
   * 创建svg路径符号
   * @param path
   * @param color
   * @returns {*}
   */
  static createSymbol(path, color) {
    let markerSymbol = new esri.symbol.SimpleMarkerSymbol();
    markerSymbol.setPath(path);
    markerSymbol.setColor(new dojo.Color(color));
    markerSymbol.setOutline(null);
    return markerSymbol;
  }

  // 鼠标悬浮
  static hover(map, evt, field) {
    if (evt.attributes || evt.graphic.attributes) {
      let val = evt.attributes || evt.graphic.attributes;
      //设置弹窗的内容
      let label = val[field] || "-";
      if (label) {
        map.infoWindow.setContent(
          `<div class="hoverinfoContene">
            <i class="iconfont el-icon-d-arrow-right"/>
            <span class="hoverconteneName">${label}</span>
          </div>`
        );
        map.infoWindow.show(evt.mapPoint, map.getInfoWindowAnchor(evt.screenPoint));
      }
    }
  }
};
