<template>
    <div class="content">
    <div class="block">
      <el-row style="color: #1cedff; font-weight: bold">
        <el-col :span="4"
          ><div class="grid-content bg-purple">区域</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">海洛因</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">冰毒</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">可卡因</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">MDMA</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">氯胺酮</div></el-col
        >
      </el-row>
      
      <el-row v-for="(item, id) in drugList" :key="id" :class="{anim: animate}" @mouseenter="mEnter" @mouseleave="mLeave">
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            {{ item.targetName }}
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">
            {{ item.heroin }}
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <span>{{ item.ice }}</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">
            {{ item.cocaine }}
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">
            <span>{{ item.ecstasy }}</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">
            {{ item.ketamine }}
          </div></el-col
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { drugConcen } from "../../../../api/dataManage/Qrecord";
export default {
   data() {
    return {
       animate: false,
      drugList: [],
    };
  },
   beforeDestroy() {
    this.timer1 && clearInterval(this.timer1);
  },
  mounted() {
    this.getDrug();
  },
  methods: {
    getDrug() {
      drugConcen().then((res) => {
        console.log(res.length);
        this.drugList = res;
          if (res.length >= 3) {
            this.timer1 = setInterval(this.scroll, 2000);
          }
      });
    },
     scroll() {
      this.animate = !this.animate;
      setTimeout(() => {
        this.drugList.push(this.drugList[0]);
        this.drugList.shift();
        this.animate = !this.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
      }, 500);
    },
      mEnter() {
      this.timer1 && clearInterval(this.timer1);
    },
     mLeave() {
      if (this.drugList&& this.drugList.length >= 3) {
        this.timer1 = setInterval(this.scroll, 2000);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.el-row {
    text-align: center;
    color:white;
    line-height:40px;
    font-size: 14px;
}
.content span
{
    color:#FF0101;
}
#green{
    color:#00FF90;
}
</style>
