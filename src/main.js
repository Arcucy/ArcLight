// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index.js'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import APlayer from '@moefe/vue-aplayer'

Vue.use(Buefy)
Vue.use(APlayer)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
