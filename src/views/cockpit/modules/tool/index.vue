<template>
  <div class="container">
    <div class="top">提示</div>
    <div class="box">
<img src="@/assets/images/cockpit/OK.png">
     <span>已经进行任务下达</span>
    </div>
    <div class="btn">
      <img src="@/assets/images/cockpit/menuBg.png">
      <span>确定</span>
    </div>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="scss" scoped>
.container {
width: 535px;
height:150px;
background: #000000;
}
.top {
  position: absolute;
  top: 48px;
  left: 30px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #ffffff;
  line-height: 7px;
}
.box,.btn{
  display: flex;
justify-content:center;
align-items: center;
position: relative;
}
.box img{
  width:25px;
  height:25px;
}
.box span{
margin:2px 0 0 5px;
font-size:18px;
}
.btn img{
  margin-top:81px;
width: 111px;
height: 46px;
opacity: 0.65;

}
.btn span
{
  position:absolute;
  top: 93px;
  left:250px;
  font-size:17px
}
</style>
