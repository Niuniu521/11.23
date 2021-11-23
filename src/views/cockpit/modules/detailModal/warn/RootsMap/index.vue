<template>
  <div onmousedown="onDown">
    <Map height="300px" :cockpit="true" @createdMap="createdMap"/>
  </div>
</template>

<script>
import Map from "@/components/Map";
import LayerService from "@/components/Map/LayerService";

export default {
  name: "index",
  components: {
    Map
  },
  props: {
    modalVal: Object
  },
  data() {
    return {
      showRootsVal: {
        downstream: {},
        upstream: {},
        bz: [],
        yj: [],
        yj_gw: []
      },
      rootsGraphic: null,
    }
  },
  methods: {
    onDown(e) {
      e.stopPropagation();
    },
    createdMap(map) {
      this.map = map;
      map.hideZoomSlider(); // 隐藏层级控件


      this.rootsGraphic = null;

      let {targetCode, targetType} = this.modalVal;

      let params = {
        sourceType: targetType,
        code: targetCode
      }

      LayerService.renderWarnRoot({
        map: this.map,
        params: params,
        downOrUp: 'trace',
      })
    },
  }
}
</script>

<style scoped>

</style>
