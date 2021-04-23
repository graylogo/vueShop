import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./assets/css/global.css";
import "./assets/css/reset.css";
import "./plugins/element.js";
import "./assets/font-awesome/css/font-awesome.min.css";

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.config.productionTip = false;
Vue.prototype.axios = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
