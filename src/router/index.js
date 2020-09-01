import Vue from 'vue'
import Router from 'vue-router'

import Landing from '@/pages/Landing.vue'
import Music from '@/pages/Music/_id.vue'
import MusicMenu from '@/pages/Music.vue'
import Songs from '@/pages/Songs/Index'
import SongsSingles from '@/pages/Songs/Singles'
import SongsAlbums from '@/pages/Songs/Albums'

Vue.use(Router)

export default new Router({
  mode: 'hash',
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
    },
    {
      path: '/songs',
      name: 'Songs',
      component: Songs
    },
    {
      path: '/songs/singles',
      name: 'SongsSingles',
      component: SongsSingles
    },
    {
      path: '/songs/albums',
      name: 'SongsAlbums',
      component: SongsAlbums
    }
  ]
})
