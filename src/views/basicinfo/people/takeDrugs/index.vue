<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList" />
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      :addShow="true"
      :showCheck="true"
      :deleteShow="true"
      :deletesShow="true"
      @handleAdd="handleAdd"
      @handleDelete="handleDelete"
      @handleQuery="handleQuery"
      @handleUpdate="handleUpdate"
      idField="id"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <ModalForm
      v-if="open"
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading"
    >
    </ModalForm>
  </div>
</template>
<script>
import {listData, delData, addData, updateData,} from "@/api/basicinfo/takeDrugs";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import {selectLabel} from "@/utils/ruoyi";
let levelList = [
  { value: "男", label: "男" },
  { value: "女", label: "女" },
];
export default {
  components: {
    MyTable,
    ModalForm,
    GeometryDraw,
    MySearch,
  },
  data() {
    return {
      searchForm: {},
      searchItems: [
        { type: "input", label: "姓名", paramName: "name" },
        { type: "input", label: "身份证", paramName: "idCard" },
        { type: "input", label: "户籍地行政区划", paramName: "division",labelWidth:"120px" }],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        { title: "姓名", dataIndex: "name" },
        { title: "身份证", dataIndex: "identityNum"},
        { title: "户籍地行政区划", dataIndex: "registeredDivision" },
        { title: "户籍地地址名称", dataIndex: "address" },
        { title: "吸取毒品", dataIndex: "drugUsed" },
        { title: "毒品来源", dataIndex: "drugSource" },
        { title: "初次发现时间", dataIndex: "firstCatchDate" },
        { title: "截止时间", dataIndex: "catchDate" },
      ],
      // 表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      modalLoading: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
      },
      // 表单参数
      form: {},
      modalItems: [
        { type: "input", label: "姓名", paramName: "name" },
        { type: "select",label: "身份证号",paramName: "identityNum"},
        { type: "input", label: "户籍地行政区划", paramName: "registeredDivision", labelWidth:"120px" },
        { type: "input", label: "户籍地地址名称", paramName: "address", labelWidth:"120px"},
        { type: "input", label: "吸取毒品", paramName: "drugUsed" },
        { type: "input", label: "毒品来源", paramName: "drugSource"},
        { type: "datePicker", label: "初次发现时间", paramName: "firstCatchDate",labelWidth:"100px",dateType: "date", format: 'yyyy-MM-dd'},
        { type: "datePicker", label: "截止时间", paramName: "catchDate",dateType: "date", format: 'yyyy-MM-dd'},
      
      ],
      // 表单校验
      rules: {
        // name: [
        //   { required: true, message: "名称不能为空", trigger: "change" }
        // ],
        // code: [
        //   { required: true, message: "编码不能为空", trigger: "change" }
        // ],
        // level:[
        //   {required: true, message: "区域等级不能为空", trigger: "change" }
        // ]
      },
    };
  },
  created() {
      this. getList()
  },
  methods: {
    createdMap(map) {
      this.map = map;
      let { lon, lat } = this.form;
      if (lon && lat) {
        MapService.addPoint({ map, geometry: { x: lon, y: lat } });
      }
    },
    /** 查询小区列表 */
  getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {targetCode} = params;
      if (targetCode && targetCode.length) {
       params.targetCode = targetCode[targetCode.length - 1]
      };
      console.log(params);
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records
        }
        let {current, size} = params;
        this.tableData = PublicService.transformArrayData(tableData, true, true, current, size);
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.map = null;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
     handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加修改高危流入区域设置";
    },
     /** 提交按钮 */
    submitForm() {
      let val = {...this.form};
        val.geometry = MapService.getPolygonData(this.map);
      if (val.id) {
        updateData(val).then(response=> {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      } else {
        addData(val).then(response=> {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改高危流入人员";
    },
    /** 删除按钮操作 */
    handleDelete(ids) {
      delData(ids).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      });
    },
  },
};
</script>

