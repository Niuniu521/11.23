<template>
  <Table :columns="columns" :dataSource="dataSource" height="180px"/>
</template>

<script>
import request from '@/utils/request';
import Table from "../../../../modules/table";
export default {
  components: {
    Table
  },
    props: {
    modalVal: Object
  },
  data() {
    return {
      columns: [
        {title: '序号', dataIndex: '序号'},
        {title: '预警时间', dataIndex: 'alarmTime'},
        {title: '代谢物', dataIndex: 'factorNames'},
        {title: '毒品种类', dataIndex: 'kinds'},
      ],
      dataSource: [],
    }
  },
    watch: {
    modalVal: {
      handler(val) {
        if (val && val.id) {
          this.getModalVal(val.id);
        }
      },
      immediate: true,
    }
  },
  methods:{
           getModalVal(alarmId) {
        request({url: '/alarm-record/top5List', method: 'get', params: {alarmId}}).then(res => {   
        if (res.code === 200 && res.data) {
          res.data.forEach((item,index) => {
            item.alarmTime=item.alarmTime.replace("T"," ").substr("0","19")
          });
            this.dataSource=res.data.reverse()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
