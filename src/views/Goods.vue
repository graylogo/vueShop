<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="20">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            style="width: 400px"
            class="input-with-icon"
            @keyup.native.enter="fetchData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="fetchData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addProduct"
            style="float: right"
            icon="el-icon-plus"
            size="mini"
          >
            新增</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="calc(100vh - 256px)"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px"
        />
        <el-table-column prop="goods_name" label="商品名称" align="center">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
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
              @confirm="handleDelete(scope.row.goods_id)"
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      params: {
        query: "",
        pagesize: 5,
        pagenum: 1,
      },
      totalNum: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.axios.get("goods", { params: this.params }).then(({ data: res }) => {
        this.tableData = res.data.goods;
        this.totalNum = res.data.total;
      });
    },
    addProduct() {
      this.$router.push("/goods/add");
    },
    handleDelete(id) {
      this.axios.delete(`goods/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return false;
        }
        this.$message.success(res.meta.msg);
        this.fetchData();
      });
    },
    handleEdit(row) {
      // TODO 开发编辑功能
      this.$message.warning("暂未开放！");
      console.log(row);
    },
    sizeChange(val) {
      this.params.pagesize = val;
      this.fetchData();
    },
    currentChange(val) {
      this.params.pagenum = val;
      this.fetchData();
    },
  },
};
</script>

<style scoped lang="scss">
.el-button {
  margin: 0 6px;
}
</style>
