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
      @handleSelectionChange="handleSelectionChange"
      :operateButtons="operateButtons"
      @onBindModalShow="onBindModalShow"
      @onAreaModalShow="onAreaModalShow"
      idField="objectId"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改污水厂对话框 -->
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

    <!-- 覆盖范围 -->
    <ModalForm
      v-if="openArea"
      title="绘制覆盖范围"
      :items="modalAreaItems"
      :form="formArea"
      :visible="openArea"
      @cancel="cancelArea"
      @submitForm="submitAreaForm"
      :loading="modalLoading"
    >
      <GeometryDraw drawType="polygon" v-if="openArea" slot="map" height="400px" @createdMap="createdAreaMap"/>
    </ModalForm>

    <!-- 绑定窨井 -->
    <BindOutletModal v-if="openYJ" :visible="openYJ" :form="formYJ" @cancel="cancelYJ" @submitForm="submitYJForm"/>
  </div>
</template>

<script>
import { listData, getData, delData, addData, bindYJ, bindArea, updateData, exportData } from "@/api/basicinfo/sewagePlant";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import LayerService from "@/components/Map/LayerService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import BindOutletModal from "@/views/basicinfo/bindOutletModal";

let typeList = [
  {label: "物理处理", value: "物理处理"},
  {label: "化学", value: "化学"},
  {label: "物理化学", value: "物理化学"},
  {label: "生物处理", value: "生物处理"},
  {label: "其他", value: "其他"},
]
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
        {type: 'input', label: '关键字', paramName: 'key'}
      ],
      operateButtons: [
        {label: "覆盖范围", functionName: 'onAreaModalShow'},
        {label: "绑定窨井", functionName: 'onBindModalShow'},
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
        {title: '处理方式', dataIndex: 'disposeWay'},
        {title: '详细地址', dataIndex: 'address'},
        {title: '联系人', dataIndex: 'concats'},
        {title: '联系电话', dataIndex: 'phone'},
        {title: '详情', dataIndex: 'memo'},
        {title: '建成日期', dataIndex: 'builderDate'},
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
        {type: 'input', label: '处理方式', paramName: 'disposeWay', options: typeList},
        {type: 'input', label: '地址', paramName: 'address'},
        {type: 'input', label: '联系人', paramName: 'concats'},
        {type: 'input', label: '联系电话', paramName: 'phone'},
        {type: 'input', label: '建成日期', paramName: 'builderDate'},
        {type: 'textArea', label: '详情', paramName: 'memo', span: 24},
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

      openArea: false,
      formArea: {},
      modalAreaItems: [
        {type: 'input', label: '名称', paramName: 'name', disabled: true},
        {type: 'input', label: '编码', paramName: 'code', disabled: true},
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onAreaModalShow(row) {
      this.resetArea();

      this.formArea = {...row};
      this.openArea = true;
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
    createdAreaMap(map) {
      this.map = map;
      let {treatmentplantcoverarea, geometry, code} = this.formArea;
      LayerService.renderArea(map);
      LayerService.renderPlantArea(map, null, {
        definitionExpression: `code <> '${code}'`
      });
      if (geometry) {
        let layer = new esri.layers.GraphicsLayer({id: "geometry"});
        map.addLayer(layer);

        if (geometry.x && geometry.y) {
          MapService.addPoint({map, geometry, zoom: 14, layer});
        }
      }

      if (treatmentplantcoverarea && treatmentplantcoverarea.geometry) {
        window.setTimeout(() => {
          MapService.addPolygon({map, geometry: treatmentplantcoverarea.geometry});
        }, 50)
      }
    },
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPoint({map, geometry});
      }
    },
    /** 查询污水厂列表 */
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
    // 污水厂状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    cancelArea() {
      this.openArea = false;
    },
    resetArea() {
      this.formArea = {};
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.objectId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加污水厂";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改污水厂";
    },
    submitAreaForm() {
      let val = {
        code: this.formArea.code,
        name: this.formArea.name,
        geometry: MapService.getPolygonData(this.map),
      }
      bindArea(val).then(response => {
        this.msgSuccess("保存成功");
        this.cancelArea();
        this.getList();
      });
    },
    submitYJForm(val) {
      val.geometry = MapService.getPolygonData(this.map);
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
