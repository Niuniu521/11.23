<template>
  <div class="listWrap">
    <div class="listItem" v-for="(item, index) in list" :key="index">
      <div class="itemLeft">
        <img class="picture" src="@/assets/images/cockpit/globalOverview/picture.png" alt="">
      </div>
      <div class="itemContent">
        <div class="itemFlex">
          <div>姓名：{{ item.name }}</div>
          <div>性别：{{ item.sex }}</div>
          <div>籍贯：{{ item.originalAddress }}</div>
          <div>身份证号：{{item.idCard}}</div>
        </div>
        <div class="itemFlex">
          <div>手机号：{{item.phone}}</div>
          <div>住址：{{item.address}}</div>
        </div>
        <div class="itemFlex">职业：{{item['职业']}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
   props: {
    modalVal: Object
    },
  data() {
    return {
      list: [],
    }
  },
    watch: {
      modalVal: {
        handler(val) {
          if (val && val.targetCode) {
           var data={}
            data.residentialCodes=Array(val.targetCode)
            var newData=JSON.stringify(data)
            this.getModalVal(newData)
        }
      },
      immediate: true,
    }
  },
  mounted() {
  },
  methods: {
        getModalVal(data) {
        request({url: '/alarm-record/highPeople',
          method: 'post', 
          data:data
          }).then(res => {
            if (res.code === 200 && res.data) {
              this.list=res.data
            console.log(res.data);
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#checkWrap{
  float: right;
  margin-top: -43px;
}
.listWrap {
  padding: 0 10px;
  width:780px;
  font-size: 22px;

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
        height: 26px;
        justify-content: space-between;
      }
    }
  }
}
</style>
