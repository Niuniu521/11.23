<template>
  <Table :columns="columns" :dataSource="dataSource" height="220px" @click="onClick(item)"/>
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
        {title: '排名', dataIndex: '排名'},
        {title: '小区名称', dataIndex: '小区名称'},
        {title: '吸毒人员', dataIndex: '吸毒人员'},
        {title: '流动人员', dataIndex: '流动人员'},
      ],
      dataSource: [
        {"排名": "1", "小区名称": "润土嘉和", "吸毒人员": "17", "流动人员": "13"},
        {"排名": "2", "小区名称": "西塘新天地", "吸毒人员": "12", "流动人员": "12"},
        {"排名": "3", "小区名称": "兰庭小区", "吸毒人员": "8", "流动人员": "8"},
        {"排名": "4", "小区名称": "胥塘春晓", "吸毒人员": "15", "流动人员": "7"},
        {"排名": "5", "小区名称": "圆梦天地", "吸毒人员": "11", "流动人员": "6"},
        {"排名": "6", "小区名称": "学府澜湾", "吸毒人员": "3", "流动人员": "15"},
      ]
    }
  },
  methods: {
   onClick(item) {
      this.$emit('onClick', item);
    },
  }

}
</script>

<style lang="scss" scoped>

</style>
