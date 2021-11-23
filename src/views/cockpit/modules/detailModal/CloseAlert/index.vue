<template>
<div class="container">
  <!-- <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)"> -->
    <div v-show="model === 'detail'">
      <div class="modal-title">关闭预警</div>
      <div class="content">
        <div class="top">
          <span class="font">关闭原因：</span>
          <div class="import">
            <input type="text" class="why" />
          </div>
        </div>
        <div class="results">
          <div class="results_top">
            <span class="font">成果汇报：</span>
            <div class="choose">
              <div class="choose_roots">
                <span>是否有溯源战果：</span>
                <el-radio v-model="radio" label="1">是</el-radio>
                <el-radio v-model="radio" label="2">否</el-radio>
              </div>
              <div class="choose_type">
                <span>战果类型：</span>
                <el-radio v-model="radios" label="1">刑事打处</el-radio>
                <el-radio v-model="radios" label="2">治安打处</el-radio>
              </div>
            </div>
          </div>
          <div class="results_bottom">
            <div class="name">
              姓名：<input type="text" placeholder="请输入姓名" class="zhong"/>
            </div>
            <div class="ID">
              身份证号：<input type="text" placeholder="请输入身份证号" class="zhong"/>
            </div>
            <div class="sex">
              性别：<el-select v-model="value" placeholder="请选择" class="duan">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="age">
              年龄：<input type="text" placeholder="请输入年龄" class="duan"/>
            </div >
            <div class="place">
              籍贯：<input type="text" placeholder="请输籍贯" class="duan"/>
            </div>

            <div>
              手机号：<input type="text" placeholder="请输入手机号" class="zhong"/>
            </div>
            <div class="address">
              住址：<input type="text" placeholder="请输入住址" />
            </div>
            <div>
              照片：
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- </div> -->
</div>  
</template>

<script>
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
export default {
  components: {
  ModalForm,
   MySearch
  },
  data() {
    return {
      radio: "1",
      radios: "1",
      model: "detail",
      loading: false,
      options: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ],
      value: "",
    };
  },
   created() {
    
  },
  methods:{
  }
};
</script>

<style lang="scss" scoped>
.modal-title {
  position: absolute;
  top: 40px;
  left: 50px;
  font-size: 20px;
  color: #ffffff;
}
.why {
  width: 1008px;
  height: 80px;
  background: #032237;
  opacity: 0.6;
  margin-top: 5px;
}
.content {
  margin-left: 10px;
}
.font {
  width: 133px;
  height: 28px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}
.choose {
  display: flex;
  margin-top: 5px;
}
.choose_type {
  margin-left: 100px;
}
.results_top {
  margin-top: 5px;
}
.results_bottom{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
  input{
    height:  37px;
    line-height: 36px;
     background: #052941;
     border-radius: 5px;
     color: #FFFFFF;
  }
}
  .zhong{
    width: 110px;
  }
.duan{
  width: 90px;
   background: #052941;
}
.address{
   margin-top: 10px;
   input{
     width: 315px;
   }
}
</style>
