<template>
  <div class="container">
    <div class="header">小区详情</div>
    <div class="top">
      <div class="left">
        <div class="title">
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
          <span>基本信息</span>
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
        </div>
        <div class="leftbox">
          <p>小区名称：阳光小区<span class="red">高危</span></p>
          <p>建造时间：1995年</p>
          <p>常驻人口：153 暂住人口：30</p>
          <p>吸毒人员：3</p>
          <p>负责人：张伟</p>
          <p>联系电话：13852773841</p>
          <p>地址：嘉兴市南湖区科技大道38号</p>
        </div>
      </div>
      <div class="right">
        <div class="title" style="margin-top: 20px">
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
          <span>历史预警</span>
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
        </div>
        <div class="rightbox">
          <Table :columns="columns" :dataSource="dataSource" />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="title">
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
          <span>检测数据</span>
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
        </div>
        <div class="leftbox">
          <LineChart
            height="249px"
            :chartData="chartData"
            color="#FFF"
            :areaColor="['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 225, 0.1)']"
          />
        </div>
      </div>
      <div class="right">
        <div class="title" style="margin-top: 20px">
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
          <span>高危人员</span>
          <img src="@/assets/images/cockpit/globalOverview/icon.png" />
        </div>
        <div class="rightbox">
           <div class="checkWrap" id="checkWrap">
      <div class="checkItem" v-for="(item, index) in typeList" :key="index" @click="onChecked(item)">
        <div class="checkContent" :class="{'checked': typeVal === item.value}">{{item.label}}</div>
      </div>
    </div>
    <div class="person">
      <div class="personMsg">
        <img src="@/assets/images/cockpit/globalOverview/picture.png">
        <div class="personFont">
          <span>姓名：张三</span>
          <span>性别：女</span>
          <span>籍贯：云南省德宏州</span>
          <span>首次吸毒时间：2008/3/2</span>
          <span>戒毒时间：2008/9/3</span>
          <span>住址：嘉善县西塘镇南苑路283号</span>
          <span>联系人：李红   13858768256</span>
        </div>
      </div>
    </div>
     <div class="person">
      <div class="personMsg">
        <img src="@/assets/images/cockpit/globalOverview/picture.png">
        <div class="personFont2">
          <span>姓名：张三</span>
          <span>性别：女</span>
          <span>籍贯：云南省德宏州</span>
          <span>首次吸毒时间：2008/3/2</span>
          <span>戒毒时间：2008/9/3</span>
          <span>住址：嘉善县西塘镇南苑路283号</span>
          <span>联系人：李红   13858768256</span>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <img src="@/assets/images/cockpit/menuBg.png">
      <span>采样检测</span>
    </div>
  </div>
</template>

<script>
import Table from "../../table";
import LineChart from "../../../LineChart";
export default {
  components: {
    Table,
    LineChart,
  },
  data() {
    return {
       typeVal:"1",
      typeList:[ 
         {label: "吸毒人员",value:"1"},
        {label: "暂住人员", value: "2"},
      ],
      columns: [
        { title: "序号", dataIndex: "序号" },
        { title: "预警时间", dataIndex: "预警时间" },
        { title: "代谢物", dataIndex: "代谢物" },
        { title: "毒品种类", dataIndex: "毒品种类" },
      ],
      dataSource: [
        {
          序号: "1",
          预警时间: "2021/2/14  11:36:00",
          代谢物: "吗啡",
          毒品种类: "海洛因",
        },
        {
          序号: "2",
          预警时间: "2021/4/28  9:30:00",
          代谢物: "吗啡",
          毒品种类: "海洛因",
        },
        {
          序号: "3",
          预警时间: "2021/6/19  13:56:00",
          代谢物: "吗啡",
          毒品种类: "海洛因",
        },
        {
          序号: "4",
          预警时间: "2021/8/26  16:48:00",
          代谢物: "吗啡",
          毒品种类: "海洛因",
        },
        {
          序号: "5",
          预警时间: "2021/9/28  11:30:00",
          代谢物: "吗啡",
          毒品种类: "海洛因",
        },
      ],
       chartData: {
        xAxisData: ["8-26", "8-27", "8-28", "8-29","8-30"],

        legendConfig: {show: true, right: 0},
        gridConfig: {top: 30},
        lines: [
          {
            data: [40, 52, 48, 90,86],
            color: "rgba(255, 255, 255, 0.5)",
            areaColor: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)'],
            seriesConfig: {smooth: false}
          }
        ]
      }
    };
  },
   methods: {
    onChecked({value}) {
      this.typeVal = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.top,
.bottom {
  display: flex;
  justify-content: left;
}
.header {
  position: absolute;
  top: 48px;
  left: 30px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #ffffff;
  line-height: 7px;
}
.title {
  display: flex;
  flex-direction: row;
  color: #00a4ff;
  width: 100%;
}
.title img {
  width: 25px;
  height: 28px;
}
.left {
  width: 50%;
}
.leftbox {
  padding: 0 10px;
  line-height: 15px;
}
.red {
  padding: 4px 9px;
  border: 1px solid #ff0000;
  color: #ff0000;
  margin-left: 10px;
  border-radius: 2px;
}
.right {
  width: 50%;
  margin-top: -20px;
}
.checkWrap {
    height: 30px;
    display: flex;
    align-items: center;
    margin-top: -30px;

    .checkContent {
      width: 110px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C5F3FF;
      font-size: 14px;
      cursor: pointer;
      background: url("../../../../../assets/images/cockpit/detectionControls/tab_check.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .checked {
      background: url("../../../../../assets/images/cockpit/detectionControls/tab_checked.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
  #checkWrap{
  position: absolute;
  top:373px;
  right:20px;
}
.el-pagination{
  text-align: center;
}
.person{
 padding: 10px 20px;

}
.person img{
width:83px;
height:102px;
}
.personFont{
position: absolute;
left:643px;
top:390px;
}
.personFont2{
position: absolute;
left:643px;
top:514px;
}
.personFont span,.personFont2 span{
  display: inline-block;
  margin-right: 30px;
  line-height:25px;
}
.foot{
  width:1000px;
  text-align: center;
}
.foot img{
width: 111px;
height: 46px;
opacity: 0.65;
}
.foot span
{
  position:absolute;
  bottom:36px;
  left:489px;
  font-size:17px
}
</style>
