<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      :addShow="true"
      :deleteShow="true"
      :deletesShow="true"
      :showCheck="true"
      @handleAdd="handleAdd"
      @handleDelete="handleDelete"
      @handleDeletes="handleDelete"
      @handleQuery="handleQuery"
      @handleUpdate="handleUpdate"
      idField="id"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改代谢物对话框 -->
    <ModalForm
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
import { listData, delData, addData, updateData, exportData } from "@/api/dataManage/metabolin";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

export default {
  components: {
    MyTable,
    ModalForm,
    MySearch,
  },
  name: "Data",
  data() {
    return {
      searchForm: {},
      searchItems: [
        {type: 'input', label: '名称', paramName: 'name'}
      ],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '编号', dataIndex: 'code'},
        {title: '毒品种类', dataIndex: 'kind'},
        {title: '代谢物', dataIndex: 'metabolin'},
        {title: '折算校准系数', dataIndex: 'coefficient'},
        {title: '单位', dataIndex: 'unit'},
      ],
      // 表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      modalLoading: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
      },
      // 表单参数
      form: {},

      modalItems: [
        {type: 'input', label: '编号', paramName: 'code'},
        {type: 'input', label: '毒品种类', paramName: 'kind'},
        {type: 'input', label: '代谢物', paramName: 'metabolin'},
        {type: 'input', label: '折算校准系数', paramName: 'coefficient', labelWidth: "110px"},
        {type: 'input', label: '单位', paramName: 'unit'},
        {type: 'input', label: '一级阈值', paramName: 'firstValue'},
        {type: 'input', label: '二级阈值', paramName: 'secondValue'},
        {type: 'input', label: '三级阈值', paramName: 'thirdValue'},
      ],

      // 表单校验
      rules: {
        code: [
          { required: true, message: "编号不能为空", trigger: "change" }
        ],
        kind: [
          { required: true, message: "毒品种类不能为空", trigger: "change" }
        ],
        metabolin: [
          { required: true, message: "代谢物不能为空", trigger: "change" }
        ],
        firstValue: [
          { required: true, message: "一级阈值不能为空", trigger: "change" }
        ],
        secondValue: [
          { required: true, message: "二级阈值不能为空", trigger: "change" }
        ],
        thirdValue: [
          { required: true, message: "三级阈值不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询代谢物列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
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
      this.map= null;
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
      this.title = "添加代谢物";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改代谢物";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};
      if (val.id) {
        updateData(val).then(response => {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      } else {
        addData(val).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(id) {
      delData(id).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.exportLoading = true;
      exportData(queryParams).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    }
  }
};
</script>
