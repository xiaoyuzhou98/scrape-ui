import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err);
};

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/IndexView.vue"),
  },
  {
    path: "/images",
    name: "Images",
    component: () => import("@/views/images/IndexView.vue"),
  },
  {
    path: "/videos",
    name: "Videos",
    component: () => import("@/views/videos/IndexView.vue"),
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@/views/setting/IndexView.vue"),
  },
  { path: "*", redirect: "/" },
];

const router = new VueRouter({
  routes,
});

export default router;
