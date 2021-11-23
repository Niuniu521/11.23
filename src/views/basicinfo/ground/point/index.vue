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
      @handleDeletes="handleDelete"
      @handleQuery="handleQuery"
      @handleUpdate="handleUpdate"
      idField="objectId"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改管点对话框 -->
    <ModalForm
      width="1000px"
      v-if="open"
      :column="4"
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading">
        <GeometryDraw drawType="point" v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>
  </div>
</template>

<script>
import { listData, delData, addData, updateData } from "@/api/basicinfo/point";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

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
        {type: 'input', label: '物探点号', paramName: 'key'}
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '物探点号', dataIndex: 'expNo'},
        {title: '附属物类型', dataIndex: 'subSid'},
        {title: '特征点', dataIndex: 'feature'},
        {title: '地面高程', dataIndex: 'surfH'},
        {title: '井深', dataIndex: 'wellDeep'},
        {title: '描述', dataIndex: 'name'},
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
        {type: 'input', label: '物探点号', paramName: 'expNo'},
        {type: 'input', label: '附属物类型', paramName: 'subSid', labelWidth: '100px'},
        {type: 'input', label: '特征点', paramName: 'feature'},
        {type: 'input', label: '地面高程', paramName: 'surfH'},
        {type: 'input', label: '井深', paramName: 'wellDeep'},
        {type: 'input', label: '井盖规格', paramName: 'caliber'},
        {type: 'input', label: '井盖材质', paramName: 'material'},
        {type: 'input', label: '所属道路', paramName: 'region'},
        {type: 'input', label: '管网级别', paramName: 'waterLevel'},
        {type: 'input', label: '水流形式', paramName: 'waterMode'},
        {type: 'textArea', label: '描述', paramName: 'name', span: 24},
        {type: 'textArea', label: '备注', paramName: 'memo', span: 24},
      ],

      // 表单校验
      rules: {
        expNo: [
          { required: true, message: "物探点号不能为空", trigger: "change" }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPoint({map, geometry})
      }
    },
    /** 查询管点列表 */
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
      this.title = "添加管点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改管点";
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
  }
};
</script>
