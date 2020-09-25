import Vue from 'vue'
import Router from 'vue-router'

import Landing from '@/pages/Landing.vue'
import About from '@/pages/About.vue'
import Music from '@/pages/Music/_id.vue'
import Album from '@/pages/Album/_id.vue'
import MusicMenu from '@/pages/Music.vue'
import Songs from '@/pages/Songs/Index'
import SongsSingles from '@/pages/Songs/Singles'
import SongsAlbums from '@/pages/Songs/Albums'
import User from '@/pages/User/_id'
import Edit from '@/pages/User/Edit.vue'
import Library from '@/pages/Library'

import Upload from '@/pages/Upload/Index.vue'
import UploadSingle from '@/pages/Upload/Single.vue'
import ReviewSingle from '@/pages/Upload/ReviewSingle.vue'
import UploadAlbum from '@/pages/Upload/Album.vue'
import ReviewAlbum from '@/pages/Upload/ReviewAlbum.vue'
import UploadPodcast from '@/pages/Upload/Podcast.vue'
import ReviewPodcast from '@/pages/Upload/ReviewPodcast.vue'
import UploadSoundEffect from '@/pages/Upload/SoundEffect.vue'
import ReviewSoundEffect from '@/pages/Upload/ReviewSoundEffect.vue'
import Sound from '@/pages/Sound/Index'
import Podcast from '@/pages/Podcast/Index'

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
      path: '/about',
      name: 'About',
      component: About
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
      path: '/review/album',
      name: 'ReviewAlbum',
      component: ReviewAlbum
    },
    {
      path: '/upload/podcast',
      name: 'uploadPodcast',
      component: UploadPodcast
    },
    {
      path: '/review/podcast',
      name: 'ReviewPodcast',
      component: ReviewPodcast
    },
    {
      path: '/upload/soundeffect',
      name: 'uploadSoundEffect',
      component: UploadSoundEffect
    },
    {
      path: '/review/soundeffect',
      name: 'ReviewSoundEffect',
      component: ReviewSoundEffect
    },
    {
      path: '/music/:id',
      name: 'Music',
      component: Music,
      props: true
    },
    {
      path: '/album/:id',
      name: 'Album',
      component: Album,
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
      path: '/user/edit',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    }
  ]
})
