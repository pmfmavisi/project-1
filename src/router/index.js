import { createRouter, createWebHistory } from "vue-router";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import Home from "../components/home.vue";
// import Layout from "../layout/AppLayout.vue";
import { auth } from "../assets/firebase";
import List from "../components/list.vue";
const routes = [
  {
    path: "/",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/list",
    name: "list",
    component: List,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: "/dashboard",
  //   name: "dashboard",
  //   component: Layout,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login" && auth.currentUser) {
    next("/home");
    return;
  }
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.currentUser
  ) {
    next("/login");
    return;
  }
  next();
});

export default router;
