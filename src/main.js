// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index.js'
import Aplayer from 'vue-aplayer'
import i18n from '@/locales'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import moment from 'moment'
moment.locale('en-US')

Vue.use(Vuetify)
Vue.use(ElementUI)
Vue.component('aplayer', Aplayer)

Vue.prototype.$message = ElementUI.Message
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$moment = moment

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  vuetify: new Vuetify(),
  components: { App, Aplayer },
  template: '<App/>'
})
