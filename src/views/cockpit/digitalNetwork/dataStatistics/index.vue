<template>
  <div class="list-wrap">
    <div class="list-item" v-for="item in dataList" :key="item.label">
      <div class="item-img"><img :src="item.icon"/></div>
      <div>
        <span class="item-value">{{item.value}}</span>
        <span class="item-unit">{{item.unit}}</span>
      </div>
      <div class="item-label">{{item.label}}</div>
    </div>
  </div>
</template>

<script>
import icon_1 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/1.png";
import icon_2 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/2.png";
import icon_3 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/3.png";
import icon_4 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/4.png";
import icon_5 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/5.png";
import icon_6 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/6.png";
import icon_7 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/7.png";
import icon_8 from "@/assets/images/cockpit/digitalNetwork/dataStatistical/8.png";

export default {
  data() {
    return {
      dataList: [
        {label: "污水厂", value: 5, unit: "家", icon: icon_1},
        {label: "泵站", value: 36, unit: "个", icon: icon_2},
        {label: "窨井", value: 18926, unit: "个", icon: icon_3},
        {label: "检测设备", value: 5, unit: "台", icon: icon_4},
        {label: "采集设备", value: 36, unit: "台", icon: icon_5},
        {label: "小区", value: 283, unit: "个", icon: icon_6},
        {label: "重点场所", value: 218, unit: "个", icon: icon_7},
        {label: "视频", value: 5, unit: "个", icon: icon_8},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .list-item {
    width: 25%;
    text-align: center;
    padding: 4px 0;

    .item-img {
      width: 40px;
      height: 40px;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .item-value {
      font-size: 20px;
      color: #00EAFF;
    }

    .item-unit {
      font-size: 12px;
      color: #00EAFF;
    }

    .item-label {
      font-size: 12px;
      color: #fff;
    }
  }

}
</style>
