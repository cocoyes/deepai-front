import { createApp } from "vue";
import { store } from "./store";
import { useUserStore } from "./store/user";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
import "virtual:svg-icons-register";
import { initializeDarkMode } from "@/utils/dark-mode";
import App from "./App.vue";
import router from "./router";
import { Toast } from 'vant'

initializeDarkMode();

const app = createApp(App);

app.use(store);
app.use(router);
// 恢复登录状态
const userStore = useUserStore();
userStore.loadToken();
app.use(Toast)
app.mount("#app");
