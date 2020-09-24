<template>
  <router-link class="card-link" :to="routerTo">
    <div class="card" v-ripple>
      <div class="card-cover">
        <v-img
          v-if="!errorMessage"
          class="card-cover-img"
          :src="cover"
          alt="cover"
          aspect-ratio="1"
        >
          <template v-slot:placeholder>
            <div class="card-cover-img-loading">
              <v-progress-circular indeterminate color="#E56D9B" />
            </div>
          </template>
        </v-img>
        <div v-else class="card-cover-error">
          <v-icon color="#ff5252">mdi-alert-circle-outline</v-icon>
        </div>
      </div>
      <div class="card-right">
        <div v-if="errorMessage" class="music-info">
          <p class="music-info-title music-error">
            {{ errorMessage }}
          </p>
        </div>
        <div v-else class="music-info">
          <p class="music-info-title">
            {{ card.title || 'Loading...' }}
          </p>
          <p
            v-if="card.authorAddress"
            class="music-info-artist"
          >
            by {{ card.authorUsername || 'Anonymity' }}
          </p>
          <p v-else class="music-info-artist">
            {{ card.authorUsername || 'Artist loading...' }}
          </p>
        </div>
        <router-link v-if="!errorMessage && !loading" to="">
          <div v-if="!downloadLoading" class="download" @click="downloadAudio">
            <v-icon>mdi-download</v-icon>
          </div>
          <div v-else class="download" @click="downloadAudio">
            <v-progress-circular
              :indeterminate="!pct"
              v-model="pct"
              color="#E56D9B"
              rotate="-90"
              size="40"
            >
             {{ pct || '' }}
            </v-progress-circular>
          </div>
        </router-link>
      </div>
    </div>
  </router-link>
</template>

<script>
import api from '@/api/api'
import decode from '@/util/decode'

export default {
  components: {
  },
  props: {
    txid: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      errorMessage: '',
      loading: true,
      downloadLoading: false,
      card: {},
      cover: '',
      infoTxid: '',
      pct: 0
    }
  },
  computed: {
    routerTo () {
      return this.infoTxid && !this.errorMessage ? { name: 'Music', params: { id: this.infoTxid } } : ''
    }
  },
  watch: {
    txid (val) {
      if (val) this.get()
      else {
        this.card = {}
        this.cover = ''
      }
    }
  },
  mounted () {
    if (this.txid) this.get()
  },
  methods: {
    async get () {
      this.loading = true
      // 获取购买记录的 tags
      const history = await this.getPurchaseHistory(this.txid)
      if (history) {
        // 根据 tags 中歌曲信息的 txid 获取到歌曲信息
        this.infoTxid = history['Item']
        const info = await this.getInfo(this.infoTxid)
        if (info) {
          this.card = info
          // 获取封面
          this.getCover()
        }
      }
      this.loading = false
    },
    async getPurchaseHistory (txid) {
      try {
        const transaction = await api.arweave.getTransactionDetail(txid)
        if (transaction) {
          const tags = api.arweave.getTagsByTransaction(transaction)
          return tags
        } else {
          this.errorMessage = 'Can\'t find purchase record'
        }
      } catch (e) {
        console.error('[Unable to get purchase record] txid: ', txid, e)
        this.errorMessage = 'Unable to get purchase record'
      }
      return null
    },
    async getInfo (infoTxid) {
      try {
        const transaction = await api.arweave.getTransactionDetail(infoTxid)
        if (transaction) {
          const tags = api.arweave.getTagsByTransaction(transaction)
          const audioData = JSON.parse(decode.uint8ArrayToString(transaction.data))
          return {
            txid: this.txid,
            authorAddress: tags['Author-Address'],
            authorUsername: tags['Author-Username'],
            title: audioData.title,
            price: audioData.price,
            coverTxid: audioData.cover,
            audioTxid: audioData.music || audioData.program || audioData.audio
          }
        } else {
          this.errorMessage = 'Can\'t find this single'
        }
      } catch (e) {
        console.error('[Unable to get single information] info txid:', this.infoTxid, e.message)
        this.errorMessage = 'Unable to get single information'
      }
    },
    async getCover () {
      if (this.card && this.card.coverTxid) {
        this.cover = await api.arweave.getCover(this.card.coverTxid)
      } else this.cover = ''
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
    async downloadAudio () {
      if (!this.card || !this.card.audioTxid || this.downloadLoading) return
      this.downloadLoading = true
      const audio = await this.getAudio(this.card.audioTxid)
      if (!audio) return

      const getExt = {
        'audio/mp3': 'mp3',
        'audio/flac': 'flac',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      }

      const { title, authorUsername } = this.card
      const div = document.getElementById('app')
      const a = document.createElement('a')
      a.href = audio.src
      a.download = title + ' - ' + authorUsername + '.' + getExt[audio.type]
      a.id = 'audio' + this.audioTxid
      div.appendChild(a)
      const downloadA = document.getElementById('audio' + this.audioTxid)
      downloadA.click()
      window.URL.revokeObjectURL(audio.src)
      div.removeChild(a)
      setTimeout(() => {
        this.downloadLoading = false
        this.pct = 0
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
p {
  text-align: left;
}
a {
  text-decoration: none;
}

.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.card {
  display: flex;
  margin-bottom: 8px;
  min-height: 72px;
  cursor: pointer;
  &-cover {
    width: 64px;
    margin-right: 8px;
    &-img {
      border-radius:5px;
      width: 64px;
      height: 64px;
      background: #252525;
      &-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    }
    &-error {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      border-radius:5px;
      background: #ffffff0d;
      i {
        font-size: 40px;
      }
    }
  }

  &-right {
    flex: 1;
    display: flex;
    border-bottom: 1px solid #B2B2B2;
    .music-info {
      flex: 1;
      &-title {
        margin: 9px 0 4px;
        font-size: 16px;
        font-weight: 500;
        color: white;
        line-height: 22px;
        .word-limit();
        &.music-error {
          color: #ff5252;
        }
      }

      &-artist {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 400;
        color: #B2B2B2;
        line-height: 20px;
        text-align: left;
        .word-limit();
      }
    }
    .download {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      i {
        color: white;
        font-size: 30px;
      }
    }
  }
}
</style>
