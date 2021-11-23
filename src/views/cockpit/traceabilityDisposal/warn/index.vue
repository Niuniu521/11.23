<template>
  <div class="content">
    <div class="listWrap" :class="{anim: animate}" @mouseenter="mEnter" @mouseleave="mLeave" ref="con1">
      <div class="listItem" v-for="(item, index) in dataList" :key="index" @click="onClick(item)">
        <div class="itemLeft">
          <img class="warnImg" src="@/assets/images/cockpit/networkResource/warn.png" alt="">
          <div>警告</div>
        </div>
        <div class="itemContent">
          <div>预警时间：{{item.alarmTime}}</div>
          <div>预警对象：{{ item.targetName || item.targetCode }}</div>
          <div>代谢物：{{ item.factorNames }} </div>
          <div>毒品种类：{{ item.kinds }} </div>
          <div>采样方式：{{ {'1': "快速检测", '2': "手动检测", '3': "实验室导入"}[item.type] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      animate: false,
      dataList: []
    }
  },
  beforeDestroy() {
    this.timer1 && clearInterval(this.timer1);
  },
  mounted() {
    this.getData();
  },
  methods: {
    onClick(item) {
      // console.log(item);
      this.$emit('onClick', item);
    },
    getData() {
      request({url: '/alarm-record/topList', method: 'get'}).then(res => {
        if (res.code === 200 && res.data && res.data.length) {
          this.dataList = res.data;
          if (res.data.length >= 4) {
            this.timer1 = setInterval(this.scroll, 2000);
          }
        }
      })
    },
    scroll() {
      let con1 = this.$refs.con1;
      con1.style.marginTop = "-110px";
      this.animate = !this.animate;
      setTimeout(() => {
        this.dataList.push(this.dataList[0]);
        this.dataList.shift();
        con1.style.marginTop = "0px";
        this.animate = !this.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
      }, 500);
    },
    mEnter() {
      this.timer1 && clearInterval(this.timer1);
    },
    mLeave() {
      if (this.dataList && this.dataList.length >= 4) {
        this.timer1 = setInterval(this.scroll, 2000);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden !important;
}

.anim {
  transition: all 0.5s;
}

.listWrap {
  padding: 0 10px;

  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
    cursor: pointer;
    background: rgba(227, 0, 0, 0.1);
    margin-bottom: 15px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 2px;
      background: #E30000;
    }


    .itemLeft {
      color: #FF2525;
      font-size: 14px;
      position: relative;
      text-align: center;
      padding: 0 10px;

      .warnImg {
        width: 66px;
        height: 66px;
        padding-bottom: 4px;
        margin: 0 4px;
      }
    }

    .itemContent {
      flex: 1;
      color: #FFFFFF;
      font-size: 14px;
      overflow: hidden;

      .text {
        width: 100%;
        white-space: nowrap; /* 规定文本是否折行 */
        overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
