/*
* 地图公共服务
* */

import { loadModules } from "esri-loader";
import config from "./config";

export default class MapService {
  static BaseMap = ({WebTiledLayer, tileInfo, defaultMapTheme = "layer", hideMap}) => {
    let layers = [];
    const MAP_THEME = [
      {title: "卫星影像", mapTheme: "img", imgLayer: "img_c", textLayer: "cia_c"},
      {title: "二维影像", mapTheme: "layer", imgLayer: "vec_c", textLayer: "cva_c"},
    ];

    MAP_THEME.map(item => {
      let {mapTheme, imgLayer, textLayer} = item;
      // 加载经纬度底图
      let layerUrl = `http://{subDomain}.tianditu.gov.cn/DataServer?T=${imgLayer}&x={col}&y={row}&l={level}&tk=13b4890427f17c692f9efed46b98db81`;
      let layer1 = WebTiledLayer(layerUrl, {
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tileInfo: tileInfo,
        visible: hideMap ? false : mapTheme === defaultMapTheme,
        id: `${mapTheme}a`
      });

      //加载经纬度中文注记（配合底图使用）
      let layerUrl2 = `http://{subDomain}.tianditu.gov.cn/DataServer?T=${textLayer}&x={col}&y={row}&l={level}&tk=13b4890427f17c692f9efed46b98db81`;
      let layer2 = WebTiledLayer(layerUrl2, {
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tileInfo: tileInfo,
        visible: hideMap ? false : mapTheme === defaultMapTheme,
        id: `${mapTheme}b`
      });

      layers.push(layer1, layer2);
    });
    return layers
  }

  static addressSearch(address, cb) {
    let url = `https://restapi.amap.com/v3/geocode/geo?key=cbfe363443683fff47d4f60c0899e0ca&city=嘉兴&address=${address}`;
    fetch(url).then(resp => resp.json()).then(res => {
      let {geocodes, info, status} = res;
      if (info === "OK" && status === "1") {
        cb(geocodes);
      }
    })
  }

  // 设置地图中心点位及层级
  static setCenterAndZoom(map, zoom = 11) {
    map.centerAndZoom(new esri.geometry.Point({x: 120.92183, y: 30.83365, spatialReference: {wkid: 4326}}), zoom);
  };

  // 设置地图中心点位
  static setCenter(map) {
    map.centerAt(new esri.geometry.Point({x: 120.92183, y: 30.83365, spatialReference: {wkid: 4326}}));
  };

  // 设置地图中心点位及层级
  static mapPanTo(map, lonLat, zoom) {
    let x, y;
    if (Array.isArray(lonLat)) {
      x = lonLat[0];
      y = lonLat[1];
    } else {
      x = lonLat.x;
      y = lonLat.y;
    }

    let point = new esri.geometry.Point({x: Number(x), y: Number(y), spatialReference: {wkid: 4326}});
    if (zoom) {
      map.centerAndZoom(point, zoom);
    } else {
      map.centerAt(point);
    }
  };

  static getPointData(map) {
    let geometry = {};
    if (map && map.graphics && map.graphics.graphics) {
      let graphics = map.graphics.graphics;
      if (graphics && graphics.length) {
        graphics.map(v => {
          let {attributes} = v;
          if (attributes && attributes.drawType === 'point') {
            geometry = v.geometry;
          }
        })
      }
    }

    return geometry
  }

  static addPoint({map, geometry, zoom, layer, callback}) {
    if (map && geometry) {
      let {x, y} = geometry;
      let point = new esri.geometry.Point({x: Number(x), y: Number(y), spatialReference: {wkid: 4326}})
      this.addToMap(map, point, layer);
      this.mapPanTo(map, geometry, zoom);

      callback && callback(point)
    }
  }

  static addPolyline({map, geometry, layer, callback}) {
    if (map && geometry) {
      let {paths} = geometry;
      let polyline = new esri.geometry.Polyline({paths, spatialReference: {wkid: 4326}})
      this.addToMap(map, polyline, layer);

      let returnExtent = polyline.getExtent();
      if (returnExtent) {
        let offset = 0.005;
        returnExtent.xmin = returnExtent.xmin - offset;
        returnExtent.ymin = returnExtent.ymin - offset;
        returnExtent.xmax = returnExtent.xmax + offset;
        returnExtent.ymax = returnExtent.ymax + offset;
        map.setExtent(returnExtent);
      }

      callback && callback(polyline)
    }
  }

