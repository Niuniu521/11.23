<template>
  <div class="Title">
    <img src="@/assets/images/cockpit/roots/blue.png" style="height: 28px"/>
    <span>{{ title }}</span>
    <img src="@/assets/images/cockpit/roots/blue.png" style="height: 28px"/>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
.Title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  color: #50F2FF;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 10px 0 0 0;

  span {
    padding-bottom: 10px;
  }
}
</style>
