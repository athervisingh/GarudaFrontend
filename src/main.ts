import { createApp } from 'vue'
import App from './App.vue'
import './style.css'                  // ✅ Your global styles
import router from './router'        // ✅ Vue Router instance
import { createPinia } from 'pinia'  // ✅ Pinia for state management
import 'leaflet/dist/leaflet.css';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)      // ✅ Register Pinia globally
app.use(router)     // ✅ Register Vue Router globally
app.mount('#app')   // ✅ Mount the app
