<template>
  <div class="content">
    <div class="top">
      <img src="@/assets/images/cockpit/globalOverview/icon.png" alt="">
      <span style="xs">刑事打处量：{{this.xsCount}}人</span>
     <img src="@/assets/images/cockpit/globalOverview/icon.png" alt="">
      <span style="za">治安打处量：{{this.zaCount}}人</span>
    </div>
    <div class="listWrap" :class="{anim: animate}" @mouseenter="mEnter" @mouseleave="mLeave">
      <div class="listItem" v-for="(item, index) in dataList" :key="index">
        <div class="itemLeft">
          <img class="picture" src="@/assets/images/cockpit/globalOverview/picture.png" alt="">
        </div>
        <div class="itemContent">
          <div>姓名：{{item.peopleName}}<sapn style="margin-left:36px;">性别：{{item.sex}}</sapn></div>
          <div>籍贯：{{item.nativePlace}}</div>
          <div>身份证号：{{item.idCard}}</div>
          <div>住址：{{item.address}}</div>
        </div>
      </div>
       <!-- <div class="listItem">
        <div class="itemLeft">
          <img class="picture" src="@/assets/images/cockpit/globalOverview/picture.png" alt="">
        </div>
        <div class="itemContent">
          <div>姓名：李艳芳<sapn style="margin-left:36px;">性别：女</sapn></div>
          <div>籍贯：广西省南宁市</div>
          <div>身份证号：33078119******0241</div>
          <div>住址：嘉善县西塘镇南苑路283号</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import {countsData,listData} from './results.js'
export default {
  data() {
    return {
      animate: false,
      dataList: [],
      xsCount:"",
      zaCount:""
    }
  },
  beforeDestroy() {
    this.timer1 && clearInterval(this.timer1);
  },
  mounted() {
    this.results()
  },
  methods: {
    onClick(item) {
      this.$emit('onClick', item);
    },
    results(){   
     countsData().then((response)=>{
       this.xsCount=response.xsCount;
       this.zaCount=response.zaCount;
      })
      listData().then((response)=>{
      this.dataList=response
        if (response.length >= 2) {
            this.timer1 = setInterval(this.scroll, 2000);
          }
      })
    },
     scroll() {
      this.animate = !this.animate;
      setTimeout(() => {
        this. dataList.push(this. dataList[0]);
        this. dataList.shift();
        this.animate = !this.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
      }, 500);
    },
      mEnter() {
      this.timer1 && clearInterval(this.timer1);
    },
     mLeave() {
      if (this.dataList&& this.dataList.length >= 2) {
        this.timer1 = setInterval(this.scroll, 2000);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height:600px;
}
.top{
  display: flex;
}
.top img{
  width:22px;
  height:25px;
}
.top span{
  color:#5EF3FF;
  font-size: 14px;
}
.anim {
  transition: all 0.8s;
}

.listWrap {
  padding: 0 10px;

  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
    cursor: pointer;
    position: relative;

      .picture {
        width: 70px;
        height: 87px;
        padding-bottom: 4px;
        margin: 0 4px;
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
