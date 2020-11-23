<template>
  <div v-if="playingAudio && playingAudio.fileId" class="player">
    <div class="player-close" @click="close">
      <v-icon color="white" size="15px" style="-webkit-text-stroke: 1.25px white;">mdi-close</v-icon>
    </div>
    <div class="player-playlist">
      <PlayerPlaylist v-if="showPlaylist" @close="showPlaylist = false" />
    </div>
    <div class="player-main">
      <div class="player-main-skip">
        <div class="player-main-skip-button" :class="playIndex > playList.length - 2 && 'skip-disable'" @click="skip(1)">
          <v-icon>mdi-skip-next</v-icon>
        </div>
        <div class="player-main-skip-button" :class="playIndex < 1 && 'skip-disable'" @click="skip(-1)">
          <v-icon>mdi-skip-previous</v-icon>
        </div>
      </div>

      <!-- Player -->
      <aplayer
        v-if="showAplayer && !loading && music"
        :music="music"
        :lrcType="0"
        @ended="playEnded"
        class="player-main-container"
        theme="#E56D9B"
        autoplay
      />

      <div v-if="loading" class="player-main-loading">
        <div class="player-main-loading-cover">
          <img :src="playingAudio.pic" alt="cover">
        </div>
        <div class="player-main-loading-detail">
          <h4>
            {{ playingAudio.title }}
            <span>
              {{ playingAudio.artist }}
            </span>
          </h4>
          <p>
            <span>
              {{ $t('musicLoading') }}
            </span>
            <span>
              {{ pct ? `${pct}% ` : '' }}
            </span>
          </p>
          <v-progress-linear
            :indeterminate="!pct"
            v-model="pct"
            color="#E56D9B"
            rounded
          />
        </div>
      </div>
      <div class="player-main-playlist" @click="showPlaylist = !showPlaylist">
        <v-icon>mdi-playlist-music</v-icon>
        <p>
          {{ playList.length > 99 ? '99+' : playList.length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-async-promise-executor */
import { mapGetters, mapMutations, mapState } from 'vuex'
import audioUtil from '@/util/audio'
import api from '@/api/api'
import Axios from 'axios'

import PlayerPlaylist from '@/components/PlayerPlaylist.vue'

export default {
  components: {
    PlayerPlaylist
  },
  props: {
  },
  data () {
    return {
      showAplayer: true,
      loading: true,
      pct: 0,
      cancelTokenSource: null,
      showPlaylist: false,
      getFileId: ''
    }
  },
  computed: {
    ...mapState(['audioFileCache', 'playList', 'playIndex']),
    ...mapGetters(['playingAudio']),
    music () {
      if (this.audioFileCache && this.audioFileCache.fileId === this.playingAudio.fileId) {
        const { unlock, duration } = this.playingAudio
        const { fullAudio, auditionClip } = this.audioFileCache
        return unlock || duration === -1 ? fullAudio : auditionClip
      } else return null
    }
  },
  watch: {
    async playingAudio (val) {
      if (val && val.fileId) {
        await this.initAudio(val)
      }
    }
  },
  async mounted () {
    if (this.playingAudio && this.playingAudio.fileId) {
      await this.initAudio(this.playingAudio)
    }
  },
  // 取消侦测器
  destroyed () {
  },
  methods: {
    ...mapMutations(['setAudioFileCache', 'setPlayList', 'setPlayIndex']),
    reloadPlayer () {
      this.showAplayer = false
      setTimeout(() => {
        this.showAplayer = true
      })
    },
    async initAudio (audioInfo) {
      if ({ ...this.audioFileCache }.fileId === audioInfo.fileId) return
      if (this.getFileId === audioInfo.fileId) return
      this.clearOld()
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

      if (fullAudio) {
        this.setAudioFileCache({ fileId: audioInfo.fileId, audioData: { fullAudio, auditionClip, audioType } })
      }
    },
    /** 获取音频 */
    async getAudio (id, duration) {
      try {
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel()
          this.cancelTokenSource = null
          this.pct = 0
        }
        this.getFileId = id
        this.cancelTokenSource = Axios.CancelToken.source()
        const music = await api.arweave.getMusic(id, this.cancelTokenSource.token, pct => { this.pct = pct })
        this.cancelTokenSource = null
        if (!music) return
        // 完整版的 Url
        const fullUrl = await this.getBase64Url(music)
        // 试听版的 Url
        let trialUrl
        if (duration && duration > 0) trialUrl = await this.getAuditionClip(music.data.buffer, duration)
        this.getFileId = ''
        return { fullUrl, trialUrl, audioType: music.type }
      } catch (e) {
        console.error('[Failed to get audio data]', e)
        this.$message.error('Failed to get audio data')
        return { fullUrl: '', audioType: '' }
      }
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
    /** 切换歌曲，数值表示翻页数量，正负控制前后 */
    skip (addend) {
      if (this.playIndex + addend < 0) {
        this.setPlayIndex(0)
      } else if (this.playIndex + addend >= this.playList.length) {
        this.setPlayIndex(this.playList.length - 1)
      } else {
        this.setPlayIndex(this.playIndex + addend)
      }
    },
    clearOld () {
      this.pct = 0
      this.setAudioFileCache({ fileId: '', audioData: undefined })
    },
    close () {
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel()
        this.cancelTokenSource = null
      }
      this.pct = 0
      this.loading = false
      this.setPlayList([])
    },
    playEnded (val) {
      this.skip(1)
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
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  z-index: 1;
  &-main {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    height: 66px;
    background: #adadad4d;
    border-radius: 5px 5px 0 0;
    backdrop-filter: blur(20px);
    padding: 0 10px;
    display: flex;
    justify-content: center;
    &-container {
      flex: 1;
      max-width: 1134px;
      margin: 0;
      background: #ffffff00;
      overflow: hidden;
      box-shadow: none;
      border-radius: 0;
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
      background: #ffffff00;
      display: flex;
      &-cover {
        width: 66px;
        height: 66px;
        overflow: hidden;
        border-radius: 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &-detail {
        flex: 1;
        padding: 0 10px;
        h4 {
          text-align: left;
          font-size: 14px;
          color: #E56D9B;
          margin: 12px 0 2px;
          font-weight: 400;
          span {
            color: white;
            font-size: 12px;
            margin: 0;
          }
        }
        p {
          text-align: left;
          margin: 0 0 2px;
          color: white;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
        }
      }
    }

    &-skip {
      display: flex;
      flex-direction: column;
      &-button {
        height: 33px;
        width: 33px;
        min-width: 33px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        i {
          font-size: 20px;
          color: #b2b2b2;
        }

        &:hover {
          background: #ffffff20;
          i {
            color: white;
          }
        }
        &.skip-disable {
          background: #ffffff00;
          cursor: no-drop;
          i {
            color: #777777;
          }
        }
      }
    }

    &-playlist {
      height: 66px;
      width: 33px;
      min-width: 33px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 20px;
        color: #b2b2b2;
      }
      p {
        color: #b2b2b2;
        font-size: 16px;
        margin: 5px 0 0;
      }

      &:hover {
        background: #ffffff20;
         i {
           color: white;
         }
         p {
           color: white;
         }
      }
    }
  }

  &-close {
    position: absolute;
    right: 30px;
    top: -20px;
    height: 20px;
    width: 40px;
    border-radius: 5px 5px 0 0;
    background: #adadad4d;
    overflow: hidden;
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i {
      color: white;
    }

    &:hover {
      i {
        color: #ff6161;
      }
    }
  }

  &-playlist {
    max-width: 1220px;
    padding: 0 10px;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
}
</style>
