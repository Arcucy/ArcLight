import Vue from 'vue'
import VueRouter from 'vue-router'

import Landing from '../pages/Landing.vue'
import Music from '../pages/Music/_id.vue'
import Album from '../pages/Album/_id.vue'

import Songs from '../pages/Songs/Index'
import SongsSingles from '../pages/Songs/Singles'
import SongsAlbums from '../pages/Songs/Albums'
import Sound from '../pages/Sound/Index'
import Podcast from '../pages/Podcast/Index'
import Playlist from '../pages/Playlist/index'

import User from '../pages/User/_id'
import UserIndex from '../pages/User/index'

import UserSingle from '../pages/User/Single'
import UserAlbum from '../pages/User/Album'
import UserSound from '../pages/User/Sound'
import UserPodcast from '../pages/User/Podcast'

import Edit from '../pages/User/Edit.vue'
import Library from '../pages/Library'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/Index.vue')
  },
  {
    path: '/upload/single',
    name: 'uploadSingle',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/Single.vue')
  },
  {
    path: '/review/single',
    name: 'ReviewSingle',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/ReviewSingle.vue')
  },
  {
    path: '/upload/album',
    name: 'uploadAlbum',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/Album.vue')
  },
  {
    path: '/review/album',
    name: 'ReviewAlbum',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/ReviewAlbum.vue')
  },
  {
    path: '/upload/podcast',
    name: 'uploadPodcast',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/Podcast.vue')
  },
  {
    path: '/review/podcast',
    name: 'ReviewPodcast',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/ReviewPodcast.vue')
  },
  {
    path: '/upload/soundeffect',
    name: 'uploadSoundEffect',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/SoundEffect.vue')
  },
  {
    path: '/review/soundeffect',
    name: 'ReviewSoundEffect',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/Upload/ReviewSoundEffect.vue')
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
    path: '/playlist',
    name: 'Playlist',
    component: Playlist
  },
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',
        name: 'User',
        component: UserIndex,
        props: true
      },
      {
        path: 'single',
        name: 'UserSingle',
        component: UserSingle,
        props: true
      },
      {
        path: 'album',
        name: 'UserAlbum',
        component: UserAlbum,
        props: true
      },
      {
        path: 'sound',
        name: 'UserSound',
        component: UserSound,
        props: true
      },
      {
        path: 'podcast',
        name: 'UserPodcast',
        component: UserPodcast,
        props: true
      }
    ]
  },
  {
    path: '/user/:id/edit',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  }
]

const router = new VueRouter({
  routes
})

export default router
