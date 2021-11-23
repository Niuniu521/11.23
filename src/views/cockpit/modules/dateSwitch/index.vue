<template>
  <div class="list-wrap">
    <div
      class="list-item"
      :class="{'active-item': value === item.value}"
      v-for="item in list"
      :key="item.label"
      @click="onClick(item)">
      {{item.label}}
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      a:"",
      value: "周",
      list: [
        {label: "周", value: "0"},
        {label: "月", value: "1"},
        {label: "季", value: "2"},
        {label: "年", value: "3"},
      ]
    }
  },
  methods: {
    onClick({value}) {
      this.value = value;
      console.log(this.value);

    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  display: flex;
  align-items: center;
  position: absolute;
  top: 70px;
  left: 10px;
  z-index: 99;

  .list-item {
    width: 38px;
    height: 43px;
    background: url("../../../../assets/images/cockpit/itemBg.png") no-repeat 0 0;
    background-size: 100% 100%;
    text-align: center;
    opacity: 0.8;
    margin-right: 6px;
    cursor: pointer;
    padding-top: 2px;
  }

  .active-item {
    opacity: 1;
    background: url("../../../../assets/images/cockpit/selectBg.png") no-repeat 0 0;
    background-size: 100% 100%;
  }
}
</style>
