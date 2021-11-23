<template>
  <div class="outer">
    <div class="top">
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :type="activity.type"
            :color="activity.color"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div
        class="data"
        style="margin-top: 3px; font-size: 18px"
        
      >
        <div class="dataitem" v-for="(item, index) in datalist" :key="index">
          {{ item.time }} {{item.deptName}} {{item.finishLocation}}{{item.operatePeople}}{{item.remark}}
        </div>
        <!-- <div class="dataitem">2021-11-5 17:53:12    西塘第一泵站李斯前往任务地点顺利完成采样</div>
        <div class="dataitem">2021-11-5 17:53:12    西塘第一泵站李梅顺利完成取样</div>
        <div class="dataitem">2021-11-5 17:53:12    西塘第一泵站谷亦凡顺利完成送检</div>
        <div class="dataitem">2021-11-5 17:53:12    西塘检测站张峰顺利完成检测</div>
        <div class="dataitem">2021-11-5 17:53:12    嘉兴市禁毒支队若依关闭预警，并进行了溯源战果汇报</div> -->
      </div>
    </div>
    <div class="bootomdata">
      <div>
        战果类型：
        <span v-show="type==1">刑事打处</span>&nbsp;&nbsp;&nbsp;
        <span v-show="type==2">治安打处</span>
      </div>
      <div>抓获嫌疑人</div>
        <!-- <el-table :data="datatable"
          :row-style="{'background-color':'#041A47','color':'#fff'}"
         :header-cell-style="{'background-color':'#041A47','color':'#fff'}" height max-height=200px border style="width:865px" >
        <el-table-column prop="peopleName" label="姓名" width="80" >
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号"  >
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80"> </el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" width="160" > </el-table-column>
        <el-table-column prop="phone" label="手机号" width="160"> </el-table-column>
        <el-table-column prop="address" label="住址" width="160"> </el-table-column>
        <el-table-column prop="" label="图片" width="60"> </el-table-column>
      </el-table> -->
    </div>
    <table border="1" class="btable" > 
        <thead style="height:50px">
          <th>姓名</th>
          <th>身份证号</th>
          <th>性别</th>
          <th>年龄</th>
          <th>籍贯</th>
          <th>手机号</th>
          <th>住址</th>
          <th>照片</th>
        </thead>
        <tbody  v-for="(item,index) in datatable" :key='index' style="height:50px">
          <td>{{item.peopleName}}</td>
          <td>{{item.idCard}}</td>
          <td>{{item.sex}}</td>
          <td>{{item.age}}</td>
          <td>{{item.nativePlace}}</td>
          <td>{{item.phone}}</td>
          <td>{{item.address}}</td>
          <td>图片</td>
        </tbody>
      </table>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  props: {
    modalVal: Object,
  },
  data() {
    return {
      datalist: [],
      datatable: [],
      type:"",
      activities: [
        // {
        //   color: "#1DEFFD",
        // },
        // {
        //   color: "#1DEFFD",
        // },
        // {
        //   color: "#1DEFFD",
        // },
        // {
        //   color: "#1DEFFD",
        // },
        // {
        //   color: "#1DEFFD",
        // },
        // {
        //   color: "#1DEFFD",
        // },
      ],
    };
  },
  watch: {
    modalVal: {
      handler(val) {
        if(val && val.type){
        this.type=val.type
        };
        if (val && val.id) {
          this.getdata(val.id);
        };
        if(val.id && val.type){
          this.gettable(val.id,val.type);
        }
      },
      immediate: true,
    },
  },
  methods: {
    timeStyle(row,){
      if(row){
        return "backrround-color:#041A47"
        
      }
  
      
    },
    getdata(alarmId) {
      request({
        url: "/alarm-record/disposeRecord",
        methods: "get",
        params: { alarmId },
      }).then((res) => {
        if (res.code === 200 && res.data) {
          console.log(res.data);
          this.datalist = res.data;
          this.activities=[]
          for( var i=0;i<res.data.length;i++){
            this.activities.push({color:"#1DEFFD"})
          }
          console.log(this.activities);
        }
      });
    },
    gettable(alarmId,type) {
      request({
        url: "/alarm-record/disposeTraceResultList",
        methods: "get",
        params: { alarmId,type },
      }).then((res) => {
        if (res.code === 200 && res.data) {
          this.datatable = res.data;
          console.log(this.datatable);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  margin-left: -18px;
  margin-top: 8px;
}
.bootomdata{
  font-size: 18px;
}
.btable{
  width:900px;
  text-align: center;
   border-collapse:collapse;
}
// .el-table th{
//     color: #ffffff; /* 字体颜色 */
//     font-size: 16px;
//     background-color: #041A47 !important;/* 背景透明 */
//     border: 0;
//     height: 30px;
//     line-height: 30px;
// }
// .el-table tr, .el-table td {
//     color: #e5dada;
//     font-size: 12px;
//     background-color: #041A47 !important;/* 背景透明 */
//     border: 0;
//     height: 30px;
//     line-height: 30px;
// }
.dataitem {
  margin-top: 3px;
  height: 24px;
}
// .double {
//   background: #f6f6f6 !important;
// }
// .single {
//   background: #ccc !important;
// }

</style>
