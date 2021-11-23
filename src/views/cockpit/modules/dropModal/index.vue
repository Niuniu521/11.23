<template>
  <div class="detailModal" :id="wrapId" :style="modalStyle">
    <div class="title" :id="id" @mousedown="move">
      <i class="el-icon-d-arrow-right"/>
      <span :style="titleStyle">{{title}}</span>
    </div>
    <div class="close" @click="onClose"/>

    <slot name="content"></slot>
  </div>
</template>

<script>
import PublicService from "@/services/PublicService";

export default {
  name: "DetailModal",
  props: {
    title: String,
    titleStyle: Object,
    modalStyle: Object,
  },
  data() {
    return {
      id: PublicService.RandomId(),
      wrapId: "wrap_"+ PublicService.RandomId(),
    }
  },
  methods:{
    onClose() {
      this.$emit('onClose')
    },
    move(e){
      let modal = document.getElementById(this.wrapId);
      let header = document.getElementById(this.id);
      let width = document.body.clientWidth / 2;
      let modalWidth = header.offsetWidth / 2;
      // 设置模态框的位置
      if (header) {
        modal.style.position = 'absolute';
        modal.style.left = width - modalWidth + 'px';
        // 模态框头部按下事件
        header.onmousedown = function (ev) {
          /*
          * oEvent.clientX 当前鼠标的位置
          * modal.offsetLeft 当前模态框距离浏览器边界的距离
          * 当前鼠标在模态框上的位置 = 当前鼠标的位置 - 当前模态框距离浏览器边界的距离
          * */
          let oEvent = ev || window.event;
          let disX = oEvent.clientX - modal.offsetLeft;
          let disY = oEvent.clientY - modal.offsetTop;

          // 设置捕获范围  整个浏览器范围内被触发
          if (header.setCapture) {
            header.onmousemove = fnMove;
            header.onmouseup = fnUp;

            header.setCapture();
          } else {
            document.onmousemove = fnMove;
            document.onmouseup = fnUp;
          }

          // 鼠标移动
          function fnMove(ev) {
            /*
            * oEvent.clientX 当前鼠标的位置
            * disX 当前鼠标在模态框上的位置
            * 模态框到浏览器边界的距离 = 当前鼠标的位置 - 当前鼠标在模态框上的位置
            * */
            let oEvent = ev || window.event;
            let l = oEvent.clientX - disX;
            let t = oEvent.clientY - disY;

            // 设置鼠标按下时的样式
            header.style.cursor = 'move';

            // 加入边界检测
            let Width = document.body.clientWidth;
            let Height = document.body.clientHeight;
            let modalWidth = modal.offsetWidth;
            let modalHeight = modal.offsetHeight;
            if (t < 0) {
              t = 0;
            } else if ((t + modalHeight) > Height) {
              t = Height - modalHeight;
            } else if (l < 0) {
              l = 0;
            } else if ((l + modalWidth) > Width) {
              l = Width - modalWidth;
            }

            // 阻止模态框从四个角被拖出
            if (t <= 0 && l <= 0) {
              t = 0;
              l = 0;
            } else if (l <= 0 && (t + modalHeight) >= Height) {
              l = 0;
              t = Height - modalHeight;
            } else if (t <= 0 && (l + modalWidth) >= Width) {
              t = 0;
              l = Width - modalWidth;
            } else if ((t + modalHeight) >= Height && (l + modalWidth) >= Width) {
              t = Height - modalHeight;
              l = Width - modalWidth;
            }

            // 设置模态框的位置
            modal.style.left = l + 'px';
            modal.style.top = t + 'px';
          }

          // 鼠标抬起
          function fnUp() {
            // 设置鼠标抬起恢复默认样式
            header.style.cursor = 'default';

            //清除事件
            this.onmousemove = null;
            this.onmouseup = null;

            //取消捕获范围 用于处理IE下的问题
            if (this.releaseCapture) {
              this.releaseCapture();
            }
          }

          //用于处理FF和Chrome下的问题
          return false;
        };
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.detailModal {
  position: absolute;
  width: 1048px;
  //height: 630px;
  top: 50px;
  left: 300px;
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
