<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        style="float: right; margin-bottom: 5px"
        @click="addCate"
        >添加分类</el-button
      >
      <el-table
        :data="list"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        style="width: 100%"
        row-key="cat_id"
        border
        height="calc(100vh - 220px)"
        :default-expand-all="false"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_pid === 0">
              <i class="fa fa-genderless" aria-hidden="true"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" align="left">
        </el-table-column>
        <el-table-column
          prop="cat_deleted"
          label="是否有效"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <i
              v-if="!scope.row.cat_deleted"
              class="fa fa-check-circle"
              style="color: #04c161; font-size: 18px"
              aria-hidden="true"
            ></i>
            <i
              v-if="scope.row.cat_deleted"
              class="fa fa-times-circle"
              style="color: #bf4631; font-size: 18px"
              aria-hidden="true"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="排序"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" type="danger">一级</el-tag>
            <el-tag v-if="scope.row.cat_level === 1" type="warning"
              >二级</el-tag
            >
            <el-tag v-if="scope.row.cat_level === 2" type="success"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.cat_id)"
            >
              <el-button size="mini" type="danger" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="params.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addVisiable"
      width="500px"
      :close-on-click-modal="false"
      @close="resetDialog('addForm')"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKey"
            placeholder="不选择代表第一级分类"
            :options="fatherList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              checkStrictly: true,
            }"
            clearable
            style="width: 100%"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="editVisiable"
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
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: [],
      params: {
        pagenum: 1,
        pagesize: 10,
      },
      totalNum: 0,
      addVisiable: false,
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      addForm: {
        //   如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        cat_name: "",
        //   `0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0,
      },
      editForm: {
        cat_name: "",
      },
      editVisiable: false,
      //    选中的项
      selectKey: [],
      fatherList: [],
      currentRow: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.axios
        .get("categories", { params: this.params })
        .then(({ data: res }) => {
          this.totalNum = res.data.total;
          this.list = res.data.result;
          this.loading = false;
        });
    },
    sizeChange(val) {
      this.params.pagesize = val;
      this.fetchData();
    },
    currentChange(val) {
      this.params.pagenum = val;
      this.fetchData();
    },
    handleDelete(id) {
      this.axios.delete(`categories/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return false;
        }
        this.$message.success(res.meta.msg);
        this.fetchData();
      });
    },
    handleEdit(row) {
      this.currentRow = row;
      this.editForm.cat_name = row.cat_name;
      this.editVisiable = true;
    },
    addCate() {
      this.getFatherList();
      this.addVisiable = true;
    },
    getFatherList() {
      this.axios
        .get("categories", { params: { type: 2 } })
        .then(({ data: res }) => {
          this.fatherList = res.data;
        });
    },
    handleChange() {
      const len = this.selectKey.length;
      if (len > 0) {
        // 存在，说明选择了
        this.addForm.cat_pid = this.selectKey[len - 1];
        this.addForm.cat_level = len;
      } else {
        // 没有选择，默认0
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    submitAdd() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return;
        this.axios.post("categories", this.addForm).then(({ data: res }) => {
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg);
            return false;
          }
          this.$message.success(res.meta.msg);
          this.addVisiable = false;
          this.fetchData();
        });
      });
    },
    resetDialog(name) {
      this.$refs[name].resetFields();
      this.selectKey = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
    },
    submitEdit() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.axios
          .put(`categories/${this.currentRow.cat_id}`, this.editForm)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
              return false;
            }
            this.$message.success(res.meta.msg);
            this.editVisiable = false;
            this.fetchData();
          });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-button {
  margin: 0 5px;
}
.el-pagination {
  position: absolute;
  bottom: 15px;
  right: 30px;
}
</style>
