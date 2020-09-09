// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index.js'
import Aplayer from 'vue-aplayer'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import { Message, Notification } from 'element-ui'

Vue.use(Vuetify)
Vue.use(Message)
Vue.use(Notification)
Vue.component('aplayer', Aplayer)

Vue.prototype.$message = Message
Vue.prototype.$notify = Notification

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify(),
  components: { App, Aplayer },
  template: '<App/>'
})
