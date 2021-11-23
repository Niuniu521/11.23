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

    <!-- 添加或修改管线对话框 -->
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
        <GeometryDraw drawType="polyline" v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>
  </div>
</template>

<script>
import { listData, delData, addData, updateData } from "@/api/basicinfo/line";
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
        {type: 'input', label: '管线编号', paramName: 'key'}
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '起点点号', dataIndex: 'spoint'},
        {title: '终点点号', dataIndex: 'epoint'},
        {title: '管线编号', dataIndex: 'lineno'},
        {title: '管线材质', dataIndex: 'material'},
        {title: '管径', dataIndex: 'sectiondia'},
        {title: '备注', dataIndex: 'memo'},
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
        {type: 'select', label: '起点点号', paramName: 'spoint', options: []},
        {type: 'select', label: '终点点号', paramName: 'epoint', options: []},
        {type: 'input', label: '管线编号', paramName: 'lineno', disabled: true, span: 12},
        {type: 'input', label: '起点高程', paramName: 'sh'},
        {type: 'input', label: '终点高程', paramName: 'eh'},
        {type: 'input', label: '起点埋深', paramName: 'sdeep'},
        {type: 'input', label: '终点埋深', paramName: 'edeep'},
        {type: 'input', label: '管线材质', paramName: 'material'},
        {type: 'input', label: '管径', paramName: 'sectiondia'},
        {type: 'input', label: '管线长度', paramName: 'llength'},
        {type: 'input', label: '流向', paramName: 'flowdirect'},
        {type: 'input', label: '所属道路', paramName: 'region'},
        {type: 'input', label: '管网级别', paramName: 'waterLevel'},
        {type: 'textArea', label: '备注', paramName: 'memo', span: 24},
      ],

      // 表单校验
      rules: {
        spoint: [
          { required: true, message: "起点点号不能为空", trigger: "change" }
        ],
        epoint: [
          { required: true, message: "终点点号不能为空", trigger: "change" }
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
        MapService.addPolyline({map, geometry})
      }
    },
    /** 查询管线列表 */
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
      this.title = "添加管线";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改管线";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      val.geometry = MapService.getPolylineData(this.map);
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
