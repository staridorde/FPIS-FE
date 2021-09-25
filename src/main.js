import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'bulma/css/bulma.css'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'

createApp(App).use(router)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
