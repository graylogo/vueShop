<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="只能选择三级分类列表" type="warning" :closable="false">
      </el-alert>
      <div style="margin: 10px 0">
        <span style="maring-ritht: 15px">商品分类： </span>
        <el-cascader
          v-model="selectKey"
          placeholder="只能选择三级分类列表"
          :options="fatherList"
          :props="{
            expandTrigger: 'hover',
            label: 'cat_name',
            value: 'cat_id',
          }"
          clearable
          style="width: 300px"
          @change="handleChange"
        ></el-cascader>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          style="float: right; margin-top: 5px"
          :disabled="catId === null"
          @click="dialogVisiable = true"
          >添加</el-button
        >
      </div>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-table
              :data="list"
              border
              style="width: 100%"
              height="calc(100vh - 334px)"
            >
              <el-table-column label="#" type="expand">
                <template slot-scope="scope">
                  <el-tag
                    type="success"
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="closeTag(index, scope.row)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    style="width: 160px"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60px"
              />
              <el-table-column label="参数名称" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isEdit">
                    <el-input
                      ref="inputFocus"
                      v-model="scope.row.attr_name"
                      style="width: 90%"
                    ></el-input>
                  </span>
                  <span v-else>{{ scope.row.attr_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200px">
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
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-table
              :data="listTow"
              border
              style="width: 100%"
              height="calc(100vh - 334px)"
            >
              <el-table-column label="#" type="expand">
                <template slot-scope="scope">
                  <el-tag
                    type="success"
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="closeTag(index, scope.row)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    style="width: 160px"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60px"
              />
              <el-table-column label="参数名称" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isEdit">
                    <el-input
                      ref="inputFocus"
                      v-model="scope.row.attr_name"
                      style="width: 90%"
                    ></el-input>
                  </span>
                  <span v-else>{{ scope.row.attr_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200px">
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
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="dialogVisiable"
      width="500px"
      :close-on-click-modal="false"
      @close="resetDialog('editForm')"
    >
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectKey: [],
      fatherList: [],
      activeName: "many",
      list: [],
      listTow: [],
      dialogVisiable: false,
      editForm: {
        attr_name: "",
      },
      addRules: {
        attr_name: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
    catId() {
      return this.selectKey.length === 3 ? this.selectKey[2] : null;
    },
  },
  created() {
    this.getPrams();
  },
  methods: {
    async fetchData(id) {
      if (id === null) return;
      const { data: res } = await this.axios.get(
        `categories/${id}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return false;
      }
      // 对数据进行二次操作，方便使用
      res.data.forEach((item) => {
        item.isEdit = false;
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.list = res.data;
      } else {
        this.listTow = res.data;
      }
    },
    handleChange() {
      if (this.selectKey.length !== 3) {
        //   没有选择三级项目
        this.selectKey = [];
        (this.list = []), (this.listTow = []);
        return;
      }
      this.fetchData(this.catId);
    },
    getPrams() {
      this.axios.get("categories").then(({ data: res }) => {
        console.log(res.data);
        this.fatherList = res.data;
      });
    },
    handleClick(prop) {
      this.activeName = prop.name;
      this.fetchData(this.catId);
    },
    // 关闭标签
    closeTag(index, row) {
      row.attr_vals.splice(index, 1);
      this.updateData(row);
    },
    handleInputConfirm(row) {
      let val = row.inputValue.trim();
      if (!val) {
        // 没有输入有效内容
        row.inputValue = "";
        return;
      } else {
        row.attr_vals.push(val);
        row.inputVisible = false;
        // 清空+ 判断避免事件执行两次（失去焦点和确认键）
        row.inputValue = "";
      }
      this.updateData(row);
    },
    updateData(row) {
      const params = {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(),
      };
      this.axios
        .put(`categories/${this.catId}/attributes/${row.attr_id}`, params)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return false;
          }
          this.$message.success(res.meta.msg);
        });
    },
    showInput(row) {
      row.inputVisible = true;
      row.inputValue = "";
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    resetDialog(name) {
      this.$refs[name].resetFields();
    },
    submitAdd() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        const params = {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        };
        this.axios
          .post(`categories/${this.catId}/attributes`, params)
          .then(({ data: res }) => {
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg);
              return false;
            }
            this.$message.success(res.meta.msg);
            this.dialogVisiable = false;
            this.fetchData(this.catId);
          });
      });
    },
    handleEdit(row) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs.inputFocus.focus();
      });
    },
    handleSave(row) {
      this.updateData(row);
      row.isEdit = false;
    },
    handleDelete(row) {
      this.axios
        .delete(`categories/${this.catId}/attributes/${row.attr_id}`)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return false;
          }
          this.$message.success(res.meta.msg);
          this.fetchData(this.catId);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.el-button {
  margin: 0 6px !important;
}
.el-tag {
  margin: 10px;
}
</style>
