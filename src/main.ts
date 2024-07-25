import "./assets/main.scss";
import "../node_modules/flowbite-vue/dist/index.css";

import ToastPlugin from "vue-toast-notification";
import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";
import "vue-toast-notification/dist/theme-bootstrap.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Use Pinia and Router
app.use(pinia);
app.use(router);
app.use(ToastPlugin);
app.use(PerfectScrollbarPlugin);
app.mount("#app");
