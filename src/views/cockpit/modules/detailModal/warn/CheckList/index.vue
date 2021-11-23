<template>
  <div class="container">
    <div class="table-item" v-if="tableData && tableData.length">
      <div class="table-title">自动采样点</div>
      <MyTable :columns="columns" :data-source="tableData"/>
    </div>

    <div class="table-item" v-if="tableData2 && tableData2.length">
      <div class="table-title">自动采水点</div>
      <MyTable :columns="columns2" :data-source="tableData2"/>
    </div>

    <div class="table-item" v-if="tableData3 && tableData3.length">
      <div class="table-title">人工采样检测点</div>
      <MyTable :columns="columns3" :data-source="tableData3"/>
    </div>
  </div>
</template>

<script>
import MyTable from "../../../table";

export default {
  name: "DisposalTask",
  components: {
    MyTable,
  },
  props: {
    checkList: Array,
  },
  data() {
    let tableData = [], tableData2 = [], tableData3 = [];
    if (this.checkList && this.checkList.length) {
      this.checkList.map(item => {
        let {deviceType} = item;
        deviceType = Number(deviceType);
        if (deviceType === 0) {
          tableData3.push({...item, num: tableData3.length + 1})
        } else if (deviceType === 1) {
          tableData.push({...item, num: tableData.length + 1})
        } else if (deviceType === 2) {
          tableData2.push({...item, num: tableData2.length + 1})
        }
      })
    }
    console.log("tableData:", tableData);
    console.log("tableData2:", tableData2);
    console.log("tableData3:", tableData3);

    return {
      columns: [
        {title: "序号", dataIndex: 'num', width: 1},
        {title: "检测点名称", dataIndex: 'name', width: 1},
        {title: "检测点类型", dataIndex: 'typeName', width: 1},
        {title: "地址", dataIndex: 'address', width: 3},
      ],
      tableData: [...tableData],

      columns2: [
        {title: "序号", dataIndex: 'num', width: 1},
        {title: "检测点名称", dataIndex: 'name', width: 2},
        {title: "检测点类型", dataIndex: 'typeName', width: 1},
        {title: "地址", dataIndex: 'address', width: 3},
        {title: "检测负责人", dataIndex: 'concats', width: 1},
        {title: "部门", dataIndex: '部门', width: 1},
        {title: "联系电话", dataIndex: 'phone', width: 2},
      ],
      tableData2: [...tableData2],

      columns3: [
        {title: "序号", dataIndex: 'num', width: 1},
        {title: "检测点名称", dataIndex: 'name', width: 2},
        {title: "检测点类型", dataIndex: 'typeName', width: 1},
        {title: "地址", dataIndex: 'address', width: 3},
        {title: "采样检测负责人", dataIndex: 'concats', width: 1},
        {title: "部门", dataIndex: '部门', width: 1},
        {title: "联系电话", dataIndex: 'phone', width: 1},
      ],
      tableData3: [...tableData3],
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;
  max-height: 450px;
  overflow-y: auto;

  &::-webkit-scrollbar { /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  }

  &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner { /*滚动条里面小方块*/
    background: #1AD0F3;;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: #003659;
  }

  .table-item {
    margin-bottom: 10px;

    .table-title {
      font-size: 14px;
      color: #FFFFFF;
    }
  }
}
</style>
