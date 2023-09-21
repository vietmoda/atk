/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 * 
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// Tham khảo Color Paletter phổ biến: https://colorhunt.co/palettes/popular
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1F8A70',
          secondary: '#00425A',
        },
      },
    },
  },
})
