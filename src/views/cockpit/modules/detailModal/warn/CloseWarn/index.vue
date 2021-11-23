<template>
  <div class="container">
      <div>
        关闭原因
        <input type="textarea" width="100px" height="50px">
      </div>
  </div>
</template>

<script>


export default {
  name: "DisposalTask",
  components: {
    
  },
  data() {
    return {
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
}
</style>
