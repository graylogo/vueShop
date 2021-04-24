<template>
  <div class="container">
    <div class="login">
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder=""
              prefix-icon="fa fa-user"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder=""
              prefix-icon="fa fa-lock"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 10,
            message: "长度在 4 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;
        this.axios
          .post("/login", this.loginForm)
          .then(({ data: res, status }) => {
            if (status === 200) {
              this.$message.success("登陆成功！");
              sessionStorage.setItem("token", res.data.token);
              this.$router.push("/home");
            }
          });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2e4e6e;
  .login {
    width: 420px;
    height: 280px;
    background-color: #fff;
    padding: 20px;
    .logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      padding: 5px;
      border: 1px solid #dcdfe6;
      position: absolute;
      background-color: #f2f6fc;
      left: 50%;
      box-shadow: -1px 3px 0 0 #c0c4cc;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      height: 95%;
      .el-form {
        width: 100%;
      }
      .login-btn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
