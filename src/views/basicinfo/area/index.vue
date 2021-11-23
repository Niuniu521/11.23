<template>
  <div class="container">
    <div class="left">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-bottom: 6px"
      />
      <el-tree
        ref="tree"
        v-loading="treeLoading"
        node-key="id"
        :current-node-key="checkItem.id"
        :data="treeData"
        :props="defaultProps"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        :check-on-click-node="true"
        :highlight-current="true"
        :filter-node-method="filterNode"
      />
    </div>
    <div class="right">
      <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
      <MyTable
        :loading="loading"
        :columns="columns"
        :tableData="tableData"
        :deleteShow="true"
        :viewShow="true"
        :editBtnShow="true"
        :addShow="true"
        :showCheck="true"
        @handleView="handleView"
        @handleAdd="handleAdd"
        @handleDelete="handleDelete"
        @handleQuery="handleQuery"
        @handleUpdate="handleUpdate"
      />

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.current"
        :limit.sync="queryParams.size"
        @pagination="getList"
        idField="id"
      />
    </div>


    <!-- 添加或修改区域对话框 -->
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
      :disabled="title=== '查看区域'">
      <GeometryDraw drawType="polygon" v-if="open" slot="map" height="400px" @createdMap="createdMap"/>
    </ModalForm>
  </div>
</template>

<script>
import { listData, getTreeData, delData, addData, updateData, exportData } from "@/api/basicinfo/area";
import MapService from "@/components/Map/MapService";
import GeometryDraw from "@/components/Map/GeometryDraw";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import {selectLabel} from "@/utils/ruoyi";

let levelList = [
  {value: 1, label: '省'},
  {value: 2, label: '市'},
  {value: 3, label: '县'},
  {value: 4, label: '镇'},
  {value: 5, label: '村'}
]
export default {
  components: {
    MyTable,
    ModalForm,
    GeometryDraw,
    MySearch,
  },
  name: "Data",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: '',
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'childs',
        label: 'name',
      },
      checkItem: {},

      searchForm: {},
      searchItems: [
        {type: 'input', label: '名称', paramName: 'name'},
        {type: 'select', label: '级别', paramName: 'level', options: levelList},
      ],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '上级行政区域', dataIndex: 'parentName'},
        {title: '区域等级', dataIndex: 'level', formatter: row => selectLabel(levelList, row.level) },
        {title: '名称', dataIndex: 'name'},
        {title: '编码', dataIndex: 'code'},
        {title: '描述', dataIndex: 'remark'},
        {title:'部门管理',dataIndex:'dept'},
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
        {type: 'select', label: '上级行政区域', paramName: 'parentId', options: [], labelWidth: '120px', disabled: true},
        {type:'select', label: '部门管理',paramName:'dept', options: []},
        {type: 'input', label: '名称', paramName: 'name'},
        {type: 'select', label: '区域等级', paramName: 'level',options: levelList},
        {type: 'input', label: '编码', paramName: 'code'},
        {type: 'textArea', label: '描述', paramName: 'remark', span: 24},
      ],

      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "change" }
        ],
        dept:[
          {required: true, message: "部门管理不能为空", trigger: "change" }
        ],
        level:[
          {required: true, message: "区域等级不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.treeLoading = true;
    getTreeData().then(data => {
      if (data && data.length) {
        this.checkItem = data[0];
        this.treeData = data;
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.checkItem.id)
        })

        this.getList();
      }
      this.treeLoading = false;
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    createdMap(map) {
      this.map = map;
      let {lon, lat} = this.form;
      if (lon && lat) {
        MapService.addPoint({map, geometry: {x: lon, y: lat}});
      }
    },
    handleNodeClick(data) {
      this.checkItem = data;
      this.getList();
    },
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      let {id} = this.checkItem;
      let params = {...this.queryParams, ...this.searchForm, areaId: id};
      listData(params).then(response => {
        let tableData = [];
        if (response.records) {
          tableData = response.records
        }
        let {current, size} = params;
        this.tableData = PublicService.transformArrayData(tableData, true, false, current, size);
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
    handleView(row) {
      this.reset();
      this.form = {...row};
      let {parentId, parentName} = row;
      this.modalItems[0].options = [{label: parentName, value: parentId}]
      this.open = true;
      this.title = "查看区域";
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      let {id, parentIdPath, name} = this.checkItem;
      this.form = {parentId: id, parentIdPath: parentIdPath};
      this.modalItems[0].options = [{label: name, value: id}]
      this.open = true;
      this.title = "添加区域";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let {parentId, parentName} = row;
      this.modalItems[0].options = [{label: parentName, value: parentId}]
      this.form = {...row};
      this.open = true;
      this.title = "修改区域";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};
      let {areaId} = val;
      if (areaId && areaId.length) {
        val.areaId = areaId[areaId.length - 1]
      }


      let {x, y} = MapService.getPointData(this.map);
      val.lon = x;
      val.lat = y;
      addData(val).then(response => {
        this.msgSuccess("保存成功");
        this.open = false;
        this.treeLoading = true;
        getTreeData().then(data => {
          if (data && data.length) {
            this.treeData = data;
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.checkItem.id)
            })
            this.getList();
          }
          this.treeLoading = false;
        });
      })
    },
    /** 删除按钮操作 */
    handleDelete(id) {
      delData(id).then(() => {
        this.treeLoading = true;
        getTreeData().then(data => {
          if (data && data.length) {
            this.treeData = data;
            if (id === this.checkItem.id) {
              this.checkItem = data[0]
            }
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.checkItem.id)
            })
            this.getList();
          }
          this.treeLoading = false;
        });

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
<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  padding: 10px;

}
.right, .left {
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;
}
.left {
  height: 100%;
  width: 240px;
  margin-right: 10px;
}
.right {
  height: 100%;
  flex: 1;
  max-height: 100%;
  overflow-y: auto;
}
</style>
