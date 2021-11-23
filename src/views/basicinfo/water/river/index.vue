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

    <!-- 添加或修改河湖对话框 -->
    <ModalForm
      width="1300px"
      v-if="open"
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      :column="4"
      @submitForm="submitForm"
      :loading="modalLoading">
        <GeometryDraw :maxLength="999" drawType="polygon" v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>
  </div>
</template>

<script>
import { listData, delData, addData, updateData } from "@/api/basicinfo/river";
import {getTreeData} from "@/api/basicinfo/area";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "河流", value: "河流"},
  {label: "湖泊", value: "湖泊"},
];
let isImportance = [
  {label: "是", value: 1},
  {label: "否", value: 0},
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
        {type: 'input', label: '名称', paramName: 'name'},
        {type: 'treeSelect', label: '区域', paramName: 'areaId', options: []},
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '名称', dataIndex: 'name'},
        {title: '编码', dataIndex: 'code'},
        {title: '所属水域', dataIndex: 'systemName'},
        {title: '行政区域', dataIndex: 'areaName'},
        {title: '起点', dataIndex: 'startPoint'},
        {title: '终点', dataIndex: 'endPoint'},
        {title: '长度', dataIndex: 'riverLength'},
        {title: '面积', dataIndex: 'riverArea'},
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
        {type: 'input', label: '名称', paramName: 'name'},
        {type: 'input', label: '编码', paramName: 'code'},
        {type: 'select', label: '所属水域', paramName: 'systemId', options: []},
        {type: 'select', label: '上级河湖', paramName: 'parentId', options: []},
        {type: 'treeSelect', label: '行政区域', paramName: 'areaId', options: []},
        {type: 'input', label: '起点', paramName: 'startPoint'},
        {type: 'input', label: '终点', paramName: 'endPoint'},
        {type: 'input', label: '长度', paramName: 'riverLength'},
        {type: 'input', label: '面积', paramName: 'riverArea'},
        {type: 'select', label: '河湖类型', paramName: 'type', options: typeList},
        {type: 'select', label: '重点河湖', paramName: 'isImportance', options: isImportance},
        {type: 'input', label: '流经区域', paramName: 'flowArea', span: 24},
        {type: 'textArea', label: '备注', paramName: 'remark', span: 24},
      ],

      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        areaId: [
          { required: true, message: "行政区域不能为空", trigger: "change" }
        ],
      },

      openYJ: false,
      formYJ: {},
    };
  },
  created() {
    this.getOptions();
    this.getList();
  },
  methods: {
    getOptions() {
      getTreeData().then(data => {
        this.setData({t: this, name: 'modalItems', paramName: 'areaId'}, data);
        this.setData({t: this, name: 'searchItems', paramName: 'areaId'}, data);
      });
      this.setSelectData({
        t: this,
        name: 'modalItems',
        paramName: 'systemId',
        req: {
          url: "/basic/jx-water-system/pageList",
          params: {
            size: 999,
            current: 1
          }
        },
        label: 'name',
        value: 'id',
        page: true
      });
    },
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPolygon({map, geometry})
      }
    },
    /** 查询河湖列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {areaId} = params;
      if (areaId && areaId.length) {
        params.areaId = areaId[areaId.length - 1]
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
      this.title = "添加河湖";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改河湖";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};
      let {areaId} = val;
      if (areaId && areaId.length) {
        val.areaId = areaId[areaId.length - 1]
      }

      val.geometry = MapService.getPolygonsData(this.map);

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
