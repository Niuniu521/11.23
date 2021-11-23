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

    <!-- 添加或修改设备对话框 -->
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
      :disabled="title=== '查看设备'"
    >
        <GeometryDraw v-if="open" :disabled="title=== '查看设备'" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>

    <!-- 绑定窨井 -->
    <BindOutletModal :maxLength="1" v-if="openYJ" :visible="openYJ" :form="formYJ" @cancel="cancelYJ" @submitForm="submitYJForm"/>
  </div>
</template>

<script>
import { listData, bindYJ, delData, addData, updateData, exportData,getManufactor } from "@/api/detection/samplDevice";
import GeometryDraw from "@/components/Map/GeometryDraw";
import BindOutletModal from "@/views/basicinfo/bindOutletModal";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import {selectLabel} from "@/utils/ruoyi";

let typeList = [
  {label: "自动采样+自动检测", value: 1},
  {label: "自动采样+手动检测", value: 2},
  {label: "手动检测+手动采样", value: 3},
];
let pointTypeList = [
  {label: "泵站", value: "PUMPSTATION"},
  {label: "窨井", value: "POINT"},
  {label: "污水厂", value: 'TREATMENTPLANT'},
];
let modalList = [
  {label: "24小时混合", value: "24小时混合"},
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
      Status:[],
      // operateButtons: [
      //   {label: "绑定窨井", functionName: 'onBindModalShow'}
      // ],
      searchForm: {},
      searchItems: [
        {type: 'select', label: '设备类型', paramName: 'deviceType', options: typeList},
        {type: 'input', label: '设备名称', paramName: 'name'},
        {type: 'input', label: '设备编码', paramName: 'code'},
        {type: 'input', label: '厂家名称', paramName: 'factoryCode'},
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '设备类型', dataIndex: 'type', formatter: row => selectLabel(typeList, row.type)},
        {
          title: '设备名称',
          dataIndex: 'name',
          formatter: (row) => {
            let {codes} = row;
            if (codes && codes.length) {
              return <span style='color: #24c1ff'>{row.name}</span>
            }
            return row.name
          }
        },
        {title: '设备编码', dataIndex: 'code'},
        {title: '安装地址', dataIndex: 'address'},
        {title: '目标类型', dataIndex: 'pointType', formatter: (row) => selectLabel(pointTypeList, row.pointType)},
        {title: '目标编号', dataIndex: 'concatPoint'},
        {title: '设备厂家', dataIndex: 'factoryName'},      
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
        {type: "select", label: '设备类型', paramName: 'type', options: typeList},
        {type: "input", label: '设备名称', paramName: 'name'},
        {type: "input", label: '设备编码', paramName: 'code'},
        {type: "input", label: '安装地址', paramName: 'address'},
       {type: "select", label: '目标类型', paramName: 'pointType', options: pointTypeList , onChange: this.onSelect, labelWidth: '100px'},
        {type: "select", label: '目标编号', paramName: 'concatPoint', options: [], remoteMethod: this.remoteMethod, remote: true, labelWidth: '100px'},
        {type: "select", label: '设备厂家', paramName: 'factoryName', options: []},
      ],

      // 表单校验
      rules: {
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
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
    getManufactor().then(res=>{
      if (res.code === 200) {
        res.data.forEach(item => {
          let str ={
            value:item.name,
            label:item.name
          }
          this.Status.push(str)
        });
        console.log(this.Status);
        this.setData({t: this, name: 'modalItems', paramName: 'factoryName'}, this.Status);
      console.log(res.data);
    }
    this.getList();
    }),
    this.getList();
  },
  methods: {
    // onBindModalShow(row) {
    //   this.resetYJ();

    //   let {codes} = row;
    //   if (codes && codes.length) {
    //     row.pointCodes = codes;
    //   }
    //   this.formYJ = {...row};
    //   this.openYJ = true;
    // },
    cancelYJ() {
      this.openYJ = false;
      this.resetYJ();
    },
    resetYJ() {
      this.formYJ = {};
    },
    submitYJForm(val) {
      bindYJ(val).then(response => {
        this.msgSuccess("绑定成功");
        this.cancelYJ();
        this.getList();
      });
    },

     remoteMethod(val) {
      if (this.form.pointType) {
        this.getDeviceList(this.form.pointType, val);
      }
    },
   onSelect() {
      delete this.form.concatPoint;
      this.setData({t: this, name: 'modalItems', paramName: 'concatPoint'}, []);
    },
    
    getDeviceList(type, key) {
      let P = {
        "PUMPSTATION": {
          label: "name",
          value: "code",
        },
        "POINT": {
          label: "code",
          value: "code",
        },
        "TREATMENTPLANT": {
          label: "name",
          value: "code",
        },
      }

      if (key && P[type]) {
        this.setSelectData({
          t: this,
          name: 'modalItems',
          paramName: 'concatPoint',
          label: "code",
          value: "code",
          req: {
            url: "/relationship/common-relationship/getBasicList",
            params: {
              key,
              type
            }
          },
          ...P[type]
        })
      } else {
        this.setData({t: this, name: 'modalItems', paramName: 'concatPoint'}, [])
      }
    },

    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        // console.log("geometry:", geometry);
        MapService.addPoint({map, geometry});
      }
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records;

          tableData.map(row => {
            let {concatPoint} = row;
            if (concatPoint) {
              row.codes = [concatPoint];
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
      this.title = "添加设备";
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "查看设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改设备";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      val.geometry = MapService.getPointData(this.map);
      val.lon = val.geometry.x;
      val.lat = val.geometry.x;
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
