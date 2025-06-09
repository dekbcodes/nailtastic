import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#ff69b4',
          secondary: '#ffb6c1',
          accent: '#ff1493',
          surface: '#ffffff'
        }
      }
    }
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount('#app')