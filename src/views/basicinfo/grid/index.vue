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
      <GeometryDraw drawType="polygon" v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>
  </div>
</template>

<script>
import {listData, getData, delData, addData, bindYJ, updateData, exportData} from "@/api/basicinfo/grid";
import {getTreeData} from "@/api/basicinfo/area";
import GeometryDraw from "@/components/Map/GeometryDraw";
import Map from "@/components/Map";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

export default {
  components: {
    Map,
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
        {type: 'treeSelect', label: '行政区域', paramName: 'areaId', options: []},
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
        {title: '名称', dataIndex: 'name'},
        {title: '行政区域', dataIndex: 'areaName'},
        {title: '负责人', dataIndex: 'chargeMan'},
        {title: '联系方式', dataIndex: 'phone'},
        {title: '人口', dataIndex: 'population'},
        {title: '面积', dataIndex: 'area'},
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
        {type: 'treeSelect', label: '行政区域', paramName: 'areaId', options: []},
        {type: 'input', label: '负责人', paramName: 'chargeMan'},
        {type: 'input', label: '联系方式', paramName: 'phone'},
        {type: 'input', label: '人口', paramName: 'population'},
        {type: 'input', label: '面积', paramName: 'area'},
      ],

      // 表单校验
      rules: {
        name: [
          {required: true, message: "名称不能为空", trigger: "change"}
        ],
        areaId: [
          {required: true, message: "行政区域不能为空", trigger: "change"}
        ],
        chargeMan: [
          {required: true, message: "负责人不能为空", trigger: "change"}
        ],
        phone: [
          {required: true, message: "联系方式不能为空", trigger: "change"},
          {pattern: /^((0\d{2,3}-\d{7,8})|([1-9]\d{4}\b)|(1[345789]\d{9}))$/, message: '请填写正确的手机或座机号码'}
        ],
      },
    };
  },
  created() {
    getTreeData().then(data => {
      this.searchItems[0].options = data;
      this.modalItems[1].options = data;
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
      this.title = "添加网格";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改网格";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      let {areaId} = val;
      if (areaId && areaId.length) {
        val.areaId = areaId[areaId.length - 1]
      }
      val.geometry = MapService.getPolygonData(this.map);
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
