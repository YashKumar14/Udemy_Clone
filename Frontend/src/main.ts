import "@ant-design/icons-vue";
import Antd from "ant-design-vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "../public/global.css";
import store from "./utils/vueStore.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Antd);
app.mount("#app");

store.dispatch("initializeCourses");
