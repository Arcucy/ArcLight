<template>
  <spaceLayout>
    <div class="album" id="album">
      <!-- Back Button -->
      <div class="album-header">
        <a @click="$router.go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="header-title">
            <span class="header-title-text">
              Album
            </span>
            <span class="header-title-back">
              Back
            </span>
          </span>
        </a>
      </div>
      <albumInfo :album="info" />
      <div class="album-box">
        <!-- left -->
        <div class="album-box-col">
          <h4 class="music-title">
            Music list
          </h4>
          <div class="music"
            v-for="(music, index) in info.list"
            :key="index"
            v-ripple
          >
            <router-link :to="{ name: 'Music', params: { id: $route.params.id }, query: { album: index + 1 } }">
              <div class="music-left">
                <h3>
                  #{{ index+1 }} {{ music.title }} {{ pctArray[index] }}
                </h3>
                <p>
                  by {{ info.artist }}
                </p>
              </div>
            </router-link>
            <div v-if="music.unlock" class="music-download" :id="'download' + index" @click="downloadAudio(music, index)">
              <v-progress-circular
                v-if="music.downloadAwait"
                :indeterminate="!music.pct"
                v-model="music.pct"
                rotate="-90"
                color="#E56D9B"
              >
                {{ music.pct || '' }}
              </v-progress-circular>
              <v-icon v-else>mdi-download</v-icon>
            </div>
            <div v-else class="music-download download-lock">
              <v-icon>mdi-download-lock</v-icon>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="album-box-col">
          <!-- Download -->
          <div v-if="!downloading && !loading && (owned || info.authorAddress === wallet)" class="album-download">
            <v-btn
              block
              large
              light
              outlined
              rounded
              color="#E56D9B"
              :height="44"
              @click="downloadAlbum"
            >
              DOWNLOAD
            </v-btn>
          </div>
          <!-- Download loading -->
          <v-progress-linear
            v-else-if="downloading"
            :indeterminate="shouldWait"
            v-model="albumPct"
            color="#E56D9B"
            height="44"
            background-color="#303437"
            style="border-radius: 999px; color: white; margin: 49px auto 0px;width: 240px;"
          >
            <strong v-if="!isNaN(parseInt(albumPctDisplay))"> {{ albumPctDisplay }}%</strong>
            <strong v-else>{{ albumPctDisplay }}</strong>
          </v-progress-linear>
          <!-- Buy -->
          <div v-else-if="!awaitConfirm" class="album-buy">
            <h4>
              Buy 「{{ info.name }}」
            </h4>
            <div class="album-buy-label">
              <div class="album-buy-label-discount">
                -20%
              </div>
              <div class="album-buy-label-price">
                <p class="album-buy-label-price-original">
                  AR$: {{ originalPrice }}
                </p>
                <p class="album-buy-label-price-now">
                  AR$: {{ price }}
                </p>
              </div>
              <payment
                :artist="{ id: info.authorAddress, username: info.artist }"
                :wallet="wallet"
                :price="parseFloat(price)"
                :item="info"
                :itemId="$route.params.id"
                :type="'album-full'"
                @purchase-complete="purchaseComplete"
              />
            </div>
          </div>
          <!-- Await confirm -->
          <div v-if="awaitConfirm" class="album-await">
            <div class="album-await-progress">
              <v-progress-circular indeterminate color="#E56D9B" />
            </div>
            <div class="album-await-text">
              <h4>
                「Buy」please wait. . .
              </h4>
              <p>
                Waiting for the transaction to be merged into a new block, this may take a few minutes. You can leave this page and do something else.
              </p>
            </div>
          </div>
        </div>
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
            Succeed to unlock the album！
          </p>

          <v-btn class="pay-button" depressed color="#E56D9B" block @click="showDialog = false">
            BACK TO ALBUM PLAYER
            <v-icon class="pay-button-icon">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </spaceLayout>
</template>

<script>
import api from '@/api/api'
import decode from '@/util/decode'

import JSZip from 'jszip'

import spaceLayout from '@/components/Layout/Space'
import albumInfo from '@/components/Album/AlbumInfo'
import payment from '@/components/Payment'
import { mapState } from 'vuex'

let zip = new JSZip()

