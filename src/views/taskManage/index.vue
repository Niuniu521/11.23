<template>
  <div class="app-container">
    <MySearch :form="searchForm" :items="searchItems" @submitForm="getList"/>
    <MyTable
      :loading="loading"
      :columns="columns"
      :tableData="tableData"
      @handleQuery="handleQuery"
      @handleView="handleView"
      :viewShow="true"
      :editBtnShow="false"
      :operateButtons="operateButtons"
      @onTaskModalShow="onTaskModalShow"
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
      width="1200px"
      :column="4"
      title="任务汇报"
      :visible="open"
      :items="modalItems"
      :form="form"
      :rules="rules"
      @cancel="cancel"
      @submitForm="submitForm"
      saveTitle="完成任务"
      :loading="modalLoading">
      <div v-if="open" slot="map">
        <div class="details">
          <div class="details-item">关联预警 ：</div>
          <div class="details-item" style="justify-content: flex-end">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-download"
              class="item-wrap"
              v-if="title === '任务汇报'"
              @click="importTemplate">
              检测结果模板
            </el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
              class="item-wrap"
              v-if="title === '任务汇报'"
              @click="handleImport">
              导入
            </el-button>

            <el-button
              size="small"
              type="primary"
              icon="el-icon-download"
              class="item-wrap"
              @click="handleExport"
              v-if="title === '查看任务'">
              检测报告
            </el-button>
          </div>
        </div>
        <el-table
          class="tableBox"
          row-key="key"
          :expand-row-keys="expandRowKeys"
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand" width="1px">
            <template slot-scope="props">
              <div class="form-wrap">
                <div class="form-header-wrap">
                  <div class="form-header-title">进度汇报</div>
                  <i class="el-icon-close" @click="shrink(props)"/>
                </div>
                <FormList
                  :items="configItems"
                  :rules="configRules"
                  :form="configVal"
                />
                <el-button type="primary" @click="onConfigSave">添 加</el-button>

                <el-table
                  v-if="props.tableData && props.tableData.length"
                  row-key="key"
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column label="工作内容" prop="工作内容"/>
                  <el-table-column label="完成时间" prop="完成时间"/>
                  <el-table-column label="完成地点" prop="完成地点"/>
                  <el-table-column label="样本编号" prop="样本编号"/>
                  <el-table-column label="汇报人" prop="汇报人"/>
                  <el-table-column label="操作人" prop="操作人"/>
                  <el-table-column label="备注" prop="备注"/>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" :index="indexMethod"/>
          <el-table-column label="任务地点" prop="current"/>
          <el-table-column label="检测点类型" prop="name"/>
          <el-table-column label="地址" prop="desc"/>
          <el-table-column label="任务内容" prop="desc"/>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="shrink(scope)">任务汇报</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ModalForm>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listData, delData, addData, getTaskData, updateData, exportData, reportNew, exportTemplate} from "@/api/taskManage/taskManage";
import {getTreeData} from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import moment from "moment";
import ModalForm from "@/components/ModalForm";
import MySearch from "@/components/MySearch";
import MyTable from "@/components/MyTable";
import PublicService from "@/services/PublicService";
import FormList from "@/components/FormList";
import {selectLabel} from "@/utils/ruoyi";

let taskType = [
  {value: 1, label: "溯源任务"},
  {value: 2, label: "采样检测任务"},
  {value: 3, label: "反向溯源任务"},
]

let taskStatus = [
  {value: 1, label: "正在处理"},
  {value: 2, label: "已完成"},
]

