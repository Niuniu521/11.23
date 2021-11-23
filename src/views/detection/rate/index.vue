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
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改样本记录对话框 -->
    <ModalForm
      v-if="open"
      :title="title"
      :ref="'modalForm'"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading">
        <div slot="map" v-if="configList.length > 0">
          <h3>关联检测窨井</h3>
          <FormList
            :ref="'form_' + item.key"
            v-for="item in configList"
            :items="configItems"
            :rules="configRules"
            :form="item"
            :key="item.key"
          />
        </div>
    </ModalForm>
  </div>
</template>

<script>
import { listData, getAreaData, delData, addData } from "@/api/detection/rate";
import {selectLabel} from "@/utils/ruoyi";
import ModalForm from "@/components/ModalForm";
import FormList from "@/components/FormList";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let isImportanceList = [
  {label: "是", value: 1},
  {label: "否", value: 0},
]
let statusList = [
  {label: "启用", value: 1},
  {label: "停用", value: 0},
]
let rateList = [
  {label: "月", value: 1},
  {label: "季度", value: 2},
  {label: "年", value: 3},
]
export default {
  components: {
    MyTable,
    ModalForm,
    MySearch,
    FormList
  },
  name: "Data",
  data() {
    return {
      searchForm: {},
      searchItems: [
        {type: 'input', label: '区域名称', paramName: 'name'}
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
        {title: '是否重点区域', dataIndex: 'isImportance', formatter: row => selectLabel(isImportanceList, row.isImportance)},
        {title: '区域名称', dataIndex: 'detectionAreaName'},
        {title: '频次', dataIndex: 'rate', formatter: row => selectLabel(rateList, row.rate)},
        {title: '次数', dataIndex: 'count'},
        {title: '状态', dataIndex: 'status', formatter: row => selectLabel(statusList, row.status)},
        {title: '启用时间', dataIndex: 'useTime'},
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
        {
          type: 'select',
          label: '是否重点区域',
          paramName: 'isImportance',
          options: isImportanceList,
          onChange: this.onSelect,
          labelWidth: '140px'
        },
        {type: 'select', label: '区域', paramName: 'detectionAreaId', options: [], onChange: this.onCodeSelect},
        {type: 'select', label: '频次', paramName: 'rate', options: rateList},
        {type: 'input', label: '默认次数', paramName: 'count'},
        {type: 'select', label: '状态', paramName: 'status', options: statusList},
        {type: 'datePicker', label: '启用时间', paramName: 'useTime', dateType: "datetime", format: 'yyyy-MM-dd HH:mm:ss'},
      ],
      // 表单校验
      rules: {
        isImportance: [
          { required: true, message: "是否重点区域不能为空", trigger: "change" }
        ],
        detectionAreaId: [
          { required: true, message: "区域不能为空", trigger: "change" }
        ],
        rate: [
          { required: true, message: "频次不能为空", trigger: "change" }
        ],
        count: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "默认次数不能为空", trigger: "change" }
        ],
        useTime: [
          { required: true, message: "启用时间不能为空", trigger: "change" }
        ],
      },

      configList: [],
      configItems: [
        {type: 'input', label: '窨井编号', paramName: 'code', disabled: true},
        {type: 'input', label: '次数', paramName: 'count'},
      ],
      configRules: {
        count: [
          { required: true, message: "次数不能为空", trigger: "change" }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onCodeSelect(val) {
      this.configList = [];
      getAreaData(val).then(data => {
        if (data && data.length) {
          data.map(item => {
            this.configList.push({
              key: PublicService.RandomId(),
              ...item
            })
          })
        }
      })
    },
    onSelect(value) {
      this.configList = [];
      delete this.form.detectionAreaId;
      this.getDeviceList(value);
    },
    getDeviceList(type) {
      this.setSelectData({
        t: this,
        name: 'modalItems',
        paramName: 'detectionAreaId',
        label: "name",
        value: "id",
        req: {
          url: "/basic/jx-detection-rate/listNotBind",
          params: {type}
        }
      })
    },
    /** 查询样本记录列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records
          tableData.map(item => {
            if (item.deviceType) {
              item.deviceTypeName = this.getSelectLabel(typeList, item.deviceType)
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
      this.configList = [];
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
      this.title = "添加样本记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.getDeviceList(row.isImportance)

      if (row.codes && row.codes.length) {
        row.codes.map(v => {
          this.configList.push({
            key: PublicService.RandomId(10),
            ...v
          })
        });
      }

      this.open = true;
      this.title = "修改样本记录";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};
      let validB = true;
      this.configList.map(item => {
        let {key} = item;
        let component = this.$refs[`form_${key}`][0];
        component.validate((valid) => {
          if (!valid) {
            validB = false
          }
        })
      })

      if (!validB) {
        return
      }

      let list = [];
      this.configList.map(v => {
        let {key, ...val} = v;
        list.push(val)
      })
      val.codes = list;
      addData(val).then(response => {
        this.msgSuccess("保存成功");
        this.open = false;
        this.getList();
      });
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
