<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="calc(100vh - 222px)"
      >
        <el-table-column label="#" type="expand">
          <template slot-scope="scope">
            <!-- 第一层 -->
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['border-bottom', index1 === 0 ? 'border-top' : '']"
            >
              <el-col :span="6">
                <el-tag
                  type="danger"
                  closable
                  @close="closeTag(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!-- 第二层 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 !== 0 ? 'border-top' : '']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="closeTag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 第三层 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="success"
                      closable
                      @close="closeTag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px"
        />
        <el-table-column prop="roleName" label="角色名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">
              <el-input
                ref="inputFocus"
                v-model="scope.row.roleName"
                style="width: 90%"
              ></el-input>
            </span>
            <span v-else>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">
              <el-input
                v-model="scope.row.roleDesc"
                style="width: 90%"
              ></el-input>
            </span>
            <span v-else>{{ scope.row.roleDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260px">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-else
              size="mini"
              type="primary"
              :disabled="isAdd"
              @click="handleSave(scope.row)"
              >保存</el-button
            >
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="删除就找不回来了哟，确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button
                size="mini"
                type="danger"
                slot="reference"
                :disabled="scope.row.isEdit"
                >删除</el-button
              >
            </el-popconfirm>
            <el-button
              size="mini"
              type="warning"
              @click="distribute(scope.row)"
              :disabled="scope.row.isEdit"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="add-and-save">
        <el-button v-if="!isAdd" type="primary" round @click="addItem"
          >添加</el-button
        >
        <el-button v-if="isAdd" type="success" round @click="saveItem"
          >保存</el-button
        >
        <el-button v-if="isAdd" type="danger" round @click="delItem"
          >取消</el-button
        >
      </div>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="visiable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      class="dialog-tree"
      @close="closeDialog"
    >
      <div class="tree-list">
        <el-tree
          :data="treeList"
          show-checkbox
          node-key="id"
          ref="treeList"
          default-expand-all
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visiable = false">取 消</el-button>
        <el-button type="primary" @click="subDistribute">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visiable: false,
      currentRow: null,
      tableData: [],
      treeList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      isAdd: false,
      // 已经勾选中的权限
      hasChecked: [],
    };
  },
  created() {
    this.fetchData();
    this.getTreeList();
  },
  methods: {
    // 添加用户
    addItem() {
      this.isAdd = true;
      this.tableData.push({
        roleName: "",
        roleDesc: "",
        isEdit: true,
      });
      this.$nextTick(() => {
        this.$refs.inputFocus.focus();
      });
    },
    // 在页面上删除用户
    delItem() {
      this.tableData.splice(this.tableData.length - 1, 1);
      this.isAdd = false;
    },
    saveItem() {
      const row = this.tableData[this.tableData.length - 1];
      this.axios.post("roles", row).then(({ data: res }) => {
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
          return false;
        }
        this.$message.success(res.meta.msg);
        this.isAdd = false;
        this.fetchData();
      });
    },
    handleEdit(row) {
      console.log(row);
      for (let item of this.tableData) {
        if (row.id === item.id) {
          item.isEdit = true;
          continue;
        }
        item.isEdit = false;
      }
    },
    handleSave(row) {
      const params = {
        roleName: row.roleName,
        roleDesc: row.roleDesc,
      };
      this.axios.put(`roles/${row.id}`, params).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return false;
        }
        this.$message.success(res.meta.msg);
        row.isEdit = false;
        this.fetchData();
      });
    },
    async handleDelete(row) {
      const { data: res } = await this.axios.delete(`roles/${row.id}`);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return false;
      }
      this.$message.success(res.meta.msg);
      this.fetchData();
    },
    // 通过递归获取到所有已勾选的叶子节点
    getCheckNode(obj, arr) {
      if (!obj.children) return arr.push(obj.id);
      obj.children.forEach((item) => {
        return this.getCheckNode(item, arr);
      });
    },
    distribute(row) {
      this.getCheckNode(row, this.hasChecked);
      this.currentRow = row;
      this.visiable = true;
      this.$nextTick(() => {
        this.$refs.treeList.setCheckedKeys(this.hasChecked);
      });
    },
    subDistribute() {
      const rids = [
        ...this.$refs.treeList.getCheckedKeys(),
        ...this.$refs.treeList.getHalfCheckedKeys(),
      ];
      this.axios
        .post(`roles/${this.currentRow.id}/rights`, { rids: rids.join(",") })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          } else {
            this.$message.success(res.meta.msg);
            this.fetchData();
            this.visiable = false;
          }
        });
    },
    fetchData() {
      this.axios.get("roles").then(({ data: res }) => {
        res.data.forEach((item) => {
          item.isEdit = false;
        });
        this.tableData = res.data;
      });
    },
    getTreeList() {
      this.axios.get("rights/tree").then(({ data: res }) => {
        this.treeList = res.data;
      });
    },
    closeDialog() {
      this.hasChecked = [];
    },
    closeTag(row, val) {
      this.$confirm("是否要删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(`roles/${row.id}/rights/${val}`)
            .then(({ data: res }) => {
              console.log(res);
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg);
                return false;
              }
              row.children = res.data;
              this.$message.success(res.meta.msg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.add-and-save {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.el-table {
  margin: 0;
}
.el-tag {
  margin: 10px;
}
.border-top {
  border-top: 1px solid #ccc;
}
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.el-row {
  display: flex;
  align-items: center;
}
.dialog-tree {
  .el-dialog {
    // margin-top: 5vh !important;
    .tree-list {
      max-height: 60vh;
      overflow: scroll;
    }
  }
}
.el-button {
  margin: 0 5px;
}
</style>
