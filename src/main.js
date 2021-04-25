import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./assets/css/global.css";
import "./assets/css/reset.css";
import "./plugins/element.js";
import "./assets/font-awesome/css/font-awesome.min.css";

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// 请求拦截器，设置统一的请求头
axios.interceptors.request.use((config) => {
  config.headers.Authorization = sessionStorage.getItem("token");
  // 必须return出去
  return config;
});

// TODO  1. 断网处理？？？

// TODO 2. 全局的加载动画

Vue.config.productionTip = false;
Vue.prototype.axios = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
