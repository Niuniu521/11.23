<template>
  <div id="content">
    <table>
      <tr>
        <td>排行</td>
        <td>污水厂名称</td>
        <td>预警次数<img class="img1" src="@/assets/images/cockpit/traceabilityDisposal/py.png"></td>
        <td>采样次数<img class="img2" src="@/assets/images/cockpit/traceabilityDisposal/py.png"></td>
      </tr>
      <hr style="border:1px solid #0FD0DE;width:420%;">
      <tr>
        <td>1</td>
        <td>西塘污水厂</td>
        <td>17<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/ss.png"><span class="numRed">1</span></td>
        <td>17<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/ss.png"><span class="numRed">1</span></td>
      </tr>
      <tr>
         <td>2</td>
        <td>姚庄污水厂</td>
        <td>12<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/xj.png"><span class="numGreen">1</span></td>
        <td>12<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/xj.png"><span class="numGreen">1</span></td>
      </tr>
      <tr>
        <td>3</td>
        <td>桐乡污水厂</td>
        <td>8<span class="xb">-</span></td>
        <td>8<span class="xb">-</span></td>
      </tr>
      <tr>
        <td>4</td>
        <td>大成污水厂</td>
        <td>6<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/xj.png"><span class="numGreen">1</span></td>
        <td>6<img class="ss" src="@/assets/images/cockpit/traceabilityDisposal/xj.png"><span class="numGreen">1</span></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  mounted() {
    
  },
  methods: {
     onClick(item) {
      this.$emit('onClick', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden !important;
}
table {
  font-size: 14px;
  font-family: Microsoft YaHei;
  color: #c5f3ff;
  line-height: 30px;
  font-weight: normal;
  position: relative;
  cursor: pointer;
}
td{
  text-align: center;
  width: 150px;
}
.img1{
  position: absolute;
  left:265px;
  top: 9px;
  width: 13px;
  height: 16px;
}
.img2{
  position: absolute;
  left:363px;
  top: 9px;
  width: 13px;
  height: 16px;
}
.ss{
  margin: 0 5px 0 5px;
  width: 10px;
  height: 15px;
}
.numRed{
  position: absolute;
  color: red;
  line-height:30px
}
.numGreen{
  color:green;
}
.xb{
  margin: 0 10px 0 10px;
}
.hr2{
  border: 1px dashed #c5f3ff;
}
</style>
