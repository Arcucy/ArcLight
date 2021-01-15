import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Aplayer from 'vue-aplayer'
import i18n from '@/locales'
import moment from 'moment'

import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import './plugins/element.js'
import '@/icons'

Vue.component('aplayer', Aplayer)

Vue.config.productionTip = false

moment.locale('en-US')
Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
