<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="warn-content">
      <div class="flexWrap" style="height:300px">
        <div class="flex1">
          <Title title="基本信息"/>
          <BasicInfo/>
        </div>
        <div class="flex1">
          <Title title="历史预警"/>
          <History/>
        </div>
      </div>
      <div class="lineH"/>
      <div class="lineV"/>
      <div class="flexWrap" style="height:300px">
        <div class="flex1">
          <Title title="检测数据"/>
          <Data/>
        </div>
        <div class="flex1">
          <Title title="绑定视频"/>
          <Video/>
        </div>
      </div>
    </div>
   <div class="foot">
      <img src="@/assets/images/cockpit/menuBg.png">
      <span>采样检测</span>
    </div>
    <div></div>
  </div>

</template>

<script>
import Title from "../../title";
import BasicInfo from "./BasicInfo";
import History from "./History";
import Data from "./Data";
import Video from "./Video";
import request from '@/utils/request';
export default {
  name: "index",
  components: {
    Title, BasicInfo, History, Data, Video,
  },
  props: {
    modalVal: Object
  },
  data() {
    return {
      loading: false,
      listVal: {},
    }
  },
  watch: {
    modalVal: {
      handler(val) {
        if (val && val.id) {
          this.getModalVal(val.id);
        }
      },
      immediate: true,
    }
  },
  methods: {
    getModalVal(id) {
      this.loading = true;
      request({url: '/alarm-record/detail', method: 'get', params: {id}}).then(res => {
        this.loading = false;
        if (res.code === 200 && res.data) {
          this.listVal = res.data || {};
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warn-content {
  width:1048px;
  height:622px;
  overflow-y: auto;
  padding: 0 10px;

  &::-webkit-scrollbar { /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  }

  &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner { /*滚动条里面小方块*/
    background: #1AD0F3;;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: #003659;
  }

  .flexWrap {
    display: flex;
    justify-content: space-between;

    .flex1 {
       flex: 1;
    }
  }
}

.lineH {
  width: 100%;
  height: 1px;
  border-top: 1px #005E9A dashed;
}

.lineV {
  width: 1px;
  height: 85%;
  border-left: 1px #005E9A dashed;
  position: absolute;
  left:545px;
  top:50px;
}
.foot{
  width:1000px;
  text-align: center;
  
}
.foot img{
width: 111px;
height: 46px;
opacity: 0.65;
cursor: pointer;
}
.foot span
{
  position:absolute;
  bottom:35px;
  left:485px;
  font-size:17px;
  cursor: pointer;
}
</style>
