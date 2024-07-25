import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// stores
import { useAuthStore } from "../store/auth";

// components
import LoginPage from "../views/Authentication/LoginPage.vue";
import ProductPage from "../views/Authenticated/ProductPage.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: ProductPage, meta: { requiresAuth: true } },
  { path: "/login", component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect to login if not authenticated
  } else {
    next(); // Allow navigation
  }
});

export default router;
