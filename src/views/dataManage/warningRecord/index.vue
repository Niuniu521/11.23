<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      :editBtnShow="false"
      :deleteShow="true"
      :deletesShow="true"
      :viewShow="true"
      :showCheck="true"
      @handleView="handleView"
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

    <!-- 添加或修改预警对话框 -->
    <ModalForm
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading"
      :disabled="title=== '查看预警'"
    />
  </div>
</template>

<script>
import { listData, getData, delData, addData, updateData, exportData } from "@/api/dataManage/warningRecord";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "自动", value: "1"},
  {label: "手动", value: "2"},
]
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
        {type: 'datePicker', dateType: 'daterange', label: '时间', paramName: 'time'},
        {type: 'input', label: '编码', paramName: 'code'},
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '设备类型', dataIndex: 'detectionDeviceTypeName'},
        {title: '设备编号', dataIndex: 'detectionDeviceCode'},
        {title: '设备名称', dataIndex: 'detectionDeviceName'},
        {title: '检测时间', dataIndex: 'detectionTime'},
        {title: '超标信息', dataIndex: 'alarmMessageAlias'},
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
        {type: 'input', label: '设备编号', paramName: 'detectionDeviceCode'},
        {type: 'input', label: '设备类型', paramName: 'detectionDeviceTypeName'},
        {type: 'input', label: '设备名称', paramName: 'detectionDeviceName'},
        {type: 'input', label: '设备地址', paramName: 'detectionAddr'},
        {type: 'input', label: '检测时间', paramName: 'detectionTime'},
        {type: 'input', label: '预警级别', paramName: 'alarmLevel'},
        {type: 'input', label: '采样电子识别码', paramName: 'electronicCode', labelWidth: '110px'},
        {type: 'textArea', label: '预警详情', paramName: 'alarmMessageDetail', span: 24},
      ],

      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询预警列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {time} = params;
      if (time && time.length) {
        params.startTime = new Date(time[0]).getTime();
        params.endTime = new Date(time[1]).getTime();
      }
      delete params.time
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records
          tableData.map(item => {
            if (item.detectionDeviceType) {
              item.detectionDeviceTypeName = this.getSelectLabel(typeList, item.detectionDeviceType)
            }
          })
        }
        let {current, size} = params;
        this.tableData = PublicService.transformArrayData(tableData, true, true, current, size);
        this.total = response.total;
        this.loading = false;
      });
    },
    // 预警状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
    handleView(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "查看预警";
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加预警";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改预警";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      val.geometry = MapService.getPointData(this.map);
      if (val.objectId) {
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
