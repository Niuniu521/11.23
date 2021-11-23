<template>
  <DropModal :title="title" @onClose="onClose">
    <div slot="content">
      <Community ref="Community" v-if="modalType === 'Community'" :modalVal="modalVal"/>
      <Plant ref="Plant" v-else-if="modalType === 'Plant'" :modalVal="modalVal"/>
      <Pump ref="Pump" v-else-if="modalType === 'Pump'" :modalVal="modalVal"/>
      <Warn  @onClose="onClose" ref="Warn" v-else-if="modalType === 'Warn'" :modalVal="modalVal"/>
      <CloseAlert   ref="CloseAlert" v-else-if="modalType === 'CloseAlert'" :modalVal="modalVal"/>
      <CommunityDetail ref="CommunityDetail" v-else-if="modalType === 'CommunityDetail'" :modalVal="modalVal"/>
      <slot name="btn"></slot>
    </div>
  </DropModal>
</template>

<script>
import DropModal from "../dropModal";
import Community from "./community";
import Plant from "./plant";
import Pump from "./pump";
import Warn from "./warn";
import CloseAlert from "./CloseAlert";
import CommunityDetail from "./communityDetail";
export default {
  name: "DetailModal",
  props: {
    title: String,
    modalType: String,
    modalVal: Object,
    titleStyle: Object,
  },
  components: {
    DropModal, Community, Plant, Pump, Warn,CommunityDetail,CloseAlert
  },
  methods:{
    onClose() {
      this.$emit('onClose')
    },
    move(e){
      let oDiv = document.getElementById("MODAL");        //获取目标元素

      //算出鼠标相对元素的位置
      let disX = e.clientX - oDiv.offsetLeft;
      let disY = e.clientY - oDiv.offsetTop;
      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;


        // 加入边界检测
        let Width = document.body.clientWidth;
        let Height = document.body.clientHeight;
        let modalWidth = oDiv.offsetWidth;
        let modalHeight = oDiv.offsetHeight;

        if (top < 0) {
          top = 0;
        } else if ((top + modalHeight) > Height) {
          top = Height - modalHeight;
        } else if (left < 0) {
          left = 0;
        } else if ((left + modalWidth) > Width) {
          left = Width - modalWidth;
        }

        // 阻止模态框从四个角被拖出
        if (top <= 0 && left <= 0) {
          left = 0;
          left = 0;
        } else if (left <= 0 && (top + modalHeight) >= Height) {
          left = 0;
          top = Height - modalHeight;
        } else if (top <= 0 && (left + modalWidth) >= Width) {
          top = 0;
          left = Width - modalWidth;
        } else if ((top + modalHeight) >= Height && (left + modalWidth) >= Width) {
          top = Height - modalHeight;
          left = Width - modalWidth;
        }

        //移动当前元素
        oDiv.style.left = left + 'px';
        oDiv.style.top = top + 'px';
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  },
}
</script>

<style lang="scss" scoped>
.detailModal {
  position: absolute;
  // width:535px;
  // //height: 630px;
  top: 120px;
  left: 500px;
  z-index: 1000;
  background: url("../../../../assets/images/cockpit/detailModalBg.png") no-repeat 0 0;
  background-size: 100% 100%;
  padding: 20px;

  .title {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #FFFFFF;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    background: rgba(3, 17, 72, 0.65);
    width: calc(100% - 20px);
    height: calc(100% - 40px);
    top: 20px;
    left: 10px;
  }

  .close {
    position: absolute;
    top: 40px;
    right: 30px;
    z-index: 99;
    width: 32px;
    height: 32px;
    background: url("../../../../assets/images/cockpit/detailModalClose.png") no-repeat 0 0;
    background-size: 100% 100%;
    cursor: pointer;
  }
}
</style>

