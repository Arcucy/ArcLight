<template>
  <spaceLayout>
    <div class="upload-selection-container">
      <div class="selection-title">Choose the type to upload</div>
      <div class="selection-container">
        <router-link :to="{ name: 'uploadSingle' }" id="single" class="upload-cover">
          <v-img :src="cover.single" height="128" width="128" style="margin: 0 10px;" class="selection-cover"/>
          <div class="selection-text">Single</div>
        </router-link>
        <router-link :to="{ name: 'uploadAlbum' }" id="album" class="upload-cover">
          <v-img :src="cover.album" height="128" width="128" style="margin: 0 10px;" class="selection-cover" />
          <div class="selection-text">Album</div>
        </router-link>
        <router-link :to="{ name: 'uploadPodcast' }" id="podcast" class="upload-cover">
          <v-img :src="cover.podcast" height="128" width="128" style="margin: 0 10px;" class="selection-cover" />
          <div class="selection-text">Podcast</div>
        </router-link>
        <router-link :to="{ name: 'uploadSoundEffect' }" id="soundEffect" class="upload-cover">
          <v-img :src="cover.soundeffect" height="128" width="128" style="margin: 0 10px;" class="selection-cover" />
          <div class="selection-text">Sound Effect</div>
        </router-link>
      </div>
    </div>
    <v-snackbar
        v-model="failSnackbar"
        color="#E53935"
        timeout="3000"
        top="top"
      >
        {{ failMessage }}

        <template>
          <v-btn
            dark
            text
            @click="failSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
  </spaceLayout>
</template>

<script>
import { mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space.vue'

import singleImg from '@/assets/image/single.png'
import albumImg from '@/assets/image/album.png'
import podcastImg from '@/assets/image/podcast.png'
import soundEffectImg from '@/assets/image/soundeffect.png'

import { getCookie } from '@/util/cookie'

export default {
  components: {
    spaceLayout
  },
  data () {
    return {
      failMessage: '',
      failSnackbar: false,
      cover: {
        single: singleImg,
        album: albumImg,
        podcast: podcastImg,
        soundeffect: soundEffectImg
      }
    }
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  mounted () {
    const c = getCookie('arclight_userkey')
    setTimeout(() => {
      if (!c || !this.isLoggedIn) {
        this.failMessage = 'Login is required to upload'
        this.failSnackbar = true

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    }, 3000)

    document.title = 'Choose Upload Type - ArcLight'

    const single = document.getElementById('single')
    const album = document.getElementById('album')
    const podcast = document.getElementById('podcast')
    const soundEffect = document.getElementById('soundEffect')

    // Single
    single.addEventListener('mousemove', () => {
      single.style.cssText = 'transform: scale(1.2)'
      album.style.cssText = 'filter: brightness(0.7);'
      podcast.style.cssText = 'filter: brightness(0.7);'
      soundEffect.style.cssText = 'filter: brightness(0.7);'
    })

    single.addEventListener('mouseleave', () => {
      single.style.cssText = 'transform: scale(1);'
      album.style.cssText = ''
      podcast.style.cssText = ''
      soundEffect.style.cssText = ''
    })

    // Album
    album.addEventListener('mousemove', () => {
      album.style.cssText = 'transform: scale(1.2);'
      single.style.cssText = 'filter: brightness(0.7);'
      podcast.style.cssText = 'filter: brightness(0.7);'
      soundEffect.style.cssText = 'filter: brightness(0.7);'
    })

    album.addEventListener('mouseleave', () => {
      album.style.cssText = 'transform: scale(1);'
      single.style.cssText = ''
      podcast.style.cssText = ''
      soundEffect.style.cssText = ''
    })

    // Podcast
    podcast.addEventListener('mousemove', () => {
      podcast.style.cssText = 'transform: scale(1.2);'
      album.style.cssText = 'filter: brightness(0.7);'
      single.style.cssText = 'filter: brightness(0.7);'
      soundEffect.style.cssText = 'filter: brightness(0.7);'
    })

    podcast.addEventListener('mouseleave', () => {
      podcast.style.cssText = 'transform: scale(1);'
      album.style.cssText = ''
      single.style.cssText = ''
      soundEffect.style.cssText = ''
    })

    // SoundEffect
    soundEffect.addEventListener('mousemove', () => {
      soundEffect.style.cssText = 'transform: scale(1.2);'
      album.style.cssText = 'filter: brightness(0.7);'
      podcast.style.cssText = 'filter: brightness(0.7);'
      single.style.cssText = 'filter: brightness(0.7);'
    })

    soundEffect.addEventListener('mouseleave', () => {
      soundEffect.style.cssText = 'transform: scale(1);'
      album.style.cssText = ''
      podcast.style.cssText = ''
      single.style.cssText = ''
    })
  }
}
</script>

<style lang="less" scoped>
.upload-selection-container {
  margin-top: 18rem;
}

.selection-title {
  color: #E56D9B;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.selection-container {
  display: flex;
  margin: 0 auto;
  justify-content: space-around;
  width: 40%;
}

.upload-cover {
  text-decoration: none;
  color: white;

  &:hover {
    animation-name: scaleUp;
    animation-timing-function: ease-in-out;
    animation-duration: 0.5s;
  }

  .selection-text {
    font-size: 1.2rem;
    font-weight: 400;
    margin-top: 1rem;
  }
}

@keyframes scaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>
