<template>
  <div class="content">
    <div class="top">
      <img
        class="warnBg"
        src="@/assets/images/cockpit/globalOverview/warnBg.png"
      />
      <div class="topbox">
        <div class="topleft">
          <img class="imgleft" src="@/assets/images/cockpit/globalOverview/warn-icon.png" />
          <strong class="fontleft">预警总量</strong>
          <span class="numleft">{{this.alarmTotal}}</span>
        </div>
        <div class="topright">
          <img class="imgleft" src="@/assets/images/cockpit/globalOverview/warn-icon.png" />
          <strong class="fontleft">正在处理</strong>
          <span class="numleft">{{this.doTotal}}</span>
        </div>
        <div class="bottomrleft">
          <img class="imgright" src="@/assets/images/cockpit/globalOverview/warn-icon.png" />
          <strong class="fontright">任务总量&nbsp;&nbsp;&nbsp;</strong>
          <span class="numright">{{this.taskTotal}}</span>
        </div>
        <div class="bottomright">
          <img class="imgright" src="@/assets/images/cockpit/globalOverview/warn-icon.png" />
          <strong class="fontright">完成任务</strong>
          <span class="numright">{{this.overTotal}}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
         <el-row style="color:#1CEDFF;font-weight: bold;">
      <el-col :span="2"><div class="grid-content bg-purple">序号</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">预警地点</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">预警种类</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">预警次数</div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple-light">备注</div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple">操作</div></el-col>
    </el-row>
     <el-row v-for="(item, index) in dataList" :key="index">
      <el-col :span="2"><div class="grid-content bg-purple">{{index+1}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">{{item.targetName}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">{{item.alarmType}}</div></el-col>
      <el-col :span="3"><div id="four" class="grid-content bg-purple-light ">{{item.alarmCount}}</div></el-col>
      <el-col :span="5"><div id="four" class="grid-content bg-purple-light ">{{item.remark}}</div></el-col>
      <el-col :span="3"><button id="close"  @click="onShut(item)">关闭</button></el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="2"><div class="grid-content bg-purple">2</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light name">{{this.targetName}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple type">{{this.alarmType}}</div></el-col>
      <el-col :span="3"><div id="four" class="grid-content bg-purple-light count">{{this.alarmCount}}</div></el-col>
      <el-col :span="5"><div id="four" class="grid-content bg-purple-light remark">{{this.remark}}</div></el-col>
      <el-col :span="3"><button id="close">关闭</button></el-col>
    </el-row>
        <el-row>
      <el-col :span="2"><div class="grid-content bg-purple">3</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light name">{{this.targetName}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple type">{{this.alarmType}}</div></el-col>
      <el-col :span="3"><div  id="four" class="grid-content bg-purple-light count">{{this.alarmCount}}</div></el-col>
      <el-col :span="5"><div id="four" class="grid-content bg-purple-light remark">{{this.remark}}</div></el-col>
      <el-col :span="3"><button id="close">关闭</button></el-col>
    </el-row>
    <el-row>
      <el-col :span="2"><div class="grid-content bg-purple">4</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light name">{{this.targetName}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple type">{{this.alarmType}}</div></el-col>
      <el-col :span="3"><div id="four" class="grid-content bg-purple-light count">{{this.alarmCount}}</div></el-col>
      <el-col :span="5"><div  id="four" class="grid-content bg-purple-light remark">{{this.remark}}</div></el-col>
      <el-col :span="3"><button id="close">关闭</button></el-col>
    </el-row> -->
    </div>
  </div>
</template>

<script>
import { detectionData,statisticalData} from "./detection";
// import CloseAlert from "../modules/detailModal/CloseAlert";
export default{
  components: {
  //  CloseAlert
  },
  data(){
     return{
       dataList:[],
       alarmTotal:"",
       doTotal:"",
       overTotal:"",
       taskTotal:""
     }
  },
  created() {
     this.detection()
  },
  methods: {
     onShut(item){
      this.$emit('onShut', item);
      console.log(item)
    },
    detection(){
      detectionData().then(response=>{
          this.dataList=response
          console.log(this.dataList)
      })
      statisticalData().then(response=>{
        console.log(response)
        this.alarmTotal=response.alarmTotal;
        this.doTotal=response.doTotal;
        this.overTotal=response.overTotal;
        this.taskTotal=response.taskTotal;
      })
    },
  },

}
</script>

<style lang="scss" scoped>
.content{
    width: 100%;
    height: 100%;
}
.warnBg {
  width: 371px;
  height: 101px;
}
.top{
  height:110px;
  width:100%;
}
.topbox img {
  width: 20px;
  height: 20px;
}
.topbox div {
  position: relative;
  width: 185px;
  height:50px;
}
.imgleft{
    position: absolute;
    top: -90px;
    left: 44px;
}
.imgright{
    position: absolute;
    top: -190px;
    left: 210px;
}
.fontleft{
    position: absolute;
    top: -89px;
    left: 59px; 
}
.fontright{
    position: absolute;
    top: -189px;
    left: 225px;
}
.numleft{
    position: absolute;
    top: -91px;
    left: 148px; 
}
.numright{
     position: absolute;
    top: -191px;
    left: 302px;
}
.topbox strong {
 font-size: 14px;
font-family: Microsoft YaHei;
width:56px;
font-weight: 400;
color: #26B0FF;
margin:0px 22px 0 15px;
}
.topbox span {
  font-size: 17px;
font-family: PingFang SC;
font-weight: bold;
color: #FFFFFF;
}
.bottom{
  margin-left: 15px;
    width:90%;
    height:100px;
    text-align: center;
    font-size:14px;
    line-height:35px;
}
#four{
  margin-left:25px;
}
#close{
  background: rgb(216, 15, 15);
  color: rgb(223, 217, 217);
  border-radius: 8px;
  font-size: 8px;
}
</style>