<template>
  <div class="list-wrap">
    <div class="list-item" v-for="(item, index) in list" :key="index" :style="{width: item.width || '50%'}">
      <span class="item-label" v-if="item.label">{{item.label}}: </span>
      <span class="item-value" v-if="item.value || Number(item.value) === 0" :title="item.value">{{item.value}}</span>
      <span class="item-value" v-if="item.paramName" :title="listVal[item.paramName]">{{listVal[item.paramName]}}</span>
    </div>
    <slot name="listItem"></slot>
  </div>
</template>

<script>
export default {
  name: "flexList",
  props: {
    list: Array,
    listVal: Object
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  display: flex;
  flex-wrap: wrap;
  user-select: none;

  .list-item {
    width: 50%;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    padding: 12px;

    .item-label {
      // color: #12d0ff;z
    }

    .item-value {
      color: #bbbbbb;
    }
  }
}
</style>
