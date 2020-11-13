<template>
  <spaceLayout>
    <div class="music">
      <!-- Back Button -->
      <div class="music-header">
        <a @click="backPage({ name: 'Songs' })">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="header-title">
            <span class="header-title-text">
              {{ info.name || $t('back') }}
            </span>
            <span class="header-title-back">
              {{ $t('back') }}
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
            <v-tooltip top :disabled="!toGenre.name">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <router-link
                    v-if="type !== 'soundeffect-info'"
                    class="music-title-genre"
                    :class="!toGenre.name && 'no-click'"
                    :to="toGenre"
                  >
                    {{ info.genre }}
                  </router-link>
                </span>
              </template>
              <span>{{ $t('viewSimilarArtwork') }}</span>
            </v-tooltip>
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
          <!-- 交互 -->
          <div v-if="!loading" class="music-info-control">
            <!-- 播放 -->
            <v-btn
              v-if="unlock || info.duration !== 0"
              class="music-info-control-play"
              color="#e56d9b"
              @click="playAudio"
            >
              <v-icon color="white" size="20px">mdi-play</v-icon>
              {{ unlock || info.duration === -1 ? $t('play') : $t('playDemo') }}
            </v-btn>
            <!-- 购买 -->
            <payment
              v-if="!unlock && !awaitConfirm"
              @purchase-complete="purchaseComplete"
              :artist="artist"
              :wallet="wallet"
              :price="parseFloat(price)"
              :item="info"
              :type="type"
              :itemId="$route.params.id"
              :trackNumber="$route.query.album + ''"
              v-slot="{ callback }"
            >
              <v-btn
                color="#e56d9b"
                @click="callback"
              >
                AR${{ parseFloat(price) }}
              </v-btn>
            </payment>
            <!-- 下载 -->
            <v-btn
              v-if="unlock && !downloadLoading"
              color="#e56d9b"
              class="music-info-control-download"
              @click="downloadAudio"
            >
              <v-icon color="white" size="20px">mdi-download</v-icon>
              {{ $t('download') }}
            </v-btn>
            <!-- 下载进度 -->
            <div v-if="downloadLoading" class="music-info-control-downloading">
              <p>
                <v-icon color="white" size="20px">mdi-download</v-icon>
                {{ pct ? `${pct}% ` : $t('download') }}
              </p>
              <v-progress-linear
                :indeterminate="!pct"
                v-model="pct"
                color="#E56D9B"
              />
            </div>
            <!-- 免费歌曲 -->
            <span v-if="!parseFloat(price)" class="music-info-control-free">
              {{ $t('free') }}
            </span>
          </div>
          <!-- Await confirm -->
          <div v-if="awaitConfirm" class="music-info-await">
            <div class="music-info-await-progress">
              <v-progress-circular indeterminate color="#E56D9B" />
            </div>
            <div class="music-info-await-text">
              <h4>
                「{{ $t('buy') }}」{{ $t('pleaseWait') }}
              </h4>
              <p>
                {{ $t('waitingForBlockConfirm') }}
              </p>
            </div>
          </div>
          <div class="music-title-desp">
            <span v-html="info.desp" class="desp-text"></span>
          </div>
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
            {{ $t('paymentOf') }} 「{{ info.name }}」
          </h3>
          <div class="pay-icon">
            <img src="@/assets/image/paymentCompleted.png" alt="Completed" />
          </div>
          <p class="pay-intro">
            {{ $t('succeedToUnlockMusic') }}
          </p>

          <v-btn class="pay-button" depressed color="#E56D9B" block @click="showDialog = false">
            {{ $t('backToMusicPlayer') }}
            <v-icon class="pay-button-icon">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </spaceLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import api from '@/api/api'
import decode from '@/util/decode'

import spaceLayout from '@/components/Layout/Space'
import miniAvatar from '@/components/User/MiniAvatar'
import payment from '@/components/Payment'

