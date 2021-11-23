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
      idField="objectId"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改视频站点对话框 -->
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
  </div>
</template>

<script>
import { listData, delData, addData, updateData } from "@/api/basicinfo/video";
import GeometryDraw from "@/components/Map/GeometryDraw";
import {selectLabel} from "@/utils/ruoyi";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "枪机", value: "枪机"},
  {label: "球机", value: "球机"},
]
let openList = [
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
        {type: 'input', label: '名称', paramName: 'name'}
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
        {title: '类型', dataIndex: 'type'},
        {title: '地址', dataIndex: 'address'},
        {title: '是否启用', dataIndex: 'isUse', formatter: row => selectLabel(openList, row.isUse)},
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
        {type: 'select', label: '是否启用', paramName: 'isUse', options: openList},
        {type: 'input', label: '通道号', paramName: 'channel'},
        {type: 'input', label: '码流地址', paramName: 'streamUrl'},
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
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPoint({map, geometry});
      }
    },
    /** 查询视频站点列表 */
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
      this.title = "添加视频站点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改视频站点";
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
