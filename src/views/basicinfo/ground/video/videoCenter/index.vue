<template>
  <div class="container">
    <div class="left">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-bottom: 6px"
      />
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="handleNodeClick"
        :current-node-key="checkItem.id"
        :default-expand-all="true"
        :highlight-current="true"
        :check-on-click-node="true"
      />
    </div>
    <div class="center">
      <div class="content">
        <div
          v-for="item in wrapList"
          :class="{activeCard: activeWrap.key === item.key}"
          :style="{'width': 100 / activeModel + '%', 'height': 100 / activeModel + '%'}"
          class="contentItem"
          @click="onCard(item)"
          :key="item.key">
        </div>
      </div>
      <div class="footer">
        <div @click="onModel(item)" :class="{activeFootItem: activeModel === item.value}" class="footItem" v-for="item in modalList" :key="item.value">
          <i :class="item.icon"></i>
          <span>{{item.label}}</span>
        </div>
      </div>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script>
import { getTreeData } from "@/api/basicinfo/video";
import PublicService from "@/services/PublicService";
export default {
  data() {
    let wrapList = [{key: new Date().getTime()}];
    return {
      filterText: '',
      checkItem: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      wrapList,
      activeWrap: wrapList[0],

      modalList: [
        {label: "1*1", icon: "el-icon-s-marketing", value: 1},
        {label: "2*2", icon: "el-icon-menu", value: 2},
        {label: "3*3", icon: "el-icon-s-grid", value: 3},
      ],
      activeModel: 1,
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  created() {
    getTreeData().then(data => {
      this.treeData = data;
    });
  },

  methods: {
    handleNodeClick(data) {
      this.checkItem = data;
    },
    onCard(item) {
      this.activeWrap = item;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onModel(item) {
      let {value} = item;

      if (this.activeModel === value) {
        return
      }

      this.activeModel = value;

      let length = value * value;
      let wrapList = [...this.wrapList]
      if (length > this.wrapList.length) {
        let addLength = length - this.wrapList.length;
        for (let i = 0; i < addLength; i++) {
          wrapList.push({key: PublicService.RandomId(10)})
        }
      } else {
        wrapList = wrapList.splice(0, length);
        this.activeWrapIndex = wrapList.length - 1;
      }
      this.wrapList = [...wrapList];
    }
  },

};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100vh - 125px);
  display: flex;
  padding: 10px;
}

.right, .left, .center {
  height: 100%;
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow-y: auto;
}

.left {
  width: 240px;
  padding: 10px;
}

.center {
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;

  .content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    .contentItem {
      background: #000;
      border: 2px solid #CCCCCC;
    }

    .activeCard {
      border: 2px solid #ff0000;
    }
  }

  .footer {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .footItem {
      margin: 0 10px;
      background: #e9e9e9;
      padding: 4px 20px;
      border-radius: 2px;
      cursor: pointer;
      color: #454545;

      i {
        margin-right: 4px;
      }
    }
    .activeFootItem {
      color: #1890ff;
    }
  }

}

.right {
  width: 300px;
  max-height: 100%;
  overflow-y: auto;
}

</style>
