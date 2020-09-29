<template>
  <spaceLayout>
    <div class="music">
      <!-- Back Button -->
      <div class="music-header">
        <a @click="$router.go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="header-title">
            <span class="header-title-text">
              {{ info.name || 'Back' }}
            </span>
            <span class="header-title-back">
              Back
            </span>
          </span>
        </a>
      </div>
      <div class="music-info">
        <div class="music-cover-container">
          <v-img
            v-if="imgShoudLoad"
            class="albuminfo-cover-img"
            :src="info.cover"
            alt="cover"
            aspect-ratio="1"
          >
            <template v-slot:placeholder>
              <div class="albuminfo-cover-img-loading">
                <v-progress-circular indeterminate color="#E56D9B" />
              </div>
            </template>
          </v-img>
        </div>
        <div class="music-info-container">
          <div class="music-title-container">
            <span v-if="type !== 'soundeffect-info'" class="music-title">
              {{ info.genre }}
            </span>
              {{ info.name }}
          </div>
          <div class="mobile mobile-music-title-container">
            <span class="genre">{{ info.genre }}</span>
            <span class="title">{{ info.name }}</span>
          </div>
          <div v-if="this.info.albumTitle" class="music-title-album">
            <router-link :to="{ name: 'Album', params: { id: $route.params.id } }">
              <v-icon color="#D85C8B">mdi-album</v-icon> {{ this.info.albumTitle }}
            </router-link>
          </div>
          <div class="music-title-artist">
            <router-link class="music-artist-username" :to="{ name: 'User', params: { id: artist.id } }">
              <v-icon color="#D85C8B">mdi-account-music</v-icon>{{ artist.username }}
            </router-link>
          </div>
          <div class="music-title-desp">
            <span v-html="info.desp" class="desp-text"></span>
          </div>
        </div>
      </div>
      <div class="music-playerbox">
        <div v-if="loading && pct" class="music-playerbox-tag">
          {{ pct }}%
        </div>
        <!-- Player -->
        <aplayer v-if="audio !== '' && !loading" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" />
        <!-- No trial version -->
        <div v-if="audio === '' && !loading" class="music-loading">
          <p>
            There is no demo version of this artwork
          </p>
        </div>
        <!-- Loading -->
        <div v-if="loading" class="music-loading">
          <v-progress-linear
            :indeterminate="!pct"
            v-model="pct"
            color="#E56D9B"
          />
          <p>
            Music loading...
          </p>
        </div>
      </div>
      <!-- Download -->
      <div v-if="(owned || artist.id === wallet || !price) && !loading" class="music-download">
        <a :href="completeAudio.src" :download="info.name + ' - ' + info.artist + '.' + ext" style="text-decoration: none;">
          <v-btn
            block
            large
            light
            outlined
            rounded
            color="#E56D9B"
            :height="44"
          >
            Download
          </v-btn>
        </a>
      </div>
      <!-- Buy -->
      <div v-else-if="!loading && !awaitConfirm" class="music-download">
        <payment
          @purchase-complete="purchaseComplete"
          v-if="artist.id !== wallet && price"
          :artist="artist"
          :wallet="wallet"
          :price="parseFloat(price)"
          :item="info"
          :type="type"
          :itemId="$route.params.id"
          :trackNumber="$route.query.album + ''"
        />
      </div>
      <!-- Await confirm -->
      <div v-if="awaitConfirm" class="music-await">
        <div class="music-await-progress">
          <v-progress-circular indeterminate color="#E56D9B" />
        </div>
        <div class="music-await-text">
          <h4>
            「Buy」please wait. . .
          </h4>
          <p>
            Waiting for the transaction to be merged into a new block, this may take a few minutes. You can leave this page and do something else.
          </p>
        </div>
      </div>
      <!-- Payed Users -->
      <!-- <div class="music-sold">
        <p class="music-sold-title">
          These users have already bought this song.
        </p>
        <div class="music-sold-users">
          <div
            class="user-card"
            v-for="(user, index) in users"
            :key="index"
            :style="'z-index:' + -index"
          >
            <miniAvatar :size="38" :src="user.avatar" />
          </div>
        </div>
      </div> -->
      <!-- Artist -->
      <div class="music-artist">
        <router-link :to="{ name: 'User', params: { id: artist.id } }">
          <miniAvatar :size="64" color="#E56D9B" :src="artist.avatar" />
        </router-link>
        <router-link class="music-artist-username" :to="{ name: 'User', params: { id: artist.id } }">
          {{ artist.username }}
        </router-link>
      </div>
    </div>
    <!-- Pay Dialog -->
    <v-dialog
      v-model="showDialog"
      width="360"
    >
      <v-card dark>
        <div class="pay">
          <h3 class="pay-title">
            Payment of 「{{ info.name }}」
          </h3>
          <div class="pay-icon">
            <img src="@/assets/image/paymentCompleted.png" alt="Completed" />
          </div>
          <p class="pay-intro">
            Succeed to unlock the music！
          </p>

          <v-btn class="pay-button" depressed color="#E56D9B" block @click="showDialog = false">
            BACK TO MUSIC PLAYER
            <v-icon class="pay-button-icon">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </spaceLayout>
