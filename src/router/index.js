import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    redirect: "/welcome",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "/welcome",
        component: () => import("../views/Welcome.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("../views/User.vue"),
      },
      {
        path: "/roles",
        name: "roles",
        component: () => import("../views/Roles.vue"),
      },
      {
        path: "/rights",
        name: "rights",
        component: () => import("../views/Rights.vue"),
      },
      // 商品列表
      {
        path: "/goods",
        name: "goods",
        component: () => import("../views/Goods.vue"),
      },
      // 添加商品
      {
        path: "/goods/add",
        name: "add",
        component: () => import("../views/Add.vue"),
      },

      // 分类参数
      {
        path: "/params",
        name: "params",
        component: () => import("../views/Params.vue"),
      },
      // 商品分类
      {
        path: "/categories",
        name: "categories",
        component: () => import("../views/Categories.vue"),
      },
      // 订单列表
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/Orders.vue"),
      },
      // 数据报表
      {
        path: "/reports",
        name: "reports",
        component: () => import("../views/Reports.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = !!sessionStorage.getItem("token");
  if (to.path === "/login") return next();
  if (!token) return next("/login");
  else return next();
});

export default router;
