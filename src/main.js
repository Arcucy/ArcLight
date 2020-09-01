// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index.js'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import APlayer from '@moefe/vue-aplayer'

Vue.use(Vuetify)
Vue.use(APlayer)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify(),
  components: { App },
  template: '<App/>'
})
