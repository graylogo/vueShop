<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%"
        height="calc(100vh - 180px)"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px"
        />
        <el-table-column prop="authName" label="权限名称" align="center">
        </el-table-column>
        <el-table-column prop="path" label="路径" align="center">
        </el-table-column>

        <el-table-column prop="level" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="danger">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="warning">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="success">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data: res } = await this.axios.get(`rights/list`);
      this.tableData = res.data;
    },
  },
};
</script>
<style scoped lang="scss">
.el-table {
  margin: 0;
}
</style>
