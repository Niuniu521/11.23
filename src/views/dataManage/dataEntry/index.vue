
<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      :exportShow="true"
      :deleteShow="true"
      :deletesShow="true"
      :importShow="true"
      :viewShow="true"
      :showCheck="true"
      :addShow="true"
      @handleAdd="handleAdd"
      @handleView="handleView"
      @handleQuery="handleQuery"
      @handleUpdate="handleUpdate"
      @handleExport="handleExport"
      @importTemplate="importTemplate"
      @handleDelete="handleDelete"
      @handleDeletes="handleDelete"
      @importSuccess="getList"
      idField="id"
      tableFixed="left"
      operateWidth="140"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改预警对话框 -->
    <ModalForm
      :title="title"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading"
      :disabled="title=== '查看数据'"
    />
  </div>
</template>

<script>
import { listData, getData, delData, addData, updateData } from "@/api/dataManage/dataEntry";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import {selectLabel} from "@/utils/ruoyi";
let targetTypeList = [
  {label: "泵站", value: "PUMPSTATION"},
  {label: "窨井", value: "POINT"},
  {label: "污水厂", value: 'TREATMENTPLANT'},
];
let statusIndicatorList=[
  {label:"正常数据",value:"1"},
  {label:"测试数据",value:"2"},
  {label:"异常数据",value:"3"},
  {label:"样品数据",value:"4"},
];
let dataSourceList=[
  {label:"快速检测（手持设备）",value:"1"},
  {label:"自动在线检测",value:"2"},
  {label:"实验室导入",value:"3"},
];

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
        {type: 'datePicker', dateType: 'daterange', label: '时间', paramName: 'time'},
        {type: 'input', label: '编码', paramName: 'code'},
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        
        {title: '目标类型', dataIndex: 'targetType', width: "140", fixed: "left",formatter: (row) => selectLabel(targetTypeList, row.targetType)},
        {title: '目标编号', dataIndex: 'targetCode', width: "120", fixed: "left"},
        {title: '设备编号', dataIndex: 'deviceCode', width: "120"},
        {title: '名称', dataIndex: 'deviceName', width: "120"},
        {title: '厂家编号', dataIndex: 'companyCode', width: "120"},
        {title: '检测时间', dataIndex: 'dateTime', width: "100"},
        {title: '电子识别码', dataIndex: 'identityCode', width: "100"},
        {title: "吗啡", dataIndex: "morphine"},
        {title: "O6-单乙酰吗啡", dataIndex: "o6Acetylmorphine", width: "110"},
        {title: "甲基苯丙胺", dataIndex: "mamp", width: "100"},
        {title: "MDMA", dataIndex: "mdma"},
        {title: "苯丙胺", dataIndex: "amp"},
        {title: "MDA", dataIndex: "mda"},
        {title: "氯胺酮", dataIndex: "ketamine"},
        {title: "美沙酮", dataIndex: "morphine"},
        {title: "甲卡西酮", dataIndex: "mc", },
        {title: "去甲氯胺酮", dataIndex: "norketamine", width: "100"},
        {title: "可卡因", dataIndex: "cocaine"},
        {title: "苯甲酰爱康宁", dataIndex: "benzoylecgonine", width: "110"},
        {title: "四氢大麻酸", dataIndex: "thccooh", width: "100"},
        {title: "可待因", dataIndex: "codeine"},
        {title: "可替宁", dataIndex: "cotinine"},
        {title: "状态标识", dataIndex: "flag"},
        {title: "数据来源类型", dataIndex: "type", width: "120"},
        {title: "样品信息名称", dataIndex: "sampleName",width: "120"},
      ],
      // 表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      modalLoading: false,
      // 状态数据字典
      queryParams: {
        current: 1,
        size: 10,
      },
      // 表单参数
      form: {},

      modalItems: [
        {type: "select", label: '目标类型', paramName: "targetType",options: targetTypeList , onChange: this.onSelect, labelWidth: "100px"},
        {type: "select", label: '目标编号', paramName: "targetPointCode" ,options: [], remoteMethod: this.remoteMethod, remote: true,},
        {type: "input", label: '设备编号', paramName: "deviceCode"},
        {type: "input", label: '名称', paramName: "deviceName"},
        {type: "input", label: '厂家编号', paramName: "companyCode",},
        {type: "datePicker", label: '检测时间', paramName:"time",dateType:"datetime",format:'yyyy-MM-dd HH:mm:ss',labelWidth: "100px"},
        {type: "input", label: '电子识别码', paramName: "identityCode", labelWidth: "100px"},
        {type: "input", label: '吗啡', paramName: "morphine"},
        {type: "input", label: 'O6-单乙酰吗啡', paramName: "o6Acetylmorphine",labelWidth: "110px"},
        {type: "input", label: '甲基苯丙胺', paramName: "mamp", labelWidth: "100px"},
        {type: "input",label: "MDMA",paramName: "mdma", },
        {type: "input", label: '苯丙胺', paramName: "amp"},
        {type: "input",label: "MDA", paramName: "mda",},
        {type: "input", label: '氯胺酮', paramName: "ketamine"},
        {type: "input", label: '美沙酮', paramName: "methadone"},
        {type: "input", label: '甲卡西酮', paramName: "mc"},
        {type: "input", label: '去甲氯胺酮', paramName: "norketamine", labelWidth: "100px"},
        {type: "input", label: '可卡因', paramName: "cocaine"},
        {type: "input", label: '苯甲酰爱康宁', paramName: "benzoylecgonine", labelWidth: "100px"},
        {type: "input", label: '四氢大麻酸', paramName: "thccooh", labelWidth: "100px"},
        {type: "input", label: '可待因', paramName: "codeine"},
        {type: "input", label: '可替宁', paramName: "cotinine"},
        {type: "select", label: '状态标识', paramName: "flag",options: statusIndicatorList},
        {type: "select", label: '数据来源类型', paramName: "type",options:dataSourceList ,labelWidth: "100px"},
        {type: "input", label: '样品信息名称', paramName: "sampleName",labelWidth: "100px"},
      ],
      // 表单校验
      rules: {
      //   targetType: [
      //     {required: true, message: "目标类型不能为空", trigger: "change"}
      //   ],
      //  dateTime: [
      //     {required: true, message: "检测时间不能为空", trigger: "change"}
      //   ],
      //  flag: [
      //     {required: true, message: "状态标识不能为空", trigger: "change"}
      //   ],
      //   targetPointCode: [
      //     {required: true, message: "目标编号不能为空", trigger: "change"},
      //   ],
      },
    };
  },

  
  created() {
    this.getList();
  },
  methods: {
     remoteMethod(val) {
      if (this.form.targetType) {
        this.getDeviceList(this.form.targetType, val);
      }
    },
   onSelect() {
      delete this.form.targetPointCode;
      this.setData({t: this, name: 'modalItems', paramName: 'targetPointCode'}, []);
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
          paramName: 'targetPointCode',
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
        this.setData({t: this, name: 'modalItems', paramName: 'targetPointCode'}, [])
      }
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
    /** 查询预警列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm,};
      let {time} = params;
      if (time && time.length) {
        params.startTime = new Date(time[0]).getTime();
        params.endTime = new Date(time[1]).getTime();
      }
      delete params.time;
      listData(params).then(response => {
        this.queryParams = params;
        let tableData = [];
        if (response.records) {
          tableData = response.records;
          //    tableData.map(row => {
          //   let {time} = row;
          //   if (time) {
          //     row.codes = [dateTime];
          //   }
          // })
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
      this.title = "添加预警";
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "查看数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改预警";
    },
    /** 提交按钮 */
    submitForm() {
      let val ={...this.form};
    let {time}=val
      if(time&&time.length){
     val.dateTime=new Date(time).getTime()
      };
      val.geometry = MapService.getPolygonData(this.map);
      if (val.id) {
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
      window.location.href = process.env.VUE_APP_BASE_API + '/detection-data-record/export?' + PublicService.paramSerializer({
        ...queryParams,
      })
    },
    // 导出模版
    importTemplate() {
      window.location.href = process.env.VUE_APP_BASE_API + '/detection-data-record/exportTemplate'
    }
  }
};
</script>
