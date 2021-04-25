// vue.config.vue用于自定义配置
// 自定义启动端口

module.exports = {
  // 修改打包路径为相对路径
  //   publicPath: "./",
  configureWebpack: {
    devServer: {
      port: 8086, // 端口号
      open: true,
      // Mock数据
      // before(app){

      // }
    },
  },
};