</template>

<script>
import { mapState } from 'vuex'

import api from '@/api/api'
import decode from '@/util/decode'
import audioUtil from '@/util/audio'

import spaceLayout from '@/components/Layout/Space'
import miniAvatar from '@/components/User/MiniAvatar'
import payment from '@/components/Payment'

export default {
  components: {
    payment,
    spaceLayout,
    miniAvatar
  },
  data () {
    return {
      type: '',
      musicId: '',
      auditionClip: '',
      completeAudio: '',
      imgShoudLoad: true,
      awaitConfirm: false,
      info: {
        name: 'Title loading...',
        artist: '',
        artistId: '',
        desp: '',
        genre: 'Await Data...',
        cover: 'undefined',
        albumTitle: '',
        duration: 0,
        id: ''
      },
      artist: {
        id: '',
        avatar: 'loading',
        username: 'Artist loading...'
      },
      pct: 0,
      price: 0,
      albumPrice: 0,
      owned: false,
      showDialog: false,
      loading: true,
      timerIndex: null
    }
  },
  computed: {
    ...mapState(['wallet']),
    ext () {
      const getExt = {
        'audio/mp3': 'mp3',
        'audio/flac': 'flac',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      }
      return getExt[this.musicType]
    },
    audio () {
      const unlock = this.owned || this.artist.id === this.wallet || !this.price
      return unlock || this.info.duration === -1 ? this.completeAudio : this.auditionClip
    }
  },
  mounted () {
    this.getMusicInfo(this.$route.params.id)
    window.vueTest = this
  },
  watch: {
    $route (val) {
      this.loading = true
      this.imgShoudLoad = false
      this.auditionClip = ''
      this.completeAudio = ''
      this.info.cover = 'undefined'
      this.pct = 0
      this.owned = false
      setTimeout(() => {
        this.imgShoudLoad = true
      })
      this.getMusicInfo(this.$route.params.id)
    },
    wallet (val) {
      if (this.info.artistId === val) {
        this.owned = true
      } else {
        this.owned = false
        this.awaitConfirm = false
        clearInterval(this.timerIndex)
        this.getItemStatus(val, this.$route.params.id, this.price)
      }
    }
  },
  destroyed () {
    // 释放 webkitURL
    if (this.auditionClip && this.auditionClip.url) window.webkitURL.revokeObjectURL(this.auditionClip.url)
    if (this.completeAudio && this.completeAudio.url) window.webkitURL.revokeObjectURL(this.completeAudio.url)
    // 卡片或者页面被销毁时清除定时器
    if (this.timerIndex) clearTimeout(this.timerIndex)
  },
  methods: {
    async getItemStatus (address, itemAddress, price) {
      if (!address) {
        this.loading = false
        return
      }
      if (this.type === 'album-info') {
        const res1 = await api.arweave.getAlbumItemPurchaseStatus(address, itemAddress, this.$route.query.album)
        if (res1) {
          const transaction = await this.getBuyTransactionDetail(res1)
          if (!transaction) {
            this.loading = false
            return
          }
          const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(price)))
          const ar = api.arweave.getArFromWinston(transaction.quantity)
          this.awaitConfirm = false
          if (ar === finalPrice) this.owned = true
        } else {
          const res2 = await api.arweave.getAlbumPurchaseStatus(address, itemAddress)
          if (res2) {
            const transaction = await this.getBuyTransactionDetail(res2)
            if (!transaction) {
              this.loading = false
              return
            }
            const tags = await api.arweave.getTagsByTransaction(transaction)
            const type = tags['Album-Type']
            if (type === 'full') {
              const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(this.albumPrice)))
              const ar = api.arweave.getArFromWinston(transaction.quantity)
              this.awaitConfirm = false
              if (ar === finalPrice) this.owned = true
            }
          }
        }
      } else {
        const res3 = await api.arweave.getItemPurchaseStatus(address, itemAddress)
        if (res3) {
          const transaction = await this.getBuyTransactionDetail(res3)
          if (!transaction) {
            this.loading = false
            return
          }
          const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(price)))
          const ar = api.arweave.getArFromWinston(transaction.quantity)
          this.awaitConfirm = false
          if (ar === finalPrice) this.owned = true
        }
      }
      this.loading = false
    },
    async getBuyTransactionDetail (txid) {
      let transaction
      try {
        transaction = await api.arweave.getTransactionDetail(txid)
      } catch (e) {
        if (e.type === 'TX_PENDING') {
          this.awaitConfirm = true
          this.timerIndex = setTimeout(() => { this.getItemStatus(this.wallet, this.$route.params.id, this.price) }, 2000)
        } else {
          console.error('[Purchase record query failed] type:', { ...e }.type, txid, e)
          this.$message.error(`Purchase record query failed, type: ${{ ...e }.type || 'Unknown'}`)
          this.awaitConfirm = false
        }
      }
      return transaction
    },
    /** 获取音乐信息 */
    async getMusicInfo (id) {
      this.loading = true
      try {
        const transaction = await api.arweave.getTransactionDetail(id)
        const tags = await api.arweave.getTagsByTransaction(transaction)
        const data = JSON.parse(decode.uint8ArrayToString(transaction.data))
        this.type = tags.Type
        // 根据类型进行初始化
        switch (tags.Type) {
          case 'single-info': // 单曲
            await this.initSingle(tags, data)
            break
          case 'album-info': // 专辑
            await this.initAlbum(tags, data, this.$route.query.album)
            break
          case 'podcast-info': // 播客
            await this.initPodcast(tags, data)
            break
          case 'soundeffect-info':
            await this.initSoundeffect(tags, data)
            break
          default:
            console.error('[Wrong txid] tags / data:', tags, data)
            this.$message.error('Wrong txid')
            this.$router.replace({ name: 'Landing' })
            return
        }
        this.pct = 0
        this.getItemStatus(this.wallet, this.$route.params.id, this.price)
      } catch (e) {
        console.error('[Failed to get music information]', e)
        this.$message.error('Failed to get music information')
        this.loading = false
      }
    },
    /** 初始化单曲 */
    async initSingle (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介、类型
      audio.title = data.title
      this.info.name = data.title
      this.info.duration = data.duration

      data.desp = data.desp.replace(/<br>/gm, '\\n')
      data.desp = data.desp.replace(/<[^>]*>/gmu, '')
      data.desp = data.desp.replace(/\\n/gmu, '<br>')

      this.info.desp = data.desp
      this.info.genre = tags['Genre']
      this.price = data.price
      this.info.id = data.music
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      this.info.cover = audio.pic
      const { fullUrl, trialUrl } = await this.getAudio(data.music, data.duration)
      this.completeAudio = { ...audio, src: fullUrl }
      if (trialUrl) {
        this.auditionClip = {
          ...audio,
          title: `「${data.duration}s Demo」 ` + audio.title,
          src: trialUrl
        }
      }

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化专辑 */
    async initAlbum (tags, data, albumNum = 1) {
      this.info.albumTitle = data.title
      const index = albumNum - 1
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介、类型
      audio.title = data.music[index].title
      this.info.name = data.music[index].title
      this.info.duration = data.duration

      data.desp = data.desp.replace(/<br>/gm, '\\n')
      data.desp = data.desp.replace(/<[^>]*>/gmu, '')
      data.desp = data.desp.replace(/\\n/gmu, '<br>')

      this.info.desp = data.desp
      this.info.genre = tags['Genre']
      this.price = data.music[index].price
      this.info.id = data.music[index].id
      this.albumPrice = tags['Price']
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      this.info.cover = audio.pic
      const { fullUrl, trialUrl } = await this.getAudio(data.music[index].id, data.duration)
      this.completeAudio = { ...audio, src: fullUrl }
      if (trialUrl) {
        this.auditionClip = {
          ...audio,
          title: `「${data.duration}s Demo」 ` + audio.title,
          src: trialUrl
        }
      }

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化播客 */
    async initPodcast (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介
      audio.title = data.title
      this.info.name = data.title
      this.info.duration = data.duration

      data.desp = data.desp.replace(/<br>/gm, '\\n')
      data.desp = data.desp.replace(/<[^>]*>/gmu, '')
      data.desp = data.desp.replace(/\\n/gmu, '<br>')

      this.info.desp = data.desp
      this.info.genre = tags['Category']
      this.price = data.price
      this.info.id = data.program
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      this.info.cover = audio.pic
      const { fullUrl, trialUrl } = await this.getAudio(data.program, data.duration)
      this.completeAudio = { ...audio, src: fullUrl }
      if (trialUrl) {
        this.auditionClip = {
          ...audio,
          title: `「${data.duration}s Demo」 ` + audio.title,
          src: trialUrl
        }
      }

      document.title = data.podcast + ' | ' + this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${data.podcast} \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化音效 */
    async initSoundeffect (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介
      audio.title = data.title
      this.info.name = data.title
      this.info.duration = data.duration

      data.desp = data.desp.replace(/<br>/gm, '\\n')
      data.desp = data.desp.replace(/<[^>]*>/gmu, '')
      data.desp = data.desp.replace(/\\n/gmu, '<br>')

      this.info.desp = data.desp
      this.price = data.price
      this.info.id = data.audio
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      this.info.cover = audio.pic
      const { fullUrl, trialUrl } = await this.getAudio(data.audio, data.duration)
      this.completeAudio = { ...audio, src: fullUrl }
      if (trialUrl) {
        this.auditionClip = {
          ...audio,
          title: `「${data.duration}s Demo」 ` + audio.title,
          src: trialUrl
        }
      }

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化作者信息 */
    initArtist (audio, tags) {
      audio.artist = tags['Author-Username']
      this.info.artist = tags['Author-Username']
      this.info.artistId = tags['Author-Address']
      this.getArtist(tags['Author-Address'], audio)
    },
    /** 获取音频 */
    async getAudio (id, duration) {
      try {
        const music = await api.arweave.getMusic(id, pct => { this.pct = pct })
        this.musicType = music.type
        // 完整版的 Url
        const fullUrl = await this.getBase64Url(music)
        // 试听版的 Url
        let trialUrl
        if (duration && duration > 0) trialUrl = await this.getAuditionClip(music.data.buffer, duration)
        return { fullUrl, trialUrl }
      } catch (e) {
        console.error('[Failed to get audio data]', e)
        this.$message.error('Failed to get audio data')
        return { fullUrl: '' }
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
    async getArtist (id, audio) {
      this.artist.id = id
      try {
        const user = await api.arweave.getIdFromAddress(id)
        if (user) {
          this.artist.username = user.data
          this.info.artist = user.data
          if (audio) audio.artist = user.data
        } else {
          this.artist.username = 'unknown'
          this.$message.error('Failed to get author information')
        }
      } catch (e) {
        console.error('[Failed to get author information]', e)
        this.$message.error('Failed to get author information')
      }
      try {
        const avatar = await api.arweave.getAvatarFromAddress(id)
        this.artist.avatar = avatar || ''
      } catch (e) {
        console.error('[Failed to get author avatar]', e)
        this.$message.error('Failed to get author avatar')
        this.artist.avatar = ''
      }
    },
    async getCover (id) {
      try {
        const cover = await api.arweave.getCover(id)
        return cover
      } catch (e) {
        console.error('[Failed to get cover]', e)
        this.$message.error('Failed to get cover')
        return ''
      }
    },
    getTag (data, key) {
      const tags = data.get('tags')
      for (let i = 0; i < tags.length; i++) {
        let newKey = tags[i].get('name', { decode: true, string: true })
        if (newKey === key) return tags[i].get('value', { decode: true, string: true })
      }
    },
    purchaseComplete () {
      this.awaitConfirm = true
      this.getItemStatus(this.wallet, this.$route.params.id, this.price)
    }
  }
}
</script>

<style lang="less" scoped>

.mobile {
  display: none;
}

.music {
  margin: 48px auto 20px;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;

  &-header {
    text-align: left;
    a {
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      font-size: 20px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 25px;

      &:hover {
        i {
          transform: translateX(-5px);
        }
        .header-title {
          &-text {
            transform: translateY(-25px);
            white-space: nowrap;
          }
          &-back {
            transform: translateY(-25px);
          }
        }
      }

      i {
        color: #E56D9B;
      }

      .header-title {
        overflow: hidden;
        height: 25px;
        display: inline-flex;
        flex-direction: column;
        &-text {
          margin: 0;
        }
        &-back {
          margin: 0;
        }
      }
    }
  }

  &-playerbox {
    height: 120px;
    margin: 0 auto;
    max-width: 588px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    &-tag {
      min-width: 60px;
      height: 30px;
      padding: 0 5px;
      margin-left: 5px;
      background: #F9C1D7;
      border-radius: 2px 2px 0px 0px;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 30px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }

  &-player {
    max-width: 588px;
    width: 100%;
    margin: 0;
    // margin: 96px auto 0;
    border-radius: 5px;
    background: #7e7e7e4d;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
    overflow: hidden;
    &::before {
      transition: all 0.3s;
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: 0; right: 0;
      backdrop-filter: blur(2px);
      z-index: -1;
      margin: -30px;
    }
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
    max-width: 588px;
    width: 100%;
    height: 66px;
    // margin: 96px auto 0;
    border-radius: 5px;
    background: #7e7e7e4d;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
    overflow: hidden;
    backdrop-filter: blur(2px);
    p {
      color: white;
      margin: 21px 0 0;
    }
  }

  &-download {
    margin: 30px auto 0;
    max-width: 240px;
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 20px;
      margin: 0 0 8px;
    }
    .free-text {
      color: #66BB6A;
    }
  }

  &-await {
    margin: 30px auto 0;
    max-width: 588px;
    display: flex;
    background: #7e7e7e4d;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
    backdrop-filter: blur(2px);
    overflow: hidden;
    border-radius: 5px;
    padding: 10px;
    &-progress {
      min-height: 66px;
      min-width: 66px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
    }
    &-text {
      text-align: left;
      h4 {
        text-align: left;
        font-size: 16px;
        color: white;
        padding: 0;
        margin: 0 0 10px;
      }
      p {
        text-align: left;
        font-size: 14px;
        color: white;
        padding: 0;
        margin: 0 0 0 6px;
      }
    }
  }

  &-sold {
    margin-top: 24px;
    &-title {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #B2B2B2;
      line-height: 20px;
      margin-bottom: 15px;
    }
    &-users {
      display: flex;
      justify-content: center;
      .user-card {
        width: 38px;
        min-width: 38px;
        height: 38px;
        min-height: 38px;
        margin-left: -19px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  &-artist {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    a {
      text-decoration: none;
    }

    &-username {
      font-size: 14px;
      font-weight: 500;
      color: white;
      line-height: 20px;
      margin: 8px 0 0;
      &:hover {
        color: #E56D9B;
      }
    }
  }

  &-desp {
    width: 720px;
    margin:60px 0 0;
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    color: white;
    line-height: 22px;
  }
}

.music-info {
  display: flex;
  width: 100%;
  margin-top: 20px;
  &-container {
    margin-left: 20px;
  }
}

.albuminfo-cover {
  display: flex;
  width: 280px;
  min-width: 280px;
  margin-right: 20px;
  &-img {
    border-radius:5px;
    width: 250px;
    height: 250px;
    background: #252525;
    &-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
}

.music-title {
  &-container {
    display: flex;
    align-items: center;
    color: white;
    font-size: 24px;
    font-weight: 700;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    text-align: left;
    span {
      margin-right: 8px;
      padding: 8px 16px 8px;
      background-color: #FAE5ED;
      border-radius: 10px;
      font-weight: 700;
      color: #D85C8B;
      white-space: nowrap;
      font-size: 16px;
      display: inline-block;
    }
  }
  &-album {
    margin-top: 10px;
    text-align: left;
    color: white;
    font-size: 20px;
    a {
      text-decoration: none;
      color: white;
      &:hover {
        color: #D85C8B;
      }
    }
  }

  &-artist {
    width: fit-content;
  }

  &-artist a {
    text-decoration: none;
    margin-top: 16px;
    font-size: 20px;
    color: #FFF;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 20px;
    overflow: hidden;
    word-break: break-all;
    text-align: left;
    i {
      margin-right: 10px;
    }
  }
  &-desp {
    margin-top: 10px;
  }
  &-desp > span {
    color: white;
    font-size: 16px;
    text-align: left;
    display: block;
  }
}

.pay {
  padding: 24px;
  &-title {
    text-align: left;
    font-size: 20px;
    font-weight: 500;
    color: white;
    line-height: 28px;
    margin: 0 0 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  &-icon {
    text-align: center;
    margin-bottom: 16px;
    img {
      width: 128px;
      height: 128px;
      min-width: 128px;
      min-height: 128px;
    }
  }
  &-intro {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: white;
    line-height: 22px;
    margin: 0 0 54px;
  }
  &-button {
    &-icon {
      font-size: 16px;
    }
  }
}

@keyframes animTitle {
  0% {
    transform: translateY(-26px);
    opacity: 0;
  }

  30%,
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@media screen and (max-width: 1200px) {

}
@media screen and (max-width: 992px) {
}
@media screen and (max-width: 768px) {
  .music-info {
    display: block;
    &-container {
      margin-top: 16px;
      margin-left: 0px;
    }
  }

  .mobile-music-title-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .genre {
      margin-right: 8px;
      padding: 5px 10px 5px;
      background-color: #FAE5ED;
      border-radius: 5px;
      font-weight: 700;
      color: #D85C8B;
      font-size: 14px;
      white-space: nowrap;
    }
    .title {
      color: white;
      font-size: 18px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-break: break-all;
    }
  }

  .music-title {
    display: none;
    &-container {
      display: none;
      line-height: 30px;
      font-size: 18px !important;
      -webkit-line-clamp: 3;
      margin-bottom: 10px;
      text-align: left;
      .music-title {
        padding: 5px 10px 5px !important;
        font-size: 14px !important;
        border-radius: 5px !important;
        font-size: 14px !important;
      }
    }
    &-artist {
      .music-artist-username {
        margin-top: 2px;
        font-size: 16px !important;
        i {
          font-size: 16px;
        }
      }
    }
    &-album {
      margin-top: 2px;
      a {
        font-size: 16px !important;
        i {
          font-size: 16px;
        }
      }
    }
    &-desp {
      margin-top: 2px;
      span {
        font-size: 14px !important;
      }
    }
  }
}
@media screen and (max-width: 640px) {
  .albuminfo-cover-img {
    height: 100%;
    max-height: 250px;
    width: 100%;
    max-width: 250px;
  }
}
@media screen and (max-width: 480px) {
}
</style>