export default {
  inject: ['backPage', 'routerRefresh'],
  components: {
    payment,
    spaceLayout,
    miniAvatar
  },
  data () {
    return {
      type: '',
      musicId: '',
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
      timerIndex: null,
      downloadLoading: false,
      audioData: null
    }
  },
  computed: {
    ...mapState(['wallet', 'audioFileCache']),
    ext () {
      const getExt = {
        'audio/mp3': 'mp3',
        'audio/flac': 'flac',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      }
      return getExt[this.musicType]
    },
    unlock () {
      return this.owned || this.artist.id === this.wallet || !this.price
    },
    toGenre () {
      if (!this.info.genre) return {}
      switch (this.type) {
        case 'single-info':
          return { name: 'SongsSingles', query: { genre: this.info.genre } }
        case 'album-info':
          return { name: 'SongsAlbums', query: { genre: this.info.genre } }
      }
      return {}
    }
  },
  mounted () {
    this.getMusicInfo(this.$route.params.id)
    this.$nextTick(() => {
      this.info.name = this.$t('titleLoading')
      this.info.genre = this.$t('awaitData')
      this.artist.username = this.$t('artistLoading')
    })
  },
  watch: {
    $route (val) { this.routerRefresh() },
    wallet (val) {
      if (this.info.artistId === val) {
        this.owned = true
      } else if (!this.loading) {
        // 需要确保歌曲已经获取完成才可以进行这些操作，避免用户在刷新页面后触发这边的代码。
        this.owned = false
        this.awaitConfirm = false
        clearInterval(this.timerIndex)
        this.getItemStatus(val, this.$route.params.id, this.price)
      }
    }
  },
  destroyed () {
    // 释放 webkitURL
    if (this.audioData && this.audioData.src) window.webkitURL.revokeObjectURL(this.audioData.src)
    // 卡片或者页面被销毁时清除定时器
    if (this.timerIndex) clearTimeout(this.timerIndex)
  },
  methods: {
    ...mapActions(['playMusicSingle']),
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
      // 作者信息
      this.initArtist(tags)
      // 标题、简介、类型
      this.info.name = data.title
      this.info.duration = data.duration

      this.info.desp = this.filterHtmlTags(data.desp)
      this.info.genre = tags['Genre']
      this.price = data.price
      this.info.id = data.music
      // 获取封面和音频
      this.getCover(data.cover)

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化专辑 */
    async initAlbum (tags, data, albumNum = 1) {
      this.info.albumTitle = data.title
      const index = albumNum - 1
      // 作者信息
      this.initArtist(tags)
      // 标题、简介、类型
      this.info.name = data.music[index].title
      this.info.duration = data.duration

      this.info.desp = this.filterHtmlTags(data.desp)
      this.info.genre = tags['Genre']
      this.price = data.music[index].price
      this.info.id = data.music[index].id
      this.albumPrice = tags['Price']
      // 获取封面和音频
      await this.getCover(data.cover)

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化播客 */
    async initPodcast (tags, data) {
      // 作者信息
      this.initArtist(tags)
      // 标题、简介
      this.info.name = data.title
      this.info.duration = data.duration

      this.info.desp = this.filterHtmlTags(data.desp)
      this.info.genre = tags['Category']
      this.price = data.price
      this.info.id = data.program
      // 获取封面和音频
      await this.getCover(data.cover)

      document.title = data.podcast + ' | ' + this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${data.podcast} \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化音效 */
    async initSoundeffect (tags, data) {
      // 作者信息
      this.initArtist(tags)
      // 标题、简介
      this.info.name = data.title
      this.info.duration = data.duration

      this.info.desp = this.filterHtmlTags(data.desp)
      this.price = data.price
      this.info.id = data.audio
      // 获取封面和音频
      await this.getCover(data.cover)

      document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
      document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)
    },
    /** 初始化作者信息 */
    initArtist (tags) {
      this.info.artist = tags['Author-Username']
      this.info.artistId = tags['Author-Address']
      this.getArtist(tags['Author-Address'])
    },
    getAudio (id) {
      return new Promise(async (resolve, reject) => {
        try {
          const music = await api.arweave.getMusic(id, undefined, pct => { this.pct = pct })
          this.musicType = music.type
          // 挂载音频到一个 URL，并指定给 audio.pic
          const reader = new FileReader()
          reader.readAsArrayBuffer(new Blob([music.data], { type: music.type }))
          reader.onload = (event) => {
            const url = window.webkitURL.createObjectURL(new Blob([event.target.result], { type: music.type }))
            resolve({ src: url, type: music.type })
          }
        } catch (e) {
          console.error('[Failed to get audio data]', e)
          this.$message.error('Failed to get audio data')
          resolve('')
        }
      })
    },
    async getArtist (id) {
      this.artist.id = id
      try {
        const user = await api.arweave.getIdFromAddress(id)
        if (user) {
          this.artist.username = user.data
          this.info.artist = user.data
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
        this.info.cover = cover
      } catch (e) {
        console.error('[Failed to get cover]', e)
        this.$message.error('Failed to get cover')
        this.info.cover = ''
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
    },
    playAudio () {
      this.playMusicSingle({
        fileId: this.info.id,
        infoId: this.$route.params.id,
        title: this.info.name,
        artist: this.info.artist,
        pic: this.info.cover,
        duration: this.info.duration,
        unlock: this.unlock
      })
    },
    filterHtmlTags (desp) {
      desp = desp.replace(/<br>/gm, '\\n')
      desp = desp.replace(/<[^>]*>/gmu, '')
      return desp.replace(/\\n/gmu, '<br>')
    },
    async downloadAudio () {
      // 没有解锁的情况
      if (!this.unlock) {
        this.$message.error('No unlock music')
        return
      }
      // 没有音频数据，但是播放器缓存中有音频数据的情况下将播放器缓存里的数据调用过来
      if (!this.audioData && this.audioFileCache && this.audioFileCache.fileId === this.info.id) {
        this.audioData = { src: this.audioFileCache.fullAudio.src, type: this.audioFileCache.audioType }
      }
      // 没有音频数据的情况下获取音频
      if (!this.audioData) {
        this.downloadLoading = true
        const audio = await this.getAudio(this.info.id)
        if (!audio) return
        this.audioData = audio
        setTimeout(() => {
          this.downloadLoading = false
          this.pct = 0
        }, 500)
      }

      const getExt = {
        'audio/mp3': 'mp3',
        'audio/flac': 'flac',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      }

      // 拼接文件名
      const { artist, name } = this.info
      const fileName = name + ' - ' + artist + '.' + getExt[this.audioData.type]
      // 创建下载用的 a 标签
      const div = document.getElementById('app')
      const a = document.createElement('a')
      a.href = this.audioData.src
      a.download = fileName
      a.id = 'audio' + this.info.id
      div.appendChild(a)
      // 获取并点击创建的 a 标签
      const downloadA = document.getElementById('audio' + this.info.id)
      downloadA.click()
      // 删除 a 标签
      div.removeChild(a)
      // 提示下载成功
      this.$notify({
        duration: 6000,
        type: 'success',
        title: `Downloaded: ${fileName}`,
        dangerouslyUseHTMLString: true,
        message: `<span class="album-click-download">
          If your download didn't started,
          <a href="${this.audioData.src}" download="${fileName}">click here</a>
        <span>`
      })
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

  &-control {
    display: flex;
    align-items: center;
    margin-top: 10px;

    &-free {
      color: #66BB6A;
      font-size: 16px;
      margin: 0;
    }

    &-downloading {
      width: 140px;
      height: 36px;
      margin: 0 15px 0 0;
      background: #333333;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 #00000024, 0 1px 5px 0 #0000001f;
      overflow: hidden;
      p {
        font-size: 14px;
        color: white;
        margin: 6px 0 0;
        text-transform: uppercase;
        font-weight: 500;

        i {
          color: white;
          font-size: 14px;
        }
      }
    }

    button {
      color: white;
      margin: 0 15px 0 0;
      &.music-info-control-play, &.music-info-control-download {
        padding: 0 16px 0 13px;
      }
    }
  }

  &-await {
    margin: 10px auto 0;
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
    .music-title-genre {
      text-decoration: none;
      margin-right: 8px;
      padding: 8px 16px 8px;
      background-color: #FAE5ED;
      border-radius: 10px;
      font-weight: 700;
      color: #D85C8B;
      white-space: nowrap;
      font-size: 16px;
      display: inline-block;
      &.no-click {
        cursor: default;
      }
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
      text-align: left;
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
      margin-top: 10px;
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
