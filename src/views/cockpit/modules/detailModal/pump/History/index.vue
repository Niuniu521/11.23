<template>
  <div class="rightbox">
          <Table :columns="columns" :dataSource="dataSource" />
        </div>
</template>

<script>
import Table from "../../../../modules/table";
export default {
  components: {
    Table
  },
  data() {
    return {
      columns: [
        {title: '序号', dataIndex: '序号'},
        {title: '预警时间', dataIndex: '预警时间'},
        {title: '代谢物', dataIndex: '代谢物'},
        {title: '毒品种类', dataIndex: '毒品种类'},
      ],
      dataSource: [
        {"序号": "1", "预警时间": "2021/6/26 11:30", "代谢物": "吗啡", "毒品种类": "海洛因"},
        {"序号": "2", "预警时间": "2021/7/15 11:30", "代谢物": "吗啡", "毒品种类": "海洛因"},
        {"序号": "3", "预警时间": "2021/8/30 11:30", "代谢物": "吗啡", "毒品种类": "海洛因"},
        {"序号": "4", "预警时间": "2021/9/13 11:30", "代谢物": "吗啡", "毒品种类": "海洛因"},
      ]
    }
  }

}
</script>

<style lang="scss" scoped>
.rightbox{
  padding:0 50px;
}
</style>