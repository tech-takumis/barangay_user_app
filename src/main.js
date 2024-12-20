import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { initializeEcho } from './services/echo'
const token = localStorage.getItem('authToken')

if(token)
{
    initializeEcho(token)
}

const app = createApp(App)
const pinia = createPinia()

app.use(
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    }),
    pinia.use(piniaPluginPersistedState)
)

app.use(router)
app.mount('#app')