let workType = [
  {value: 1, label: "采样"},
  {value: 2, label: "取样"},
  {value: 3, label: "送检"},
  {value: 4, label: "检测"},
]
export default {
  components: {
    Map,
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
        // {type: 'select', label: '任务类型', paramName: 'taskType', options: taskType},
        {type: 'input', label: '任务编号', paramName: 'taskCode'},
        {type: 'datePicker', dateType: 'daterange', label: '下达时间', paramName: 'date'},
        {type: 'input', label: '下达人', paramName: 'peopleName'},
        {type: 'treeSelect', label: '下达部门', paramName: 'deptId', options: [], props: {value: 'id', label: 'label', children: 'children'}},
        {type: 'select', label: '任务状态', paramName: 'taskStatus', options: taskStatus},
      ],
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 表格列
      columns: [
        {title: '任务编号', dataIndex: 'taskCode'},
        // {title: '任务类型', dataIndex: 'taskTypeName'},
        {title: '下达时间', dataIndex: 'designTime'},
        {title: '下达人', dataIndex: 'peopleName'},
        {title: '下达部门', dataIndex: 'deptName'},
        {title: '联系电话', dataIndex: 'peoplePhone'},
        {title: '任务状态', dataIndex: 'taskStatusName'},
      ],
      operateButtons: [
        {label: "任务汇报", functionName: 'onTaskModalShow'}
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
        {type: 'input', label: '任务编号', paramName: 'taskCode', disabled: true},
        {type: 'input', label: '下达时间', paramName: 'designTime', disabled: true},
        {type: 'input', label: '下达人', paramName: 'peopleName', disabled: true},
        {type: 'input', label: '下达部门', paramName: 'deptName', disabled: true},
        {type: 'input', label: '联系电话', paramName: 'peoplePhone', disabled: true},
        {type: 'input', label: '任务状态', paramName: 'taskStatusName', disabled: true},
      ],

      expandRowKeys: [],

      // 表单校验
      rules: {},

      configItems: [
        {type: 'select', label: '工作内容', paramName: 'workType', options: workType, span: 6},
        {type: 'datePicker', label: '完成时间', paramName: 'finishTime', span: 6},
        {type: 'input', label: '完成地点', paramName: 'finishLocation', span: 6},
        {type: 'input', label: '样本编号', paramName: 'sampleCode', span: 6},
        {type: 'input', label: '汇报人', paramName: 'reportPeople', span: 6},
        {type: 'input', label: '操作人', paramName: 'operatePeople', span: 6},
        {type: 'input', label: '备注', paramName: 'remark', span: 12},
      ],
      configRules: {},
      configVal: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/alarm-task/importData"
      },
    };
  },
  created() {
    this.getDepList();
    this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      exportData({code: this.form.taskCode}).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.exportLoading = true;
      exportTemplate({code: this.form.taskCode}).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.$emit('importSuccess')
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
       importData({code: this.form.file}).then(response =>{
          this.upload(response.msg);
      })
    },
    getDepList() {
      getTreeData().then(data => {
        this.setData({t: this, name: 'searchItems', paramName: 'deptId'}, data)
      });
    },
    onConfigSave() {
      let val = {
        ...this.configVal,
        id: this.form.id
      }
      console.log("val:", val);
      reportNew(val).then(data => {
        getTaskData()
      })
    },
    onTaskModalShow(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "任务汇报";
    },
    indexMethod(index) {
      return index + 1;
    },
    shrink(scope) {
      let {row} = scope;
      if (this.expandRowKeys.includes(row.key)) {
        this.expandRowKeys = [];
      } else {
        this.configVal = {
          // reportPeople: ,
          // operatePeople: ,
          // finishLocation: ,
          // finishTime: ,
        }
        this.expandRowKeys = [row.key];
      }
    },
    // 查询列表
    getList() {
      this.loading = true;

      let params = {...this.queryParams, ...this.searchForm};
      let {depId, date} = params;
      if (depId && depId.length) {
        params.depId = depId[depId.length - 1]
      }

      if (date && date.length) {
        params.startTime = moment(date[0]).format("x")
        params.endTime = moment(date[1]).format("x")
      }
      delete params.date;

      listData(params).then(response => {
        // console.log(response)
        let tableData = [];
        if (response.records) {
          tableData = response.records;
          tableData.map(item => {
            // item.taskTypeName = selectLabel(taskType, item.taskType);
            item.taskStatusName = selectLabel(taskStatus, item.taskStatus);
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
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "查看任务";
    },
    /** 提交按钮 */
    submitForm() {
      let val = {...this.form};

      let {areaId} = val;
      if (areaId && areaId.length) {
        val.areaId = areaId[areaId.length - 1]
      }
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
.tableBox ::v-deep .el-table__expand-icon:after {
  content: '';
}
.tableBox ::v-deep .el-table__expand-icon > i {
  display: none;
}
.tableBox ::v-deep .el-table__expand-column {
  border-right: none;
}

.tableBox ::v-deep .el-table__expanded-cell {
  padding: 0 !important;
}

.details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .details-item {
    flex: 1;
    display: flex;

    .item-wrap {
      margin-left: 10px;
    }
  }
}

.form-wrap {
  background: #F8F8F9;
  padding: 0 10px 10px 10px;

  .form-header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;

    .form-header-title {
      font-size: 14px;
      color: #1890FF;
    }

    .el-icon-close {
      font-size: 20px;
      color: #C6C6C6;
      cursor: pointer;

      &:hover {
        color: #919191
      }
    }
  }
}
</style>
