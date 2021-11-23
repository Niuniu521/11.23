<template>
  <div class="content">
    <div class="rankWrap">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in dataList" :key="index">
          <div class="rankItem">
            <div class="rankIndex" :style="{background: `url(${rank['rank'+(index+1)] ? rank['rank'+(index+1)] : rank.rank4}) no-repeat center center`, backgroundSize: '100% 100%'}">{{index + 1}}</div>
            <div class="rankWrap"><div class="rankContent">{{item.name}}</div></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import BarChart from "../../BarChart";
import {listData} from "@/api/basicinfo/community";
import rank1 from "../../../../assets/images/cockpit/networkResource/rank1.png";
import rank2 from "../../../../assets/images/cockpit/networkResource/rank2.png";
import rank3 from "../../../../assets/images/cockpit/networkResource/rank3.png";
import rank4 from "../../../../assets/images/cockpit/networkResource/rank4.png";
export default {
  components: {
    BarChart
  },
  data() {
    return {
      rank: {
        rank1,
        rank2,
        rank3,
        rank4,
      },
      dataList: [
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
        "某某某某某某某某小区",
      ]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listData({current: 2, size: 10}).then(data => {
        if (data && data.records) {
         this.dataList = data.records;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden !important;

  .rankWrap {
    height: 100%;
    overflow-x: hidden;
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

    .rankItem {
      display: flex;
      align-items: center;
      padding: 8px 0;

      .rankIndex {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        font-size: 12px;
        width: 26px;
        height: 26px;
        background: url("../../../../assets/images/cockpit/networkResource/rank.png") no-repeat center center;
        background-size: 100% 100%;
        margin-right: 5px;
      }

      .rankWrap {
        font-size: 14px;
        color: #ffffff;
        overflow: hidden;

        .text {
          width: 100%;
          white-space: nowrap; /* 规定文本是否折行 */
          overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
