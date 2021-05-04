<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 100%; height: 80vh"></div>
    </el-card>
  </div>
</template>

<script>
// 导入的方式比较特殊
import * as echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
      value: "",
    };
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      var myChart = echarts.init(document.getElementById("main"));
      let option = [];
      this.axios.get("reports/type/1").then(({ data: res }) => {
        option = _.merge(this.options, res.date);
        myChart.setOption(option);
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
