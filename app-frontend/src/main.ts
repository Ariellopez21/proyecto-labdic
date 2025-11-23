// src/main.ts
import 'primeicons/primeicons.css'
import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.ts'
import setupPrimeVue from './plugins/primevue'
import setupPinia from './plugins/pinia.ts'

const app = createApp(App)

app.use(router)

setupPinia(app)
// Register PrimeVue and related plugins
setupPrimeVue(app)

app.mount('#app')
