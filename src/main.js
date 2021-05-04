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

// 定义全局的时间过滤器
Vue.filter("dateFormate", function (val) {
  // 因为使用的是unix时间戳，所以要*1000
  const date = new Date(val * 1000);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + "").padStart(2, "0");
  const d = (date.getDate() + "").padStart(2, "0");
  const h = (date.getHours() + "").padStart(2, "0");
  const mm = (date.getMinutes() + "").padStart(2, "0");
  const s = (date.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
});

// TODO  1. 断网处理？？？

// TODO 2. 全局的加载动画

Vue.config.productionTip = false;
Vue.prototype.axios = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
