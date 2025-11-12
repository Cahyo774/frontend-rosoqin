import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: "Vue-Toastification__fade",
};

// app.component("DinamicBackground", DinamicBackground);
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

app.mount("#app");
