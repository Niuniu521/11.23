<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="myTab">
    <el-tab-pane label="站点列表" name="first"><SiteList /></el-tab-pane>
    <el-tab-pane label="视频中心" name="second"><VideoCenter /></el-tab-pane>
  </el-tabs>
</template>

<script>

import SiteList from "./siteList";
import VideoCenter from "./videoCenter";
export default {
  components: {
    SiteList,
    VideoCenter
  },

  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
.myTab {
  ::v-deep .el-tabs__nav {
    margin-left: 20px;
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
}

</style>
