<template>
  <div class="content">
    <el-row class="listWrap">
      <el-col v-for="(item, index) in totalList" :span="8" :key="'total_' + index">
        <div class="listItem" :style="{height: '60px', width: '96%', background: `url(${item.img}) no-repeat 0 0`, backgroundSize: '100% 100%'}">
          <div style="padding-left: 60px">
            <div class="itemLabel" style="margin: 0" :style="{color: index === 1 && '#EEBE00'}">{{item.value}}</div>
            <div class="itemValue">{{item.label}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="listWrap" v-for="(list, index) in dataList" :key="'total_' + index">
      <el-col v-for="(item, index) in list"  :span="8" :key="'total_sub_' + index">
        <div class="listItem">
          <img class="itemImg" :src="item.img" alt="">
          <div>
            <div class="itemLabel">{{item.value}}</div>
            <div class="itemValue">{{item.label}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wsc from '@/assets/images/cockpit/networkResource/wsc-total.png';
import bz from '@/assets/images/cockpit/networkResource/bz-total.png';
import xq from '@/assets/images/cockpit/networkResource/xq-total.png';
import yy from '@/assets/images/cockpit/networkResource/yy-total.png';
import jcd from '@/assets/images/cockpit/networkResource/jcd-total.png';
import pwqy from '@/assets/images/cockpit/networkResource/pwqy-total.png';
import ylcs from '@/assets/images/cockpit/networkResource/ylcs-total.png';
import deviceTotal from '@/assets/images/cockpit/networkResource/device-total.png';
import deviceOffline from '@/assets/images/cockpit/networkResource/device-offline.png';
import deviceOnline from '@/assets/images/cockpit/networkResource/device-online.png';
export default {
  data() {
    return {
      totalList: [
        {label: "设备总数", value: 4, img: deviceTotal},
        {label: "设备离线数", value: 1, img: deviceOffline},
        {label: "设备在线数", value: 3, img: deviceOnline},
      ],
      dataList: [
        [
          {label: "污水厂", value: 4, img: wsc},
          {label: "泵站", value: 30, img: bz},
          {label: "监测点", value: 40, img: jcd},
        ],
        [
          {label: "小区", value: 120, img: xq},
          {label: "医院", value: 8, img: yy},
          {label: "排污企业", value: 21, img: pwqy},
        ],
        [
          {label: "娱乐场所", value: 56, img: ylcs},
        ]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.listWrap {
  .listItem {
    display: flex;
    align-items: center;
    margin: 6px 0;

    .itemImg {
      width: 47px;
      margin-right: 7px;
    }

    .itemLabel {
      font-size: 18px;
      font-weight: bold;
      color: #00EEEE;
      margin: 5px 0;
    }

    .itemValue {
      font-size: 12px;
      color: #FFF;
    }
  }
}
</style>
