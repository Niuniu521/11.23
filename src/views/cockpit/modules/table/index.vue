<template>
  <div class="table">
    <div class="columns-wrap">
      <div class="column" v-for="(column, index) in columns" :key="index" :style="{flex: column.width || 1}">
        <div>{{column.title}}</div>
        <div v-if="column.unit">{{column.unit}}</div>
      </div>
    </div>
    <div class="data-list-wrap" :style="{height}">
      <div class="row" v-for="(data, index) in dataSource" :key="index">

        <div class="col" v-for="(column, columnIndex) in columns" :key="index + '_' + columnIndex" :style="{flex: column.width || 1}">
          <div class="col" v-show="!data[column.dataIndex]">{{index+1}}</div>
          {{column.dataIndex && data[column.dataIndex]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "table",
  props: {
    columns: {
      type: Array,
      default: []
    },
    dataSource: {
      type: Array,
      default: []
    },
    height: String
  }
}
</script>

<style lang="scss" scoped>
.table {
  .columns-wrap {
    display: flex;
    color: #C5F3FF;
    font-size: 14px;
    text-align: center;
    border-bottom: 1px solid #0FD0DE;
    padding: 8px 0;

    .column {
      flex: 1;
      text-align: center;
    }
  }

  .data-list-wrap {
    overflow-y: auto;

    .row {
      display: flex;
      color: #C5F3FF;
      font-size: 14px;
      padding: 8px 0;

      .col {
        flex: 1;
        text-align: center;
      }
    }


    &::-webkit-scrollbar { /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 10px;
    }

    &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner { /*滚动条里面小方块*/
      -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, .5);
      background: rgba(0, 0, 0, .2);
      border-radius: 3px;

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    }

    &::-webkit-scrollbar-track { /*滚动条里面轨道*/
      background: transparent;

      &:hover {
        background: rgba(0, 0, 0, .2);
      }
    }
  }
}
</style>