export default {
  components: {
    spaceLayout,
    albumInfo,
    payment
  },
  data () {
    return {
      info: {
        name: '',
        cover: 'Loading',
        artist: 'Artist loading...',
        authorAddress: '',
        desp: '',
        genre: 'Await Data...',
        unixTime: 0,
        list: []
      },
      artist: {
        id: '',
        avatar: 'loading',
        username: 'Artist loading...'
      },
      audio: [],
      loading: true,
      price: 0,
      originalPrice: 0,
      owned: false,
      showDialog: false,
      count: 0,
      downloading: false,
      pct: 0,
      pctArray: [0, 0],
      singlePct: 0,
      tempPct: 0,
      fenduanPct: 0,
      albumPctDisplay: '',
      shouldWait: false,
      awaitConfirm: false,
      timerIndex: null
    }
  },
  computed: {
    ...mapState(['wallet']),
    albumPct () {
      let res = Math.round((this.tempPct + (this.singlePct % 100)) / this.info.list.length)
      return res
    }
  },
  mounted () {
    this.getAlbum(this.$route.params.id)
    this.count = 0
  },
  destroyed () {
    // 卡片或者页面被销毁时清除定时器
    if (this.timerIndex) clearTimeout(this.timerIndex)
  },
  watch: {
    wallet (val) {
      this.awaitConfirm = false
      if (this.timerIndex) clearTimeout(this.timerIndex)

      if (this.info.authorAddress === val) {
        this.info.list.forEach(item => {
          item.unlock = true
        })
      } else {
        this.info.list.forEach(item => {
          item.unlock = false
          this.owned = false
        })
        if (!this.loading) this.getAlbum(this.$route.params.id)
      }
    },
    async price (val) {
      if (this.wallet) {
        if (this.owned) {
          this.info.list.forEach(item => {
            item.unlock = true
          })
        }
      }
    },
    $route (val) {
      this.count = 0
      this.owned = false
      this.info = {
        name: '',
        cover: 'Loading',
        artist: '',
        authorAddress: '',
        desp: '',
        genre: '',
        unixTime: 0,
        list: []
      }
      this.artist = {
        id: '',
        avatar: 'loading',
        username: 'Artist loading...'
      }
      this.audio = []
      this.awaitConfirm = false
      if (this.timerIndex) clearTimeout(this.timerIndex)
      this.getAlbum(this.$route.params.id)
    },
    albumPct (val) {
      this.albumPctDisplay = val
      if (val === 100) {
        this.albumPct = 0
        this.albumPctDisplay = 'Zipping your files'
        this.shouldWait = true
      }
    }
  },
  methods: {
    async getItemStatus (address, itemAddress, price) {
      const getPaymentResult = async (txid) => {
        try {
          const transaction = await api.arweave.getTransactionDetail(txid)
          const tags = await api.arweave.getTagsByTransaction(transaction)
          const type = tags['Album-Type']
          if (type === 'full') {
            const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(price)))
            const ar = api.arweave.getArFromWinston(transaction.quantity)
            console.log('判断是否相等 finalPrice:', finalPrice, 'Ar:', ar)
            if (ar === finalPrice) this.owned = true
          }
          this.awaitConfirm = false
        } catch (e) {
          if (e.type === 'TX_PENDING') {
            this.awaitConfirm = true
            this.timerIndex = setTimeout(() => { getPaymentResult(txid) }, 2000)
          } else {
            console.error('[Purchase record query failed] type:', { ...e }.type, e)
            this.$message.error(`Purchase record query failed, type: ${{ ...e }.type || 'Unknown'}`)
            this.awaitConfirm = false
          }
        }
      }

      const res = await api.arweave.getAlbumPurchaseStatus(address, itemAddress)
      if (res) await getPaymentResult(res)
      else this.awaitConfirm = false
    },
    async getIndividualStatus (address, itemAddress, price) {
      this.info.list.forEach(async (item, index) => {
        const res1 = await api.arweave.getAlbumItemPurchaseStatus(this.wallet, itemAddress, index + 1 + '')
        if (res1) {
          const transaction = await api.arweave.getTransactionDetail(res1)
          const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(item.price)))
          const ar = api.arweave.getArFromWinston(transaction.quantity)
          if (ar === finalPrice) item.unlock = true
        }
      })
    },
    async getAlbum (id) {
      this.loading = true
      try {
        // 获取数据
        const transaction = await api.arweave.getTransactionDetail(id)
        const tags = await api.arweave.getTagsByTransaction(transaction)
        const albumData = JSON.parse(decode.uint8ArrayToString(transaction.data))
        // 赋值
        this.info.artist = tags['Author-Username']
        this.info.authorAddress = tags['Author-Address']
        this.info.genre = tags['Genre']
        this.info.unixTime = Number(tags['Unix-Time'])
        this.info.name = albumData.title

        document.title = this.info.name + ' by ' + this.info.artist + ' - ArcLight'
        document.querySelector('meta[name="description"]').setAttribute('content', `ArcLight \n ${this.info.name} by ${this.info.artist} \n ${this.info.desp}`)

        albumData.desp = albumData.desp.replace(/<br>/gm, '\\n')
        albumData.desp = albumData.desp.replace(/<[^>]*>/gmu, '')
        albumData.desp = albumData.desp.replace(/\\n/gmu, '<br>')

        this.info.desp = albumData.desp
        this.info.list = albumData.music
        this.price = albumData.price.toFixed(12)

        this.info.list.forEach(item => {
          item.pct = 0
        })

        if (this.price <= 0 && this.originalPrice <= 0) {
          this.info.list.forEach(item => {
            item.unlock = true
          })
          this.owned = true
        }

        this.info.list.forEach(item => {
          if (item.price) {
            this.originalPrice = parseFloat(this.originalPrice) + parseFloat(item.price)
          }
        })

        this.originalPrice = this.originalPrice.toFixed(12)
        this.info.list = this.info.list.map(item => {
          return { ...item, downloadAwait: false }
        })

        if (this.info.authorAddress === this.wallet) {
          this.info.list.forEach(item => {
            item.unlock = true
          })
          this.owned = true
        }
        if (this.wallet) {
          for (let index = 0; index < this.info.list.length; index++) {
            const item = this.info.list[index]
            const res1 = await api.arweave.getAlbumItemPurchaseStatus(this.wallet, id, index + 1 + '')
            if (res1) {
              const transaction = await api.arweave.getTransactionDetail(res1)
              const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(item.price)))
              const ar = api.arweave.getArFromWinston(transaction.quantity)
              if (ar === finalPrice) item.unlock = true

              const winstonPriceSingle = api.arweave.getWinstonFromAr(parseFloat(item.price))
              const winstonPriceAlbum = api.arweave.getWinstonFromAr(parseFloat(this.price))
              let newAlbumPrice = winstonPriceAlbum / 0.8
              newAlbumPrice = (newAlbumPrice - parseInt(winstonPriceSingle)) * 0.8
              this.price = api.arweave.getArFromWinston(newAlbumPrice)
            }
          }
          this.owned = this.info.list.every(item => item.unlock === true)
          if (this.owned) this.awaitConfirm = false

          // 检查整张专辑购买
          const oldOwned = this.owned
          await this.getItemStatus(this.wallet, id, this.price)
          if (this.owned && !oldOwned) {
            this.info.list.forEach(item => {
              item.unlock = true
            })
          }
        }

        // 获取封面
        this.info.cover = await this.getCover(albumData.cover)
        // 获取作者信息
        this.getArtist(this.info.authorAddress)
      } catch (e) {
        this.$message.error('Failed to get album information')
      }
      this.loading = false
    },
    async getArtist (id) {
      this.artist.id = id
      try {
        const user = await api.arweave.getIdFromAddress(id)
        if (user) this.artist.username = user.data
        else {
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
    getAudio (id, index) {
      return new Promise(async (resolve, reject) => {
        try {
          this.pctArray[index] = 0
          const music = await api.arweave.getMusic(id, pct => { this.info.list[index].pct = pct })
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
    async downloadAudio (music, index) {
      this.info.list[index].pct = 0
      this.info.list[index].downloadAwait = true
      const res = await this.getAudio(music.id, index)

      const getExt = {
        'audio/mp3': 'mp3',
        'audio/flac': 'flac',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      }

      this.audio[index] = ({ src: res.src, name: music.title + ' - ' + this.artist.username + '.' + getExt[res.type] })
      const div = document.getElementById('album')
      const a = document.createElement('a')
      a.href = this.audio[index].src
      a.download = this.audio[index].name
      a.id = 'audio' + index
      div.appendChild(a)
      const downloadA = document.getElementById('audio' + index)
      downloadA.click()
      window.URL.revokeObjectURL(res.src)
      div.removeChild(a)
      setTimeout(() => {
        this.info.list[index].downloadAwait = false
        this.pct = 0
      }, 1000)
    },
    getMusicRaw (item) {
      return new Promise(async (resolve, reject) => {
        const music = await api.arweave.getMusic(item.id, pct => {
          this.singlePct = pct
        })
        this.tempPct += 100
        this.musicType = music.type
        // 挂载音频到一个 URL，并指定给 audio.pic
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob([music.data], { type: music.type }))
        reader.onload = (event) => {
          resolve({ data: event.target.result, type: music.type })
        }
      })
    },
    async downloadAlbum () {
      this.albumPct = 0
      this.tempPct = 0
      this.downloading = true
      this.shouldWait = false
      let urlArray = []
      this.fenduanPct = 100 / this.info.list.length / 100

      for (let i = 0; i < this.info.list.length; i++) {
        const id = this.info.list[i].id
        const title = this.info.list[i].title
        const getExt = {
          'audio/mp3': 'mp3',
          'audio/flac': 'flac',
          'audio/wav': 'wav',
          'audio/ogg': 'ogg'
        }
        const data = await this.getMusicRaw({ id: id, title: title })
        zip.file(title + ' by ' + this.info.artist + '.' + getExt[data.type], new Blob([data.data], { type: data.type }))
      }
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        let url = window.webkitURL.createObjectURL(blob, { type: 'application/zip' })
        const div = document.getElementById('album')
        const a = document.createElement('a')
        a.href = url
        a.download = this.info.name + ' by ' + this.info.artist + '.zip'
        a.id = 'zip'
        div.appendChild(a)
        const downloadA = document.getElementById('zip')
        downloadA.click()
        div.removeChild(a)
        this.downloading = false
        window.URL.revokeObjectURL(url)
        urlArray.forEach(item => {
          window.URL.revokeObjectURL(item.src)
        })
      })
    },
    purchaseComplete () {
      this.awaitConfirm = true
      this.getItemStatus(this.wallet, this.$route.params.id, this.price)
    }
  }
}
</script>

<style lang="less" scoped>
.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

a {
  text-decoration: none;
  color: white;
}

.album {
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
  &-box {
    margin-top: 40px;
    display: flex;
    &-col {
      flex: 1;
      margin-left: 40px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &-download {
    margin: 48px auto 0;
    max-width: 240px;
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 20px;
      margin: 0 0 8px;
    }
  }
  &-buy {
    margin: 15px 0 0;
    h4 {
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      color: white;
      line-height: 14px;
      margin: 0 0 20px;
    }
    &-label {
      display: flex;
      &-discount {
        margin: 0 10px 0 0;
        font-size: 20px;
        font-weight: 400;
        height: 40px;
        background: #348e39bd;
        backdrop-filter: blur(2px);
        border-radius: 2px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #AED581;
        padding: 5px 20px;
      }
      &-price {
        display: flex;
        flex-direction: column;
        flex: 1;
        &-original {
          text-align: left;
          font-size: 12px;
          font-weight: 400;
          color: #B2B2B2;
          line-height: 14px;
          margin: 0 0 5px;
          text-decoration: line-through;
        }
        &-now {
          text-align: left;
          margin: 0;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #E56D9B;
        }
      }
      button {
        width: 200px;
      }
    }
  }

  &-await {
    margin: 15px 0 0;
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

  .music-title {
    text-align: left;
    font-size: 18px;
    font-weight: 500;
    color: white;
    line-height: 14px;
    margin: 15px 0 5px;
  }

  .music {
    display: flex;
    border-bottom: 1px solid #B2B2B2;
    height: 80px;
    a {
      flex: 1;
    }
    &-left {
      h3 {
        text-align: left;
        margin: 15px 0 4px;
        font-size: 16px;
        font-weight: 500;
        color: white;
        line-height: 22px;
        .word-limit();
      }
      p {
        text-align: left;
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: #B2B2B2;
        line-height: 20px;
        .word-limit();
      }
    }
    &-download {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        color: white;
        font-size: 30px;
      }
      &.download-lock {
        cursor: no-drop;
        i {
          color: #B2B2B2;
        }
      }
    }
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

@media screen and (max-width: 992px) {
  .album-box {
    flex-direction: column-reverse;
    &-col {
      margin: 0 0 40px;
    }
  }
}
@media screen and (max-width: 640px) {
  .album-buy-label button {
    width: 120px;
  }
}
</style>
