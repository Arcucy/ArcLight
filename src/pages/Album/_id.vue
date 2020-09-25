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
                  #{{ index+1 }} {{ music.title }}
                </h3>
                <p>
                  by {{ info.artist }}
                </p>
              </div>
            </router-link>
            <div v-if="music.unlock" class="music-download" :id="'download' + index" @click="downloadAudio(music, index)">
              <v-progress-circular
                v-if="music.downloadAwait"
                :indeterminate="!pct"
                v-model="pct"
                rotate="-90"
                color="#E56D9B"
              >
                {{ pct || '' }}
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
          <div v-if="!loading && (owned || info.authorAddress === wallet)" class="album-download">
            <v-btn
              block
              large
              light
              outlined
              rounded
              color="#E56D9B"
              :height="44"
            >
              DOWNLOAD
            </v-btn>
          </div>
          <!-- Buy -->
          <div v-else class="album-buy">
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
              />
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

import spaceLayout from '@/components/Layout/Space'
import albumInfo from '@/components/Album/AlbumInfo'
import payment from '@/components/Payment'
import { mapState } from 'vuex'

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
        artist: '',
        authorAddress: '',
        desp: '',
        genre: '',
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
      pct: 0
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  mounted () {
    this.getAlbum(this.$route.params.id)
    this.count = 0
  },
  watch: {
    async wallet (val) {
      if (this.info.authorAddress === val) {
        this.info.list.forEach(item => {
          item.unlock = true
        })
      } else {
        this.info.list.forEach(item => {
          item.unlock = false
        })
        this.getAlbum(this.$route.params.id)
      }
    },
    async price (val) {
      if (this.wallet) {
        await this.getItemStatus(this.wallet, this.$route.params.id, val)
        if (this.owned) {
          this.info.list.forEach(item => {
            item.unlock = true
          })
        }
      }
    }
  },
  methods: {
    buyClick () {
      // 这里并没有真的付款代码，而是直接将参数设定为付款成功的状态。
      this.showDialog = true
      this.owned = true
    },
    async getItemStatus (address, itemAddress, price) {
      const res2 = await api.arweave.getItemPurchaseStatus(address, itemAddress)
      if (res2) {
        const transaction = await api.arweave.getTransactionDetail(res2)
        const tags = await api.arweave.getTagsByTransaction(transaction)
        const type = tags['Purchase-Type']
        if (type === 'album-full') {
          const finalPrice = api.arweave.getArFromWinston(api.arweave.getWinstonFromAr(parseFloat(price)))
          const ar = api.arweave.getArFromWinston(transaction.quantity)
          if (ar === finalPrice) this.owned = true
        }
      }
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
        this.info.desp = albumData.desp
        this.info.list = albumData.music
        this.price = albumData.price.toFixed(12)
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
        }
        if (this.wallet) {
          await this.getItemStatus(this.wallet, id, albumData.price)
        }
        if (this.owned) {
          this.info.list.forEach(item => {
            item.unlock = true
          })
        } else if (this.wallet) {
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
    getAudio (id) {
      return new Promise(async (resolve, reject) => {
        try {
          const music = await api.arweave.getMusic(id, pct => { this.pct = pct })
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
      this.info.list[index].downloadAwait = true
      const res = await this.getAudio(music.id)

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
