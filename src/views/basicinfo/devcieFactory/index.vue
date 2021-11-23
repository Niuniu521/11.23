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
import {listData, delData, addData, updateData,} from "@/api/basicinfo/devcieFactory";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import {selectLabel} from "@/utils/ruoyi";
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
        { type: "input", label: "厂家名称", paramName: "name" },
         { type: "input", label: "厂家编号", paramName: "factoryCode" }],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        { title: "厂家名称", dataIndex: "name" },
        { title: "编号", dataIndex: "code" },
        { title: "联系人",dataIndex: "concatMan"},
        { title: "联系电话", dataIndex: "phone",},
        { title: "地址", dataIndex: "address"},
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
        { type: "input", label: "厂家名称", paramName: "name" },
        { type: "input", label: "编号", paramName: "code" },
        { type: "input",label: "联系人",paramName: "concatMan"},
        { type: "input", label: "联系电话", paramName: "phone",  },
        { type: "input", label: "地址", paramName: "address",  },
        
      ],
      // 表单校验
      rules: {
        // name: [
        //   { required: true, message: "名称不能为空", trigger: "change" }
        // ],
        // concatMan: [
        //   { required: true, message: "联系人不能为空", trigger: "change" }
        // ],
        // address:[
        //   {required: true, message: "区域等级不能为空", trigger: "change" }
        // ]
        // Phone:[  {pattern: /^((0\d{2,3}-\d{7,8})|([1-9]\d{4}\b)|(1[345789]\d{9}))$/, message: '请填写正确的手机或座机号码'}]
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
    /** 查询区域列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {targetCode} = params;
      if (targetCode && targetCode.length) {
       params.targetCode = targetCode[targetCode.length - 1]
      };
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
      this.title = "添加常驻人口信息";
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
      this.title = "修改常驻人口信息";
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