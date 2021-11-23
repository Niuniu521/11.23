<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div v-show="model === 'detail'">
      <div class="modal-title">预警详情</div>
      <div class="checkWrap">
        <div
          class="checkItem"
          v-for="(item, index) in typeList"
          :key="index"
          @click="onChecked(item)"
        >
          <div
            class="checkContent"
            :class="{ checked: typeVal === item.value }"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="warn-content">
        <BasicInfo :modalVal="modalVal" v-show="typeVal == '1'" />
        <TestData :modalVal="modalVal" style="width: 976px; margin-top: 70px" v-show="typeVal == 2" />
        <RootsMap :modalVal="modalVal" v-show="typeVal == 3" />
        <History style=" margin-top: 18px" v-show="typeVal == 4" />
        <Lishiwarn :modalVal="modalVal" style="margin-top: 18px" v-show="typeVal == 5" />
        <People :modalVal="modalVal" style="margin-top: 18px" v-show="typeVal == 6" />
        <Disposal :modalVal="modalVal" v-show="typeVal == 7" />
      </div>
      
      <div class="warn-footer">
        <div class="footer-btn" @click="onModel('close')">关闭预警</div>
        <div class="footer-btn" @click="onModel('task')">预警处置</div>
      </div>
    </div>

    <div v-show="model === 'close'">
      <div class="modal-title">关闭预警</div>
      <CloseWarn />
      <div class="warn-footer">
        <div class="footer-btn" @click="onNext">确定</div>
        <div class="footer-btn" @click="onModel('detail')">返回预警</div>
        
      </div>
    </div>

    <div v-show="model === 'task'">
      <div class="modal-title">预警处置任务</div>
      <DisposalTask :modalVal="modalVal" ref="DisposalTask" />
      <div class="warn-footer">
        <div class="footer-btn" @click="onModel('detail')">返回预警</div>
        <div class="footer-btn" @click="onNext">下一步</div>
      </div>
    </div>
    <div v-show="model === 'check'">
      <div class="modal-title">预警处置任务</div>
      <CheckList :checkList="checkList" v-if="this.checkList.length" />

      <div class="warn-footer">
        <div class="footer-btn" @click="onModel('detail')">返回预警</div>
        <div class="footer-btn" @click="onModel('task')">上一步</div>
        <div class="footer-btn" @click="onConfirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../title";
import BasicInfo from "./BasicInfo";
import History from "./History";
import Lishiwarn from "./Lishiwarn";
import People from "./People";
import RootsMap from "./RootsMap";
import TestData from "./TestData";
import DisposalTask from "./DisposalTask";
import CheckList from "./CheckList";
import Disposal from "./Disposal"
import CloseWarn from "./CloseWarn"
import request from "@/utils/request";

export default {
  name: "index",
  components: {
    Title,
    BasicInfo,
    History,
    Lishiwarn,
    People,
    RootsMap,
    TestData,
    DisposalTask,
    CheckList,
    CloseWarn,
    Disposal
  },
  props: {
    modalVal: Object,
  },
  data() {
    return {
      val: 1,
      model: "detail",
      loading: false,
      listVal: {},
      checkList: [],
      typeVal: "1",
      typeList: [
        { label: "预警基本信息", value: "1" },
        { label: "检测数据", value: "2" },
        { label: "毒情溯源", value: "3" },
        { label: "关联预警", value: "4" },
        { label: "历史预警", value: "5" },
        { label: "高危人员", value: "6" },
        { label: "处置记录", value: "7" },
      ],
    };
  },
  watch: {
    modalVal: {
      handler(val) {
        if (val && val.id) {
          this.getModalVal(val.id);
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChecked({ value }) {
      this.typeVal = value;
    },
    handleSelect(key) {
      (this.val = key), console.log(this.val);
    },
    onConfirm() {
      this.$alert("已进行任务下达", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          console.log(action)
          let { id: alarmId, deviceAddress } = this.modalVal;
          let params = {
            alarmId,
            alarmLocation: deviceAddress,
            monitorPoints: [],
          };

          this.checkList.map((item) => {
            params.monitorPoints.push({
              monitorCode: item.code,
              monitorType: item.commonType,
              monitorWay: item.deviceType,
            });
          });
          this.loading = true;
         if(action=="confirm"){
            request({
              url: "/alarm-task/generateTask",
              method: "post",
              data: params,
            }).then((res) => {
              this.loading = false;
              if (res.code === 200 && res.data) {
                this.$message({
                  type: "success",
                  message: `任务已经下达`,
                });
                this.onClose();
              }
            })
         }
         else{
           this.onClose();
         }
        },
      });
    },
    onClose() {
      this.$emit("onClose");
    },
    onModel(model) {
      this.model = model;
      console.log(1);
    },
    onNext() {
      let { tableData } = this.$refs.DisposalTask;
      let checkList = tableData.filter((v) => v.checked);
      if (checkList && checkList.length) {
        this.checkList = [...checkList];
        this.onModel("check");
      } else {
        this.$message.warning("请选择对象");
      }
    },
    getModalVal(id) {
      this.loading = true;
      request({
        url: "/alarm-record/detail",
        method: "get",
        params: { id },
      }).then((res) => {
        this.loading = false;
        if (res.code === 200 && res.data) {
          this.listVal = res.data || {};
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.checkWrap {
  height: 30px;
  display: flex;
  align-items: center;

  .checkContent {
    margin-left: 10px;
    width: 110px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c5f3ff;
    font-size: 18px;
    cursor: pointer;
    background: url("../../../../../assets/images/cockpit/detectionControls/tab_check.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .checked {
    background: url("../../../../../assets/images/cockpit/detectionControls/tab_checked.png")
      no-repeat center center;
    background-size: 100% 100%;
    color:#EDEB04
  }
}
.modal-title {
  position: absolute;
  top: 40px;
  left: 50px;
  font-size: 20px;
  color: #ffffff;
}

.warn-content {
  height: 350px;
  overflow-y: auto;
  padding: 0 10px;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-corner {
    /*滚动条里面小方块*/
    background: #1ad0f3;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #003659;
  }

  .flexWrap {
    display: flex;
    justify-content: space-between;

    .flex1 {
      flex: 1;
    }
  }
}

.lineH {
  width: 100%;
  height: 1px;
  border-top: 1px #005e9a dashed;
}

.lineV {
  width: 1px;
  height: 100%;
  border-left: 1px #005e9a dashed;
}

.warn-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;

  .footer-right {
    display: flex;
    justify-content: flex-end;
  }

  .footer-btn {
    background: url("../../../../../assets/images/cockpit/menuBg.png") no-repeat
      0 0;
    background-size: 100% 100%;
    padding: 8px 14px;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
