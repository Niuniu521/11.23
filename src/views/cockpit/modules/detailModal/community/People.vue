<template>
  <div class="listWrap">
     <div class="checkWrap" id="checkWrap">
      <div
        class="checkItem"
        v-for="(item, index) in typeList"
        :key="index"
        @click="onChecked(item)"
      >
        <div class="checkContent" :class="{ checked: typeVal === item.value }">
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="listItem" v-for="(item, index) in list" :key="index">
      <div class="itemLeft">
        <img class="picture" src="@/assets/images/cockpit/globalOverview/picture.png" alt="">
      </div>
      <div class="itemContent">
        <div class="itemFlex">
          <div>姓名：{{ item['姓名'] }}</div>
          <div>性别：{{ item['性别'] }}</div>
          <div>籍贯：{{ item['籍贯'] }}</div>

       </div>

        </div>
        <div class="itemFlex">
          <div>首次吸毒时间：{{item['首次吸毒时间']}}</div>
          <div>戒毒时间：{{item['戒毒时间']}}</div>
        </div>
        <div>住址：{{item['住址']}}</div>
        <div>联系人：{{item['联系人']}} {{ item['联系方式'] }}</div>
      
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      list: [
        {
          "姓名": "张凤霞",
          "性别": "女",
          "籍贯": "云南省德宏州",
          "首次吸毒时间": "2008/3/2",
          "戒毒时间": "2008/9/3",
          "住址": "嘉善县西塘镇南苑路283号",
          "联系人": "李红",
          "联系方式": "13858768256",
        }, {
          "姓名": "张凤霞",
          "性别": "女",
          "籍贯": "云南省德宏州",         "首次吸毒时间": "2008/3/2",
          "籍贯": "云南省德宏州",
          "首次吸毒时间": "2008/3/2",
          "戒毒时间": "2008/9/3",
          "住址": "嘉善县西塘镇南苑路283号",
          "联系人": "李红",
          "联系方式": "13858768256",
        },
      ],
        typeVal: "1",
      typeList: [
        { label: "吸毒人员", value: "1" },
        { label: "暂住人员", value: "2" },
      ],
    }
  },
  beforeDestroy() {
  },
  mounted() {
  },
  methods: {
    onClick(item) {
      this.$emit('onClick', item);
    },
     onChecked({ value }) {
      this.typeVal = value;
    },
  }
}
</script>

<style lang="scss" scoped>
.checkWrap {
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: -30px;

  .checkContent {
    width: 110px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c5f3ff;
    font-size: 14px;
    cursor: pointer;
    background: url("./../../../../../assets/images/cockpit/detectionControls/tab_check.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .checked {
    background: url("./../../../../../assets/images/cockpit/detectionControls/tab_checked.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
}
#checkWrap{
  float: right;
  margin-top: -43px;
}
.listWrap {
  padding: 0 10px;
  width:480px;
  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
    cursor: pointer;
    position: relative;

      .picture {
        width: 70px;
        height: 87px;
        padding-bottom: 4px;
        margin: 0 4px;
      }

    .itemContent {
      flex: 1;
      color: #FFFFFF;
      font-size: 14px;
      overflow: hidden;

      .text {
        width: 100%;
        white-space: nowrap; /* 规定文本是否折行 */
        overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
      }

      .itemFlex {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
