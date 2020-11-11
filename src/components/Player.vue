<template>
  <div v-if="playingAudio && playingAudio.fileId" class="player">
    <aplayer v-if="showAplayer && !loading && music" :music="music" :lrcType="0" class="player-container" theme="#E56D9B" />
    <div v-if="loading" class="player-loading">
      <p>
        {{ pct ? `(${pct}%) ` : '' }}{{ $t('musicLoading') }}
      </p>
      <v-progress-linear
        :indeterminate="!pct"
        v-model="pct"
        color="#E56D9B"
        rounded
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import audioUtil from '@/util/audio'
import api from '@/api/api'

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      showAplayer: true,
      loading: true,
      pct: 0
    }
  },
  computed: {
    ...mapState(['audioFileCache']),
    ...mapGetters(['playingAudio']),
    music () {
      if (this.audioFileCache && this.audioFileCache.fileId === this.playingAudio.fileId) {
        return this.audioFileCache.fullAudio
      } else return null
    }
  },
  watch: {
    async playingAudio (val) {
      console.log('新音乐', val)
      // this.reloadPlayer()
      if (val && val.fileId) {
        this.clearOld()
        const res = await this.initAudio(val)
        if (res && res.fullAudio) {
          this.setAudioFileCache({fileId: val.fileId, audioData: res})
        }
      }
    }
  },
  async mounted () {
    if (this.playingAudio && this.playingAudio.fileId) {
      const res = await this.initAudio(this.playingAudio)
      if (res && res.fullAudio) {
        this.setAudioFileCache({fileId: this.playingAudio.fileId, audioData: res})
      }
    }
  },
  // 取消侦测器
  destroyed () {
  },
  methods: {
    ...mapMutations(['setAudioFileCache']),
    reloadPlayer () {
      this.showAplayer = false
      setTimeout(() => {
        this.showAplayer = true
      })
    },
    async initAudio (audioInfo) {
      this.loading = true
      const audio = {
        title: audioInfo.title,
        artist: audioInfo.artist,
        pic: audioInfo.pic,
        src: ''
      }
      const { fullUrl, trialUrl, audioType } = await this.getAudio(audioInfo.fileId, audioInfo.duration)
      const fullAudio = { ...audio, src: fullUrl }
      let auditionClip = null
      if (trialUrl) {
        auditionClip = {
          ...audio,
          title: `「${audioInfo.duration}s Demo」 ` + audio.title,
          src: trialUrl
        }
      }
      this.loading = false
      return {
        fullAudio,
        auditionClip,
        audioType
      }
    },
    /** 获取音频 */
    async getAudio (id, duration) {
      // try {
      const music = await api.arweave.getMusic(id, pct => { this.pct = pct })
      // 完整版的 Url
      const fullUrl = await this.getBase64Url(music)
      // 试听版的 Url
      let trialUrl
      if (duration && duration > 0) trialUrl = await this.getAuditionClip(music.data.buffer, duration)
      return { fullUrl, trialUrl, audioType: music.type }
      // } catch (e) {
      //   console.error('[Failed to get audio data]', e)
      //   this.$message.error('Failed to get audio data')
      //   return { fullUrl: '', audioType: '' }
      // }
    },
    /** 将资源加载到一个 url */
    getBase64Url (buffer) {
      return new Promise(async (resolve, reject) => {
        // 挂载音频到一个 URL，并指定给 audio.pic
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob([buffer.data], { type: buffer.type }))
        reader.onload = (event) => {
          const url = window.webkitURL.createObjectURL(new Blob([event.target.result], { type: buffer.type }))
          resolve(url)
        }
      })
    },
    async getAuditionClip (buffer, last) {
      const audioCtx = new AudioContext()
      const audioBuffer = await audioCtx.decodeAudioData(buffer.slice())
      const wave = audioUtil.audioBufferToWave(audioUtil.cutAudio(audioBuffer, 0, last))
      return window.webkitURL.createObjectURL(wave)
    },
    clearOld () {
      this.pct = 0
      this.setAudioFileCache({fileId: '', audioData: undefined})
    }
  }
}
</script>

<style lang="less" scoped>
.player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 66px;
  border-radius: 5px 5px 0 0;
  background: #adadad4d;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  backdrop-filter: blur(20px);
  &-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    background: #ffffff00;
    box-shadow: none;
    /deep/ &.aplayer .aplayer-info {
      padding: 14px 7px 5px 10px;
      .aplayer-music {
        .aplayer-title {
          color: #E56D9B;
        }
        .aplayer-author {
          color: white;
        }
      }
      .aplayer-controller .aplayer-time {
        color: white;
        .aplayer-icon {
          path {
            fill: white;
          }
          &:hover path {
            fill: #E56D9B;
          }
          &.inactive {
            opacity: 0.5;
          }
          &.aplayer-icon-mode {
            display: none;
          }
        }
        .aplayer-volume-wrap .aplayer-volume-bar-wrap {
          &:after {
            background-color: #0000;
            box-shadow: none;
          }
        }
      }
    }
  }

  &-loading {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
    background: #ffffff00;
    p {
      text-align: center;
      margin: 16px 0 10px;
      color: white;
      font-size: 16px;
    }
  }
}
</style>
