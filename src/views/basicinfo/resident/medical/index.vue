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

    <!-- 添加或修改医疗机构对话框 -->
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

    <!-- 绑定窨井 -->
    <BindOutletModal v-if="openYJ" :visible="openYJ" :form="formYJ" @cancel="cancelYJ" @submitForm="submitYJForm"/>
  </div>
</template>

<script>
import { listData, delData, addData, bindYJ, updateData } from "@/api/basicinfo/medical";
import {getTreeData} from "@/api/basicinfo/area";
import BindOutletModal from "@/views/basicinfo/bindOutletModal";
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
    BindOutletModal
  },
  name: "Data",
  data() {
    return {
      searchForm: {},
      searchItems: [
        {type: 'input', label: '名称', paramName: 'name'}
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
        {title: '行政区域', dataIndex: 'areaName'},
        {title: '地址', dataIndex: 'address'},
        {title: '联系人', dataIndex: 'concatMan'},
        {title: '联系方式', dataIndex: 'concatPhone'},
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
        {type: 'input', label: '类型', paramName: 'type'},
        {type: 'treeSelect', label: '行政区域', paramName: 'areaId', options: []},
        {type: 'input', label: '联系人', paramName: 'concatMan'},
        {type: 'input', label: '联系方式', paramName: 'concatPhone'},
        {type: 'input', label: '地址', paramName: 'address', span: 24},
      ],

      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        code: [
          { required: true, message: "编号不能为空", trigger: "change" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        areaId: [
          { required: true, message: "行政区域不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "change" }
        ],
        concatMan: [
          { required: true, message: "联系人不能为空", trigger: "change" }
        ],
        concatPhone: [
          {required: true, message: "联系方式不能为空", trigger: "change"},
          {pattern: /^((0\d{2,3}-\d{7,8})|([1-9]\d{4}\b)|(1[345789]\d{9}))$/, message: '请填写正确的手机或座机号码'}
        ]
      },

      openYJ: false,
      formYJ: {},
    };
  },
  created() {
    getTreeData().then(data => {
      this.modalItems[3].options = data;
    });
    this.getList();
  },
  methods: {
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPolygon({map, geometry})
      }
    },
    onBindModalShow(row) {
      this.resetYJ();

      let {codes} = row;
      if (codes && codes.length) {
        row.pointCodes = codes;
      }
      this.formYJ = {...row};
      this.openYJ = true;
    },
    /** 查询医疗机构列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records

          tableData.map(row => {
            let {lon, lat} = row;
            if (lon && lat) {
              row.geometry = {x: Number(lon), y: Number(lat)};
            }
          })
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
    cancelYJ() {
      this.openYJ = false;
      this.resetYJ();
    },
    resetYJ() {
      this.formYJ = {};
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
      this.title = "添加医疗机构";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改医疗机构";
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
      let {areaId} = val;
      if (areaId && areaId.length) {
        val.areaId = areaId[areaId.length - 1]
      }

      val.geometry = MapService.getPolygonData(this.map);
      val.lon = val.geometry.x;
      val.lat = val.geometry.y;
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
