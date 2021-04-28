<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="20">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            style="width: 400px"
            class="input-with-icon"
            @keyup.native.enter="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="visiable = true"
            style="float: right"
            icon="el-icon-plus"
          >
            新增</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="calc(100vh - 245px)"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px"
        />
        <el-table-column prop="username" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="role_name" label="身份" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" width="160px">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          align="center"
          width="140px"
        >
        </el-table-column>
        <el-table-column prop="mg_state" label="用户状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
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
              @confirm="handleDelete(scope.row)"
            >
              <el-button size="mini" type="danger" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>

            <el-popover
              placement="top"
              trigger="manual"
              width="320"
              v-model="scope.row.visiable"
            >
              <el-row type="flex" justify="space-between">
                <el-col>
                  <el-select
                    v-model="roleId"
                    placeholder="请选择"
                    style="width: 180px"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>

                  <el-button
                    type="primary"
                    size="mini"
                    @click="submitEnter(scope.row)"
                    >确定</el-button
                  >
                  <el-button
                    size="mini"
                    type="info"
                    @click="scope.row.visiable = false"
                    >取消</el-button
                  >
                </el-col>
              </el-row>
              <el-button
                size="mini"
                type="warning"
                slot="reference"
                @click="distribute(scope.row)"
                >分配角色</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改用户"
      :visible.sync="editVisiable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      @close="closeDialog('editDialog')"
    >
      <el-form
        :model="editDialog"
        :rules="rules"
        ref="editDialog"
        label-position="right"
        class="add-dialog"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editDialog.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editDialog.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editDialog.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增用户"
      :visible.sync="visiable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      @close="closeDialog('addDialog')"
    >
      <el-form
        :model="addDialog"
        :rules="rules"
        ref="addDialog"
        label-position="right"
        class="add-dialog"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addDialog.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addDialog.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addDialog.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addDialog.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visiable = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      if (!value) return callback(new Error("邮箱不能为空！"));
      const reg = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
      if (!reg.test(value)) callback(new Error("请输入正确的邮箱！"));
      callback();
    };
    const checkMobile = (rule, value, callback) => {
      if (!value) return callback();
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) callback(new Error("请输入正确的电话号码！"));
      callback();
    };
    return {
      tableData: [],
      params: {
        query: "",
        pagenum: 1,
        pagesize: 20,
      },
      totalNum: 0,
      visiable: false,
      editVisiable: false,
      addDialog: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editDialog: {
        username: "",
        id: "",
        email: "",
        mobile: "",
      },
      roleId: "",
      roleList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在3-12个字符之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6-16个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getUserList();
    this.getRoles();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.axios.get("users", {
        params: this.params,
      });
      res.data.users.forEach((item) => {
        item.visiable = false;
      });
      this.totalNum = res.data.total;
      this.tableData = res.data.users;
    },
    changeStatus(row) {
      this.axios
        .put(`users/${row.id}/state/${row.mg_state}`)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    sizeChange(val) {
      this.params.pagesize = val;
      this.getUserList();
    },
    currentChange(val) {
      this.params.pagenum = val;
      this.getUserList();
    },
    handleEdit(row) {
      this.axios.get(`users/${row.id}`).then(({ data: res }) => {
        this.editDialog.id = res.data.id;
        this.editDialog.username = res.data.username;
        this.editDialog.email = res.data.email;
        this.editDialog.mobile = res.data.mobile;
        this.editVisiable = true;
      });
    },
    handleDelete(row) {
      this.axios.delete(`users/${row.id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return false;
        }
        this.$message.success(res.meta.msg);
        this.getUserList();
      });
    },
    submitEdit() {
      this.axios
        .put(`users/${this.editDialog.id}`, this.editDialog)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg);
            return false;
          }
          this.$message.success(res.data.meta.msg);
          this.editVisiable = false;
          this.getUserList();
        });
    },
    submitAdd() {
      this.axios.post("users", this.addDialog).then((res) => {
        if (res.data.meta.status !== 201) {
          this.$message.error(res.data.meta.msg);
          return false;
        }
        this.$message.success(res.data.meta.msg);
        this.visiable = false;
        this.getUserList();
      });
    },
    closeDialog(name) {
      this.$refs[name].resetFields();
    },
    // 分配角色确定
    submitEnter(row) {
      this.axios
        .put(`users/${row.id}/role`, { rid: this.roleId })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return false;
          }
          this.$message.success(res.meta.msg);
          row.visiable = false;
          this.getUserList();
        });
    },
    // 点击分配权限
    distribute(row) {
      this.roleId = "";
      for (let item of this.tableData) {
        if (item.id === row.id) {
          item.visiable = true;
        } else {
          item.visiable = false;
        }
      }
    },
    // 获取角色列表
    getRoles() {
      this.axios.get("roles").then(({ data: res }) => {
        this.roleList = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-pagination {
  position: absolute;
  bottom: 15px;
  right: 30px;
}
.add-dialog {
  .el-input {
    width: 300px;
  }
}
.el-button {
  margin: 0 5px;
}
</style>
