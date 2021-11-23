<template>
  <Table :columns="columns" :dataSource="dataSource" height="220px"/>
</template>

<script>
import Table from "../../modules/table";
export default {
  components: {
    Table
  },
  data() {
    return {
      columns: [
        {title: '序号', dataIndex: '序号', width: 0.5},
        {title: '检测时间', dataIndex: '检测时间'},
        {title: '采样地点', dataIndex: '采样地点'},
        {title: '检测方式', dataIndex: '检测方式'},
        {title: '检测结果', dataIndex: '检测结果'},
      ],
      dataSource: [
        {"序号": "1", "检测时间": "08/31 10:05:01", "采样地点": "顺利污水厂", "检测方式": "快检", "检测结果": "正常"},
        {"序号": "2", "检测时间": "08/31 10:05:01", "采样地点": "西塘污水厂", "检测方式": "固定设备", "检测结果": "异常"},
        {"序号": "3", "检测时间": "08/31 10:05:01", "采样地点": "大成污水厂", "检测方式": "快检", "检测结果": "正常"},
        {"序号": "4", "检测时间": "08/31 10:05:01", "采样地点": "姚庄污水厂", "检测方式": "实验室检测", "检测结果": "异常"},
        {"序号": "5", "检测时间": "08/31 10:05:01", "采样地点": "桐乡污水厂", "检测方式": "快检", "检测结果": "未知"},
      ]
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
