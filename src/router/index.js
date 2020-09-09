import Vue from 'vue'
import Router from 'vue-router'

import Landing from '@/pages/Landing.vue'
import Music from '@/pages/Music/_id.vue'
import MusicMenu from '@/pages/Music.vue'
import Songs from '@/pages/Songs/Index'
import SongsSingles from '@/pages/Songs/Singles'
import SongsAlbums from '@/pages/Songs/Albums'
import User from '@/pages/User/_id'
import Library from '@/pages/Library'

import Upload from '@/pages/Upload/Index.vue'
import UploadSingle from '@/pages/Upload/Single.vue'
import ReviewSingle from '@/pages/Upload/ReviewSingle.vue'
import UploadAlbum from '@/pages/Upload/Album.vue'
import UploadPodcast from '@/pages/Upload/Podcast.vue'
import UploadSoundEffect from '@/pages/Upload/SoundEffect'
import Sound from '@/pages/Sound/Index'
import Podcast from '@/pages/Podcast/Index'
import Test from '@/pages/Upload/Test.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/upload/single',
      name: 'uploadSingle',
      component: UploadSingle
    },
    {
      path: '/review/single',
      name: 'ReviewSingle',
      component: ReviewSingle
    },
    {
      path: '/upload/album',
      name: 'uploadAlbum',
      component: UploadAlbum
    },
    {
      path: '/upload/podcast',
      name: 'uploadPodcast',
      component: UploadPodcast
    },
    {
      path: '/upload/soundeffect',
      name: 'uploadSoundEffect',
      component: UploadSoundEffect
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
    },
    {
      path: '/sound',
      name: 'Sound',
      component: Sound
    },
    {
      path: '/podcast',
      name: 'Podcast',
      component: Podcast
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User,
      props: true
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    }
  ]
})
