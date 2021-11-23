<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
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
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改网格对话框 -->
    <ModalForm
      v-if="open"
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading">
    </ModalForm>
  </div>
</template>

<script>
import {listData, delData, addData, updateData, exportData} from "@/api/dataManage/Qrecord";
import {getTreeData} from "@/api/basicinfo/area";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let dataSourceList=[
  {label:"快速检测（手持设备）",value:"快速检测（手持设备）"},
  {label:"自动在线检测",value:"自动在线检测"},
  {label:"实验室导入",value:"实验室导入"},
];
// let targetTypeList = [
//   {label: "泵站", value: "PUMPSTATION"},
//   {label: "窨井", value: "POINT"},
//   {label: "污水厂", value: 'TREATMENTPLANT'},
// ];
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
        {type: 'input', label: '名称', paramName: 'name'},
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '行政区域', dataIndex: 'targetName'},
        {title: '冰毒', dataIndex: 'ice'},
        {title: '海洛因', dataIndex:'heroin'},
        {title: '可卡因', dataIndex: 'cocaine'},
        {title:'可待因',dataIndex:'hemp'},
        {title:'甲卡西酮',dataIndex:'methcathinone'},
        {title: '氯胺酮', dataIndex:'ketamine'},
        {title:'摇头丸',dataIndex:'ecstasy'},
        {title:'综合指标',dataIndex:'comprehensive'},
        {title: '检测日期', dataIndex: 'date',width: "110"},
        {title: '数据来源', dataIndex: 'type',width: "110"},
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
        {type: 'tree', label: '行政区域', paramName: 'targetCode', options: []},
        {type: "input", label: '目标类型', paramName: "targetType",placeholder:"请输入AREA",diasabledInput:true},
        {type: 'input', label: '冰毒', paramName: 'ice'},
        {type: 'input', label: '海洛因', paramName: 'heroin'},
        {type: 'input', label: '可卡因', paramName: 'cocaine'},
        {type: 'input', label: '大麻', paramName: 'hemp'},
        {type: 'input', label: '甲卡西酮', paramName: 'methcathinone'},
        {type: 'input', label: '氯胺酮', paramName: 'ketamine'},
        {type: 'input', label: '摇头丸', paramName: 'ecstasy'},
        {type: 'input', label: '可待因', paramName: 'codeine'},
        {type: 'input', label: '综合指标', paramName: 'comprehensive'},
        {type: 'datePicker', label: '检测日期', paramName: 'date',dateType: "date", format: 'yyyy-MM-dd'},
        {type: "select", label: '数据来源', paramName: "type",options:dataSourceList},
      ],

      // 表单校验
      rules: {
        // targetName: [
        //   {required: true, message: "行政区域不能为空", trigger: "change"}
        // ],
        //  date: [
        //   {required: true, message: "检测日期不能为空", trigger: "change"},
        // ],
      },
    };
  },
  created() {
   getTreeData().then(data => {
        this.setData({t: this, name: 'modalItems', paramName: 'targetCode'}, data);
        this.setData({t: this, name: 'searchItems', paramName: 'targetCode'}, data);
      });
    this.getList();
  },
  methods: {
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPolygon({map, geometry});
      }
    },
    
    /** 查询网格列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {targetCode} = params;
      if (targetCode && targetCode.length) {
       params.targetCode = targetCode[targetCode.length - 1]
      }
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
      this.title = "添加Q值";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改Q值";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      let {targetCode} = val;
      if (targetCode && targetCode.length) {
       val.targetCode = targetCode[targetCode.length - 1]
      }
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
    /** 删除按钮操作 */
    handleDelete(ids) {
      delData(ids).then(() => {
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
