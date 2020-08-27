import Vue from 'vue'
import Router from 'vue-router'

import Landing from '@/pages/Landing.vue'
import Music from '@/pages/Music/_id.vue'
import MusicMenu from '@/pages/Music.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/music/:id',
      name: 'Music',
      component: Music,
      props: true
    },
    {
      path: '/music',
      name: 'MusicMenu',
      component: MusicMenu
    }
  ]
})
