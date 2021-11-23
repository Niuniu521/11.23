<template>
  <div class="content">
 <el-row @click="person()">
        <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" src="@/assets/images/cockpit/traceabilityDisposal/rank1.png" />
            <span>1</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
            阳光小区 
          </div>
        </el-col>
        <el-col :span="13"><div id="block1" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
<a href="###">9人</a>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" src="@/assets/images/cockpit/traceabilityDisposal/rank2.png" />
            <span>2</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
              丽达小区
          </div>
        </el-col>
        <el-col :span="13"><div id="block2" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
<a href="###">8人</a>
          </div>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" src="@/assets/images/cockpit/traceabilityDisposal/rank3.png" />
            <span>3</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
            花园小区 
          </div>
        </el-col>
        <el-col :span="13"><div id="block3" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
<a href="###">7人</a>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" src="@/assets/images/cockpit/traceabilityDisposal/rank4.png" />
            <span>4</span>
          </div>
        </el-col>
         <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
            滨康小区 
          </div>
        </el-col>
        <el-col :span="13"><div id="block4" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
<a href="###">5人</a>
          </div>
        </el-col>
      </el-row>
        <el-row>
        <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" src="@/assets/images/cockpit/traceabilityDisposal/rank4.png" />
            <span>5</span>
          </div>
        </el-col>
         <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
            兴全小区
          </div>
        </el-col>
        <el-col :span="13"><div id="block4" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
<a href="###">5人</a>
          </div>
        </el-col>
      </el-row>

  </div>
</template>

<script>
export default {
data:{

},
methods:{
  person(){

  },
}
}
</script>

<style lang="scss" scoped>
.img {
  width:26px;
  height:25px;
}
.el-row{
  margin: 5px 0;
  line-height:18px
}
#content-box{
  position: relative;
}
#content-box span{
  position: absolute;
  top:3px;
  left:9px;
  font-size: 14px;
}
#wsc{
  font-size: 14px;
  line-height:25px;
  margin-left:-10px;
}
#block1{
width: 220px;
height: 12px;
background: linear-gradient(90deg, #FA0000 0%, #970004 100%);
border-radius: 12px;
position: absolute;
left:106px;
top:5px;
}
#block2{
width:197px;
height: 12px;
background: linear-gradient(90deg, #FA9300 0%, #AE6F01 100%);
border-radius: 12px;
position: absolute;
left:106px;
top:5px;
}
#block3{
width: 179px;
height: 12px;
background: linear-gradient(90deg, #FAE000 0%, #C5A200 100%);
border-radius: 12px;
position: absolute;
left:106px;
top:5px;
}
#block4{
width: 148px;
height: 12px;
background: linear-gradient(90deg, #00FABC 0%, #00C538 100%);
border-radius: 12px;
position: absolute;
left:106px;
top:5px;
}
#num{
  position: absolute;
right:10px;
top:2px;
}
#num a{
    color: #00FFFF;
    text-decoration:underline
}
</style>
