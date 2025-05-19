import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";
import Demo from "@/views/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Index" },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index.vue"),
        meta: {
          title: "主页"
        }
      },
      {
        path: "music",
        name: "Music",
        component: () => import("@/views/creator/music.vue"),
        meta: {
          title: "创作"
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/user/profile.vue"),
        meta: {
          title: "我的",
          noCache: true
        }
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
          noCache: true
        }
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/register.vue"),
        meta: {
          title: "注册账号",
          noCache: true
        }
      },
      {
        path: "redeem",
        name: "Redeem",
        component: () => import("@/views/user/couponExchange.vue"),
        meta: {
          title: "积分兑换",
          noCache: true
        }
      },
      {
        path: "/play/:id",
        name: "Play",
        component: () => import("@/views/musicPlay.vue"),
        meta: {
          title: "音乐播放",
          noCache: true
        }
      },
      {
        path: "model-create",
        name: "TrainModel",
        component: () => import("@/views/creator/trainModel.vue"),
        meta: {
          title: "模型训练",
          noCache: true
        }
      }
    ]
  }
];

export default routes;
