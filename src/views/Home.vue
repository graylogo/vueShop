<template>
  <div class="container">
    <el-button @click="logOut" type="warning">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    logOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
      this.$message.warning("退出登陆！");
    },
  },
};
</script>

<style scoped lang="scss"></style>
