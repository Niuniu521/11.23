<template>
  <div class="list-wrap">
    <div class="list-item" v-for="(item, index) in list" :key="index" :style="{width: item.width || '32%'}">
      <div class="item-label" v-if="item.label">{{item.label}}: 
          <!-- <span class="item-value" v-if="item.value || Number(item.value) === 0" :title="item.value">{{item.value}}</span> -->
          <span class="item-value" v-if="item.paramName" :title="listVal[item.paramName]">{{listVal[item.paramName]}}</span>
      </div>
    </div>
    <slot name="listItem"></slot>
  </div>
</template>
<script>
import request from '@/utils/request';

export default {
  name: "index",
  props: {
    modalVal: Object
  },
  data() {
    return {
      list: [
        {label: "报警时间", paramName: "alarmTime"},
        {label: "预警地点", paramName: "targetName"},
        {label: "代谢物", paramName: "factorNames"},
        {label: "毒品种类", paramName: "kinds"},
        {label: "采样方式", paramName: "typeName"},
        {label: "预警地址", paramName: "deviceAddress"},
        {label: "绑定设备编号", paramName: "deviceCode"}
        
      ],
      listVal: {}
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
  methods: {
    getModalVal(id) {
      this.loading = true;
      request({url: '/alarm-record/detail', method: 'get', params: {id}}).then(res => {
        this.loading = false;
        if (res.code === 200 && res.data) {
          var str=res.data.alarmTime.replace("T"," ").substr("0","19")
          res.data.alarmTime=str
          let {type} = res.data;
          if (type) {
            res.data.typeName = {'1': "快速检测", '2': "手动检测", '3': "实验室导入"}[String(type)]
          }
          this.listVal = res.data || {};
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.list-wrap {
  user-select: none;
  margin-top: 16px;
  margin-left: 12px;
.list-item {
  width: 30%;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  padding: 8px 0;

.item-label {
  color: #FFFF;
}

.item-value {
  color: #FFFF;
}
}
}
</style>
