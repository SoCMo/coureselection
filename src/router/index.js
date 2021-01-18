import Vue from "vue";
import VueRouter from "vue-router";
import error404 from "../views/error404/error404";
import login from "../group/login/login";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "error404",
    component: error404
  },
  {
    path: "/",
    name: "login",
    component: login
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
