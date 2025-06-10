import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/main.css'

// Toast notifications - temporarily disabled until dependencies are fixed
// import Toast from "vue-toastification"
// import "vue-toastification/dist/index.css"

console.log('🚀 Starting Vue app...')

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

console.log('✅ App mounted successfully!')
