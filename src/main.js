import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from "axios";
import store from './store'


const app = createApp(App);

app.use(router);
app.use(store)
app.config.globalProperties.$axios = axios;

app.mount('#app');
