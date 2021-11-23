<template>
  <el-tabs v-model="activeName" class="myTab">
    <el-tab-pane label="列表" name="first">
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

        <!-- 添加或修改小区对话框 -->
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
    </el-tab-pane>
    <el-tab-pane label="地图" name="second">
      <Map height="800px" @createdMap="createdLayer"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { listData, delData, addData, bindYJ, updateData, getData } from "@/api/basicinfo/community";
import BindOutletModal from "@/views/basicinfo/bindOutletModal";
import Map from "@/components/Map";
import GeometryDraw from "@/components/Map/GeometryDraw";
import MapService from "@/components/Map/MapService";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import LayerService from "@/components/Map/LayerService";

export default {
  components: {
    Map,
    MyTable,
    ModalForm,
    GeometryDraw,
    MySearch,
    BindOutletModal
  },
  name: "Data",
  data() {
    return {
      activeName: "first",
      searchForm: {},
      searchItems: [
        {type: 'input', label: '关键字', paramName: 'key'}
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
            let {outlets} = row;
            if (outlets && outlets.length) {
              return <span style='color: #24c1ff'>{row.name}</span>
            }
            return row.name
          }
        },
        {title: '编码', dataIndex: 'code'},
        {title: '详细地址', dataIndex: 'address'},
        {title: '片区民警', dataIndex: 'districtPolice'},
        {title: '民警电话', dataIndex: 'telephone'},
        {title: '常住人口', dataIndex: 'population'},
        {title: '暂住人口', dataIndex: 'temporaryPopulation'},
        {title: '社戒人口', dataIndex: 'communityDetoxification'},
        {title: '社康人口', dataIndex: 'communityRecovery'},
        {title: '优先预警阀值', dataIndex: 'priorityThreshold'},
        {title: '高危预警阀值', dataIndex: 'highThreshold'},
        {title: '详情', dataIndex: 'memo'},
        {title: '建造时间', dataIndex: 'builderDate'},
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
        {type: 'input', label: '地址', paramName: 'address'},
        {type: 'input', label: '常住人口', paramName: 'population'},
        {type: 'input', label: '暂住人口', paramName: 'temporaryPopulation'},
        {type: 'input', label: '社戒人口', paramName: 'communityDetoxification'},
        {type: 'input', label: '社康人口', paramName: 'communityRecovery'},
        {type: 'input', label: '片区民警', paramName: 'districtPolice'},
        {type: 'input', label: '民警电话', paramName: 'telephone'},
        {type: 'input', label: '建造时间', paramName: 'builderDate'},
        {type: 'input', label: '优先预警阀值', paramName: 'priorityThreshold',labelWidth: "110px"},
        {type: 'input', label: '高危预警阀值', paramName: 'highThreshold',labelWidth: "110px"},
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    createdLayer(map) {
      LayerService.renderCommunity(map, layer => {
        layer.on("click", evt => {
          let {attributes} = evt.graphic;
          if (attributes && attributes.OBJECTID) {
            getData(attributes.OBJECTID).then(row => {
              this.handleUpdate(row)
            })
          }
        })
      })
    },
    createdMap(map) {
      this.map = map;
      if (this.form && this.form.geometry) {
        let {geometry} = this.form;
        MapService.addPolygon({map, geometry});
      }
    },
    onBindModalShow(row) {
      this.resetYJ();
      this.openYJ = true;

      let {outlets} = row;
      if (outlets && outlets.length) {
        row.pointCodes = PublicService.getDataByKey(outlets, 'expNo');
      }
      this.formYJ = {...row};
    },
    /** 查询小区列表 */
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
      this.title = "添加小区";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改小区";
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
  }
};
</script>
<style lang="scss" scoped>
.myTab {
  ::v-deep .el-tabs__nav {
    margin-left: 20px;
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
}

</style>
