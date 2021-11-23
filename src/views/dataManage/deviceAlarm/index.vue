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
      @handleSelectionChange="handleSelectionChange"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
      idField="id"
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
import { listData, getData, delData, addData, updateData, exportData } from "@/api/dataManage/deviceAlarm";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "离线", value: 1},
  {label: "位置偏移", value: 2},
]
export default {
  components: {
    MyTable,
    ModalForm,
    GeometryDraw,
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
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '设备编号', dataIndex: 'detectionDeviceCode'},
        {title: '预警类型', dataIndex: 'alarmTypeName'},
        {title: '开始时间', dataIndex: 'startTime'},
        {title: '结束时间', dataIndex: 'endTime'},
        {title: '详情', dataIndex: 'message'},
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
        {type: 'input', label: '预警类型', paramName: 'alarmTypeName'},
        {type: 'input', label: '开始时间', paramName: 'startTime'},
        {type: 'input', label: '结束时间', paramName: 'endTime'},
        {type: 'textArea', label: '详情', paramName: 'message', span: 24},
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
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.objectId) {
        this.modalLoading = true;
        getData(this.form.objectId).then(data => {
          if (data) {
            let {geometry} = data;
            MapService.addPoint({map, geometry});
          }
          this.modalLoading = false;
        });
      }
    },
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
            if (item.alarmType) {
              item.alarmTypeName = this.getSelectLabel(typeList, item.alarmType)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.objectId)
      this.single = selection.length!=1
      this.multiple = !selection.length
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
