<template>
  <div class="cockpit-container">
    <div class="header">
      <div class="header-bg"/>
      <div class="header-content">
        <div class="header-left">
          <div v-for="item in menuList" :key="item.title" @click="onJump(item.path)" class="menuItem" :class="{'activePath': activePath === item.path}">
            {{ item.title }}
          </div>
        </div>
        <router-link class="enter" :to="{path:'/basicinfo/pumpstation'}">
          <img class="enterImg" src="@/assets/images/cockpit/enter.png" alt="">
          <div class="enterText">进入后台</div>
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePath: "/globalOverview",
      menuList: [
        {title: "毒情感知", path: "/globalOverview"},
        {title: "数字管网", path: "/digitalNetwork"},
        {title: "溯源处置", path: "/traceabilityDisposal"},
        {title: "检测管控", path: "/detectionControls"},
        {title: "高危热力", path: "/highRiskHeat"},
      ]
    }
  },
  mounted() {
    let path = this.$route.path;
    this.activePath = path
  },
  methods: {
    onJump(path) {
      this.activePath = path;
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.cockpit-container {
  width: 100%;
  height: 100vh;
  background: #021a2c;
  position: relative;
  overflow: hidden;
  color: #FFF;

  ::v-deep .LINE {
    width: 100%;
    margin: 8px auto;
    height: 1px;
    border-top: 1px #00EAFF dashed;
  }

  .header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 64px;
    z-index: 4;
    text-align: center;

    .header-bg {
      position: absolute;
      top: 0;
      width: 100%;
      height: 274px;
      background: url("../../assets/images/cockpit/header.png") no-repeat 0 0;
      background-size: 100% 100%;
      pointer-events: none;
    }

    .header-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 70px;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;

      .header-left {
        display: flex;
        align-items: center;

        .menuItem {
          margin-right: 10px;
          background: url("../../assets/images/cockpit/menuBg.png") no-repeat 0 0;
          background-size: 100% 100%;
          padding: 8px 14px;
          color: #FFFFFF;
          font-size: 14px;
          cursor: pointer;
          opacity: 0.65;
        }

        .activePath {
          opacity: 1;
        }
      }

      .enter {
        display: flex;
        align-items: center;
        cursor: pointer;

        .enterImg {
          width: 17px;
          height: 18px;
          margin-right: 4px;
          margin-bottom: 2px;
        }

        .enterText {
          color: #77F3FD;
          font-weight: bold;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
