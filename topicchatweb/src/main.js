import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import '../node_modules/bootstrap'
import './assets/perfect-scrollbar/perfect-scrollbar.min.js'

// import VueSession from 'vue-session'
//import VueSessionStorage from "vue-sessionstorage";

const app = createApp(App)
app.use(router)
// app.config.globalProperties.$session = VueSession
// app.provide('$session',VueSession)
//  app.use(VueSession)
app.mount('#app')