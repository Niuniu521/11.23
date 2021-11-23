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
      idField="detectionDeviceCode"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改设备代谢物配置对话框 -->
    <ModalForm
      v-if="open"
      :title="title"
      width="1000px"
      :ref="'modalForm'"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      :loading="modalLoading">
        <div slot="map">
          <FormList
            :ref="'form_' + item.key"
            v-for="(item, index) in configList"
            :propsIndex="index"
            :items="configItems"
            :rules="configRules"
            :form="item"
            :key="item.key"
            @onAdd="onAdd"
            @onDelete="onDelete(item)"
          />
        </div>
    </ModalForm>
  </div>
</template>

<script>
import { listData, getData, addData, delData, updateData, exportData } from "@/api/dataManage/equipmentMetabolites";
import ModalForm from "@/components/ModalForm";
import FormList from "@/components/FormList";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";

let typeList = [
  {label: "泵站", value: "PUMPSTATION"},
  {label: "窨井", value: "POINT"},
  {label: "污水厂", value: 'TREATMENTPLANT'},
];
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
        {type: 'input', label: '编码', paramName: 'targetCode'}
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
        {title: '目标类型', dataIndex: 'targetTypeName'},
        {title: '目标编号', dataIndex: 'targetCode'},
        {title: '代谢物', dataIndex: 'factorNames'},
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
        {type: 'select', label: '目标类型', paramName: 'targetType', options: typeList, onChange: this.onSelect},
        {type: 'select', label: '目标设备', paramName: 'targetCode', options: [], remoteMethod: this.remoteMethod, remote: true},
      ],
      // 表单校验
      rules: {
        targetType: [
          { required: true, message: "目标类型不能为空", trigger: "change" }
        ],
        targetCode: [
          { required: true, message: "目标设备不能为空", trigger: "change" }
        ],
      },

      configList: [{key: new Date().getTime()}],
      configItems: [
        {type: 'select', label: '代谢物', paramName: 'factorCode', options: [], span: 6, onChange: this.onFactor},
        {type: 'input', label: '警戒值：一级', paramName: 'firstValue', span: 6, labelWidth: "110px"},
        {type: 'input', label: '二级', paramName: 'secondValue', span: 5, labelWidth: "60px"},
        {type: 'input', label: '三级', paramName: 'thirdValue', span: 5, labelWidth: "60px"},
        {type: 'icon', icon: 'el-icon-circle-plus-outline', span: 1, style: {cursor: "pointer", fontSize: "30px", color: "#1a88ff"}, functionName: 'onAdd'},
      ],
      configRules: {
        factorCode: [
          { required: true, message: "代谢物不能为空", trigger: "change" }
        ],
        firstValue: [
          { required: true, message: "一级不能为空", trigger: "change" }
        ]
      },
    };
  },
  created() {
    this.getList();
    this.getMetabolinList();
  },
  methods: {
    onFactor(val, index) {
      let {options} = this.configItems[0];
      let {firstValue, secondValue, thirdValue} = options.find(v => v.value === val) || {};
      let configList = [...this.configList];
      configList[index] = {
        ...configList[index],
        factorCode: val,
        firstValue,
        secondValue,
        thirdValue
      }

      this.configList = configList;
    },
    remoteMethod(val) {
      if (this.form.targetType) {
        this.getDeviceList(this.form.targetType, val);
      }
    },
    onSelect() {
      delete this.form.targetCode;
      this.setData({t: this, name: 'modalItems', paramName: 'targetCode'}, []);
    },
    getMetabolinList() {
      this.setSelectData({
        t: this,
        name: 'configItems',
        paramName: 'factorCode',
        label: "metabolin",
        value: "id",
        req: {
          url: "/basic/jx-metabolin/nlist",
        }
      })
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
          paramName: 'targetCode',
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
        this.setData({t: this, name: 'modalItems', paramName: 'targetCode'}, [])
      }
    },
    onAdd() {
      this.configList = [
        ...this.configList,
        {key: new Date().getTime()}
      ]

      this.showDelete()
    },
    onDelete({key}) {
      this.configList = this.configList.filter(v => v.key !== key)

      this.showDelete()
    },
    showDelete() {
      if (this.configList.length === 1) {
        this.configItems = this.configItems.filter(v => v.functionName !== "onDelete")
      } else if (this.configList.length > 1) {
        let configItems = [...this.configItems];
        if (configItems.findIndex(v => v.functionName === "onDelete") === -1) {
          this.configItems = [
            ...this.configItems,
            {
              type: 'icon',
              icon: 'el-icon-remove-outline',
              span: 1,
              style: {cursor: "pointer", fontSize: "30px", color: '#f85c5c'},
              functionName: 'onDelete'
            }
          ]
        }
      }
    },
    /** 查询设备代谢物配置列表 */
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm}
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records
          tableData.map(item => {
            if (item.targetType) {
              item.targetTypeName = this.getSelectLabel(typeList, item.targetType)
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
      this.configList = [{key: new Date().getTime()}];
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
      this.title = "添加设备代谢物配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      let {targetCode, targetType} = row;

      if (targetCode && targetType) {
        this.getDeviceList(targetType, targetCode);

        getData(targetCode, targetType).then(data => {
          let {factors, ...val} = data;
          this.form = {...val};
          if (factors && factors.length) {
            factors.map(v => {v.key = new Date().getTime()});
            this.configList = [...factors];
          }
        })
      }

      this.open = true;
      this.title = "修改设备代谢物配置";
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
      val.factors = list;
      if (this.title === "修改设备代谢物配置") {
        updateData(val).then(response => {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      } else {
        addData(val).then(response => {
          this.msgSuccess("保存成功");
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
