import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './tailwind.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
