<template>
  <spaceLayout>
    <div>
      <div class="album">
        <div class="upload-header">
          <a @click="$router.push({ name: 'uploadAlbum', params: $route.params.data })" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Upload
          </a>
        </div>
        <div class="notice-title">
          <v-icon light color="rgba(251, 140, 0, 1.000)" style="font-size: 40px; margin-right: 20px;">mdi-alert-circle-outline</v-icon>
          <div class="notice-content">
            Please carefully review your Album release here,
            <br>
            if there is no problem, you can submit your wonderful work
          </div>
        </div>
        <div class="album-container">
          <img :src="albumCoverRaw" class="cover" />
          <div class="info-container">
            <div class="album-title-container">
              <div class="album-genre">
                {{ albumInfo.genre }}
              </div>
              <div class="album-title">
                {{ albumInfo.title }}
              </div>
            </div>
            <div class="album-artist">
              {{ username }}
            </div>
            <div class="album-desp">
              <p v-html="albumInfo.desp"></p>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="other-container">
            <div class="album-price">
                <div class="other-title">
                  Price Cost
                </div>
                <v-text-field
                  v-model="price"
                  solo
                  disabled
                  class="album-price"
                  :style="`width: ${priceWidth}px;`"
                ></v-text-field>
            </div>
            <div class="album-demo">
                <div class="other-title">
                  Demo Duration
                </div>
                <v-text-field
                  v-model="durationDisplay"
                  solo
                  disabled
                  class="album-demo"
                  :style="`width: 54px;`"
                ></v-text-field>
            </div>
          </div>
          <div v-if="musicIsReady" class="players">
            <div v-for="(music, index) in musicList" :key="index" class="player-container">
              <div class="music-title">
              #{{ index + 1 }} {{ music.title }}
              </div>
              <div class="player">
                <aplayer id="ap" :music="music" :lrcType="0" class="music-player" theme="#E56D9B" />
              </div>
            </div>
          </div>
        </div>
        <v-btn color="#E56D9B" v-if="!uploadDone" depressed light class="submit-btn" large :loading="submitBtnLoading" @click="showDialog = true">Submit</v-btn>
        <v-btn color="#E56D9B" v-else depressed light class="submit-btn" large :loading="submitBtnLoading" @click="() => {$router.push({ name: 'Songs' })}">Done</v-btn>
        <div class="upload-status" v-if="submitBtnLoading">
          <div class="upload-status-cover" v-if="uploadCoverPct !== 100">
            <div class="upload-title">Uploading Cover...</div>
            <v-progress-linear
              :buffer-value="coverPct"
              v-model="coverPct"
              :value="coverPct"
              stream
              color="#3B8CFF"
            ></v-progress-linear>
          </div>
          <div class="upload-status-music" v-if="!uploadDone">
            <div class="upload-title">Uploading Music... {{ uploadMusicNumber }}</div>
            <v-progress-linear
              :buffer-value="musicPct"
              v-model="musicPct"
              :value="musicPct"
              stream
              color="#FF3B6C"
            ></v-progress-linear>
          </div>
        </div>
        <div v-if="uploadDone" >
          <div class="upload-title">Upload Successful!</div>
        </div>
      </div>
      <v-snackbar
        v-model="failSnackbar"
        color="#E53935"
        timeout="3000"
        top="top"
        style="margin-top: 16px;"
      >
        {{ failMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="failSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <uploadPriceReceipt
        v-model="showDialog"
        :bill="bill"
        @confirm="submit"
      />
      <v-dialog
        v-model="showUpload"
        width="360"
      >
        <v-card dark class="upload-notice">
          <h3 class="upload-notice-title">
            Upload Pending
          </h3>
          <p class="upload-notice-content">
            Your artwork has been uploaded to Arweave Permaweb Storage. Your work may not be available soon after you uploaded,
            It will need a short time of mining for miners to help you save to next block.
            Be patient, your wonderful will be forever stored!
          </p>
          <v-btn class="confirm-button" depressed color="#E56D9B" block @click="showUpload = false">
            Confirm
          </v-btn>
        </v-card>
      </v-dialog>
    </div>
  </spaceLayout>
</template>

<script>
import api from '@/api/api'
import stringUtil from '@/util/string'
import { mapActions, mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space.vue'
import uploadPriceReceipt from '@/components/uploadPriceReceipt'

export default {
  components: {
    spaceLayout,
    uploadPriceReceipt
  },
  data () {
    return {
      data: '',
      price: '',
      duration: '',
      durationDisplay: '',
      priceWidth: 0,
      audio: '',
      submitBtnLoading: false,
      failSnackbar: false,
      failMessage: '',
      musicList: [],
      urlArray: [],
      musicIsReady: false,
      coverPct: 0,
      musicPct: 0,
      uploadDone: false,
      bill: {},
      showDialog: false,
      showUpload: false
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'albumCoverFile', 'albumCoverRaw', 'albumCoverType', 'albumMusicFile', 'albumMusicRaw', 'albumMusicType', 'albumInfo', 'uploadCoverPct', 'uploadMusicPct', 'uploadMusicNumber', 'albumUploadComplete'])
  },
  watch: {
    albumUploadComplete (val) {
      this.showUpload = true
      this.submitBtnLoading = !val
      this.uploadDone = true
    },
    uploadCoverPct (val) {
      this.coverPct = val
    },
    uploadMusicPct (val) {
      this.musicPct = val
    },
    coverPct (val) {
      this.coverPct = val
    },
    musicPct (val) {
      this.musicPct = val
    }
  },
  methods: {
    ...mapActions(['uploadAlbum']),
    submit () {
      if (this.submitBtnLoading) return
      this.submitBtnLoading = true
      this.uploadDone = false
      this.musicPct = 0
      this.coverPct = 0
      this.uploadAlbum({
        img: { data: this.albumCoverRaw, type: this.albumCoverType },
        music: { data: this.$route.params.data },
        key: this.keyFileContent,
        album: this.albumInfo
      })
    },
    getUrl (item) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob([item.data], { type: item.type }))
        reader.onload = (event) => {
          const url = window.webkitURL.createObjectURL(new Blob([event.target.result]))
          resolve(url)
        }
      })
    },
    getMusic () {
      return new Promise(async (resolve, reject) => {
        const musicArray = this.$route.params.data.music
        for (let i = 0; i < musicArray.length; i++) {
          const url = await this.getUrl(musicArray[i])
          this.urlArray.push(url)
        }
        resolve(this.urlArray)
      })
    },
    async getList () {
      const dataList = []
      await this.getMusic()
      for (let i = 0; i < this.urlArray.length; i++) {
        const audio = {
          title: this.data.music[i].title,
          artist: this.username,
          src: this.urlArray[i],
          pic: this.albumCoverRaw
        }
        dataList.push(audio)
      }
      return dataList
    },
    /**
     * 获取上传歌曲所需的费用。
     * 注意：这个方法利用了 Object 的一种特性实现了并发的异步请求，返回的数据一开始会是空的，在请求完成后会发生改变，
     * 并通过 Vue 的响应式页面更新来实现数据的展示。
     */
    getUploadPrice () {
      const bill = {
        audioPrice: 0,
        coverPrice: 0,
        infoPrice: 0
      }
      api.arweave.getUploadPrice(this.albumCoverFile.size).then(res => { bill.coverPrice = res })
      api.arweave.getUploadPrice(stringUtil.lengthInUtf8Bytes(this.createInfoJsonString(this.albumInfo))).then(res => { bill.infoPrice = res })
      /** 分别获取上传每首歌的价格，最后在求和得出总价 */
      const audioPriceList = []
      this.$route.params.data.file.forEach((file, index) => {
        audioPriceList.push(0)
        api.arweave.getUploadPrice(file.size).then(res => {
          audioPriceList[index] = res
          // 这个 if 在判断每首歌的价格是不是都拿到了。
          if (audioPriceList.every(ap => ap)) {
            bill.audioPrice = audioPriceList.reduce((total, num) => total + num)
          }
        })
      })
      return bill
    },
    createInfoJsonString (info) {
      const music = []
      this.$route.params.data.music.forEach(item => {
        music.push({
          id: '-'.repeat(43),
          title: item.title,
          price: item.price
        })
      })
      const strJson = JSON.stringify({
        title: info.title,
        desp: info.desp,
        genre: info.genre,
        price: info.price,
        duration: info.duration,
        cover: '-'.repeat(43),
        music
      })
      return strJson
    }
  },
  mounted () {
    document.title = 'Review Your Upload - ArcLight'
    this.musicPct = 0
    this.coverPct = 0
    this.uploadDone = false

    this.data = this.$route.params.data
    if (!this.albumInfo) {
      this.failMessage = 'Unknown Error Occurred'
      this.failSnackbar = true

      this.$router.push({ name: 'Upload' })
      return
    }

    this.bill = this.getUploadPrice()

    this.getList().then(urls => {
      this.musicIsReady = true
      this.musicList = urls
    })

    this.price = stringUtil.toPlainString(this.albumInfo.price) + ' AR'
    this.duration = this.albumInfo.duration
    this.durationDisplay = this.duration + 's'

    const priceString = stringUtil.toPlainString(this.albumInfo.price) + ''
    let length = priceString.length
    if (length < 4) length = 4
    this.priceWidth = length * 10 + 50

    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.returnValue = 'You sure you want to leave?'
      }
      return 'You sure you want to leave?'
    }
  }
}
</script>

