<template>
  <div class="content">
    <div class="listWrap">
      <div class="listItem" v-for="(item, index) in dataList" :key="index">
        <img class="peopleImg" src="@/assets/images/cockpit/networkResource/people.png" alt="">
        <div class="contentWrap">
          <div class="contentItem">
            <div>人员姓名: {{item.name}}</div>
            <div v-if="item.type" class="typeContent" :class="'typeContent_' + item.type">
              {{getTypeName(item.type)}}人员
            </div>
          </div>
          <div class="contentItem">身份证号: {{item.IdNumber}}</div>
          <div class="contentItem">预警时间: {{item.time}}</div>
          <div class="contentItem">预警地点: {{item.address}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeVal: "",
      typeList: [
        {label: "全部", value: ""},
        {label: "社戒社康", value: "1"},
        {label: "社会面吸毒", value: "2"},
        {label: "高危流入", value: "3"},
      ],
      dataList: [
        {name: "李兴华", IdNumber: "331004199312110101", time: "2021-06-09 09:30", address: "锦绣江南小区", type: 1},
        {name: "赵晓峰", IdNumber: "330321199801233837", time: "2021-06-09 12:23", address: "西塘祥符小区", type: 2},
        {name: "张磊", IdNumber: "352330199609233920", time: "2021-06-09 14:34", address: "兰庭小区", type: 3},
      ]
    }
  },
  methods: {
    getTypeName(type) {
      if (type) {
        let item = this.typeList.find(i => String(i.value) === String(type));
        if (item) {
          return item.label
        }
      }
    },
    onChecked({value}) {
      this.typeVal = value;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .checkWrap {
    display: flex;
    align-items: center;
    height: 40px;

    .checkItem {
      display: flex;
      align-items: center;
      color: #FFFFFF;
      font-size: 14px;
      margin-right: 14px;
      cursor: pointer;

      .checkImg {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }

  .listWrap {
    height: 100%;
    overflow-y: auto;

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

    .listItem {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px dashed #033D7E;

      .peopleImg {
        width: 75px;
        height: 93px;
        margin-right: 25px;
      }

      .contentWrap {
        flex: 1;
        font-size: 12px;
        color: #ffffff;

        .contentItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;

          .typeContent {
            padding: 2px 10px;
            border-radius: 5px;
          }

          .typeContent_1 {
            border: 1px solid #00FFCC;
            color: #00FFCC;
          }

          .typeContent_2 {
            border: 1px solid #00F5FF;
            color: #00F5FF;
          }

          .typeContent_3 {
            border: 1px solid #FF0000;
            color: #FF0000;
          }
        }
      }
    }
  }
}
</style>
