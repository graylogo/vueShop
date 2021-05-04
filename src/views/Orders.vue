<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-calendar v-model="date"> </el-calendar>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
  created() {
    // this.fetchData();
  },
  methods: {
    //   TODO   修改后台代码，改正错误
    // 接口报错，后台停止
    // fetchData() {
    //   this.axios.get("kuaidi/1106975712662").then(({ data: res }) => {
    //     console.log(res);
    //   });
    // },
  },
};
</script>

<style scoped lang="scss"></style>
