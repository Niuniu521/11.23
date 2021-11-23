<template>
  <div class="content">
    <div class="header">
      <el-row style="margin-bottom:10px;">
        <el-col :span="4">
          <div id="herder-left" class="grid-content bg-purple">代谢物:</div>
        </el-col>
        <el-col :span="15"
          ><div class="grid-content bg-purple-light">
            <el-select v-model="value" placeholder="吗啡" size="mini" style="width:50%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div id="herder-right" style="margin-left:10px;" class="grid-content bg-purple">单位:ng/L</div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="3">
          <div id="content-box" class="grid-content bg-purple">
            <img class="img" style="" src="@/assets/images/cockpit/traceabilityDisposal/rank1.png" />
            <span>1</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div id="wsc" class="grid-content bg-purple-light">
            西塘污水厂 
          </div>
        </el-col>
        <el-col :span="13"><div id="block1" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
42
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
            姚庄污水厂 
          </div>
        </el-col>
        <el-col :span="13"><div id="block2" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
40
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
            桐乡污水厂 
          </div>
        </el-col>
        <el-col :span="13"><div id="block3" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
38
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
            大成污水厂 
          </div>
        </el-col>
        <el-col :span="13"><div id="block4" class="grid-content bg-purple"></div></el-col>
        <el-col :span="2">
          <div id="num" class="grid-content bg-purple-light">
38
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "吗啡",
        },
        {
          value: "选项2",
          label: "海洛因",
        },
        {
          value: "选项3",
          label: "冰毒",
        },
        {
          value: "选项4",
          label: "摇头丸",
        },
      ],
      value: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.content{
  font-size:14px;
}
#herder-left,
#herder-right {
  line-height: 29px;
  color: #c5f3ff;
}
.img {
  width: 26px;
  height: 25px;
}
#content-box{
  position: relative;
}
#content-box span{
  position: absolute;
  top:-6px;
  left:9px;
  margin-top: 10px;
}
#wsc{
  line-height:30px;
  margin-left: -15px;
}
#block1{
width: 225px;
height: 12px;
background: linear-gradient(90deg, #FA0000 0%, #970004 100%);
border-radius: 12px;
position: absolute;
left:110px;
top:7px;
}
#block2{
width: 210px;
height: 12px;
background: linear-gradient(90deg, #FA9300 0%, #AE6F01 100%);
border-radius: 12px;
position: absolute;
left:110px;
top:7px;
}
#block3{
width: 182px;
height: 12px;
background: linear-gradient(90deg, #FAE000 0%, #C5A200 100%);
border-radius: 12px;
position: absolute;
left:110px;
top:7px;
}
#block4{
width: 173px;
height: 12px;
background: linear-gradient(90deg, #00FABC 0%, #00C538 100%);
border-radius: 12px;
position: absolute;
left:110px;
top:7px;
}
#num{
  position: absolute;
  right:10px;
  top:7px;
}
</style>