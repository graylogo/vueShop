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
