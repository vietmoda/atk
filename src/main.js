/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
const app = createApp(App)

// Register Vue-Good-Table
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'
app.use(VueGoodTablePlugin);

// Vue upload file
import VueFileAgentNext from '@boindil/vue-file-agent-next'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'
app.use(VueFileAgentNext);

// Register Toast Notification
import Toast, { POSITION }from "vue-toastification";
import "@/assets/css/custom-toast.scss"; 
app.use(Toast, {
  // Setting the global default position
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2000
});

registerPlugins(app)

app.mount('#app')