<style lang="less" scoped>
.album {
  margin: 40px auto;
  max-width: 1040px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .back-link {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #E56D9B;
    line-height: 22px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s;
    &:hover {
      .back-link-icon {
        transform: translateX(-5px);
      }
    }
    .back-link-icon {
      color: #E56D9B;
      font-size: 22px;
    }
  }
}

.notice-title {
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.album-container {
  margin-top: 16px;
  display: flex;
}

.album-title-container {
  display: flex;
  align-items: center;
}

.album-genre {
  margin-right: 8px;
  padding: 8px 16px 8px;
  background-color: #FAE5ED;
  border-radius: 10px;
  font-weight: 700;
  color: #D85C8B;
}

.album-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.album-artist {
  margin-top: 10px;
  font-size: 24px;
  color: #E56D9B;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.album-desp {
  margin-top: 10px;
  color: white;
  font-size: 20px;
}

.music-list {
  margin-top: 16px;
}

.music-title {
  color: white;
  font-size: 16px;
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.cover {
  width: 250px;
  height: 250px;
  border-radius: 5px;
  margin-right: 20px;
}

.other {
  display: flex;
  flex-direction: row;
}

.other-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.other-title {
  color: white;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
}

.album-price {
  margin-right: 20px;
}

.submit-btn {
  width: 100px;
  color: white !important;
}

/deep/ .v-input__slot {
  background-color: rgba(51, 51, 51, 0.8) !important;
  .v-text-field__slot > input {
    color: white;
  }
}

/deep/ .theme--light.v-input {
  color: white;
}

.player {
  margin-top: 16px;
  right: 0;
}

.players {
  margin-top: 16px;
}

.music-player {
  width: 300px;
}

.music-player {
  max-width: 588px;
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

.player-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.upload-status {
  margin-top: 16px;
}

.upload-title {
  color: white;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 30px;
}

.upload-notice {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .upload-notice-content {
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: left;
  }
}

.upload-notice-title {
  margin-bottom: 24px;
  text-align: left;
}

@media screen and (max-width: 1200px) {
  .album-container {
    flex-direction: column;
    .info-container {
      .album-title-container {
        width: 100%;
        margin-top: 16px;
        flex-direction: column;
        text-align: left;
        justify-content: flex-start;
        align-items: baseline;
      }
      .album-title {
        margin-top: 10px;
        color: white;
        font-size: 20px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .album-artist {
      font-size: 18px;
    }
    .album-desp {
      p {
        font-size: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 10;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  .other {
    flex-direction: column;
    margin-bottom: 20px;
  }

  .player-container {
    margin-top: 10px;
    .music-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }
  }

  .music-player {
    width: 90vw;
  }

  .player-container {
    align-items: baseline;
    flex-direction: column;
  }
}
</style>