  static getPolylineData(map) {
    let geometry = {};
    if (map && map.graphics && map.graphics.graphics) {
      let graphics = map.graphics.graphics;
      if (graphics && graphics.length) {
        graphics.map(v => {
          let {attributes} = v;
          if (attributes && attributes.drawType === 'polyline') {
            geometry = v.geometry;
          }
        })
      }
    }

    return geometry
  }

  static getPolygonData(map) {
    let geometry = {};
    if (map && map.graphics && map.graphics.graphics) {
      let graphics = map.graphics.graphics;
      if (graphics && graphics.length) {
        graphics.map(v => {
          let {attributes} = v;
          if (attributes && attributes.drawType === 'polygon') {
            geometry = v.geometry;
          }
        })
      }
    }

    return geometry
  }

  static getPolygonsData(map) {
    let data = {};
    if (map && map.graphics && map.graphics.graphics) {
      let rings = [];
      let graphics = map.graphics.graphics;
      if (graphics && graphics.length) {
        graphics.map(v => {
          let {attributes, geometry} = v;
          if (geometry && attributes && attributes.drawType === 'polygon') {
            rings.push(geometry.rings[0])
          }
        })
      }
      data.rings = rings;
    }

    return data
  }

  static addPolygon({map, geometry, layer, callback}) {
    if (map && geometry) {
      let {rings} = geometry;
      let polygon = new esri.geometry.Polygon({rings, spatialReference: {wkid: 4326}})
      this.addToMap(map, polygon, layer);

      let returnExtent = polygon.getExtent();
      if (returnExtent) {
        let offset = 0.005;
        returnExtent.xmin = returnExtent.xmin - offset;
        returnExtent.ymin = returnExtent.ymin - offset;
        returnExtent.xmax = returnExtent.xmax + offset;
        returnExtent.ymax = returnExtent.ymax + offset;
        map.setExtent(returnExtent);
      }

      callback && callback(polygon)
    }
  }

  static async getAroundYJPoints(map, data) {
    if (data) {
      let {x, y, rings} = data;
      let geometry;
      let x_offset = 0.002;
      let y_offset = 0.02;
      if (x && y) {
        let returnExtent = {
          xmin: x - x_offset,
          ymin: y - y_offset,
          xmax: x + x_offset,
          ymax: y + y_offset
        }
        geometry = new esri.geometry.Extent(returnExtent);
      }

      if (rings) {
        let polygon = new esri.geometry.Polygon({rings, spatialReference: {wkid: 4326}});
        let returnExtent = polygon.getExtent();
        if (returnExtent) {
          returnExtent.xmin = returnExtent.xmin - x_offset;
          returnExtent.ymin = returnExtent.ymin - y_offset;
          returnExtent.xmax = returnExtent.xmax + x_offset;
          returnExtent.ymax = returnExtent.ymax + y_offset;
        }
        geometry = new esri.geometry.Extent(returnExtent);
      }

      return this.getGisSpatialQuery({map, layerId: 0, geometry}).then(data => {
        let features = [];
        if (data && data.features) {
          features = data.features
        }

        return [
          {type: "line", geometry, features: []},
          {type: "point", geometry, features}
        ]
      })
    }
  }

  /**
   * 空间查询
   * @param map: 地图实例
   * @param FeatureID: 图层id
   * @param geometry: 图形
   * @param callback: 回调
   */
  static getGisSpatialQuery({map, layerId, geometry, where}) {
    return new Promise((resolve, reject) => {
      let {Query, QueryTask} = esri.tasks;
      //实例化查询对象
      const queryTask = new QueryTask(`${config.arcGisFeatureServer}/${layerId}`);

      //定义空间查询参数对象
      const query = new Query();
      query.outFields = ["*"];
      query.geometry = geometry;
      query.outSpatialReference = map.spatialReference;
      query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
      query.returnGeometry = true;

      // 执行查询
      queryTask.execute(query, resolve, reject);
    })

  }

  static addToMap(map, geometry, layer) {
    let symbol;
    let Color = esri.Color;
    let SimpleMarkerSymbol = esri.symbol.SimpleMarkerSymbol;
    let SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
    let SimpleFillSymbol = esri.symbol.SimpleFillSymbol;
    let Graphic = esri.Graphic;
    switch (geometry.type) {
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
    let graphic = new Graphic(geometry, symbol, {drawType: geometry.type});
    if (layer) {
      layer.add(graphic)
    } else {
      map.graphics.add(graphic);
    }
  }
}
