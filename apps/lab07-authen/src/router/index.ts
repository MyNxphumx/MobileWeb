import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import { authService } from "@/auth/auth-service";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/tab1",
  },

  // ===== Login Page =====
  {
    path: "/login",
    component: () => import("@/views/LoginPage.vue"),
  },

  // ===== Tabs (ต้อง login ก่อน) =====
  {
    path: "/tabs",
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/tabs/tab1",
      },
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ===== Auth Guard (SAFE VERSION) =====
router.beforeEach(async (to) => {
  // รอ Firebase auth พร้อมก่อน
  const user = await authService.waitForAuthReady();

  // login แล้ว ห้ามเข้า /login
  if (to.path === "/login" && user) {
    return "/tabs/tab1";
  }

  // ยังไม่ login แต่จะเข้า route ที่ต้อง auth
  if (to.meta.requiresAuth && !user) {
    return "/login";
  }

  return true;
});

export default router;
