<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      :addShow="true"
      :deleteShow="true"
      @handleAdd="handleAdd"
      @handleDelete="handleDelete"
      @handleQuery="handleQuery"
      @handleUpdate="handleUpdate"
      :operateButtons="operateButtons"
      @onBindModalShow="onBindModalShow"
      idField="objectId"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改泵站对话框 -->
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
        <GeometryDraw v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>

    <!-- 绑定窨井 -->
    <BindOutletModal :maxLength="1" v-if="openYJ" :visible="openYJ" :form="formYJ" @cancel="cancelYJ" @submitForm="submitYJForm"/>
  </div>
</template>

<script>
import { listData, getData, delData, addData, bindYJ, updateData, exportData } from "@/api/basicinfo/pump";
import BindOutletModal from "@/views/basicinfo/bindOutletModal";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "雨水", value: "雨水"},
  {label: "污水", value: "污水"},
  {label: "雨污合流", value: "雨污合流"},
  {label: "临时", value: "临时"},
  {label: "泵闸", value: "泵闸"},
]
export default {
  components: {
    MyTable,
    ModalForm,
    GeometryDraw,
    MySearch,
    BindOutletModal,
  },
  name: "Data",
  data() {
    return {
      searchForm: {},
      searchItems: [
        {type: 'input', label: '关键字', paramName: 'key'}
      ],
      operateButtons: [
        {label: "绑定窨井", functionName: 'onBindModalShow'}
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          formatter: (row) => {
            let {codes} = row;
            if (codes && codes.length) {
              return <span style='color: #24c1ff'>{row.name}</span>
            }
            return row.name
          }
        },
        {title: '编码', dataIndex: 'code'},
        {title: '类型', dataIndex: 'type'},
        {title: '详细地址', dataIndex: 'address'},
        {title: '联系人', dataIndex: 'concats'},
        {title: '联系电话', dataIndex: 'phone'},
        {title: '描述', dataIndex: 'memo'},
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
        {type: 'input', label: '名称', paramName: 'name'},
        {type: 'input', label: '编码', paramName: 'code'},
        {type: 'select', label: '类型', paramName: 'type', options: typeList},
        {type: 'input', label: '地址', paramName: 'address'},
        {type: 'input', label: '联系人', paramName: 'concats'},
        {type: 'input', label: '联系电话', paramName: 'phone'},
        {type: 'textArea', label: '描述', paramName: 'memo', span: 24},
      ],

      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "change" }
        ]
      },

      openYJ: false,
      formYJ: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onBindModalShow(row) {
      this.resetYJ();

      let {codes} = row;
      if (codes && codes.length) {
        row.pointCodes = codes;
      }
      this.formYJ = {...row};
      this.openYJ = true;
    },
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
    /** 查询泵站列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records;

          tableData.map(row => {
            let {pointCode} = row;
            if (pointCode) {
              row.codes = [pointCode];
            }
          })
        }
        let {current, size} = params;
        this.tableData = PublicService.transformArrayData(tableData, true, true, current, size);
        this.total = response.total;
        this.loading = false;
      });
    },
    // 泵站状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    cancelYJ() {
      this.openYJ = false;
      this.resetYJ();
    },
    resetYJ() {
      this.formYJ = {};
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
      this.title = "添加泵站";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改泵站";
    },
    submitYJForm(val) {
      bindYJ(val).then(response => {
        this.msgSuccess("绑定成功");
        this.cancelYJ();
        this.getList();
      });
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
