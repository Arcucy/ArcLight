<template>
  <spaceLayout>
    <div>
      <div class="soundeffect">
        <div v-if="canGoBack" class="upload-header">
          <a @click="$router.push({ name: 'uploadSoundEffect', params: $route.params.data })" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            {{ $t('backToUpload') }}
          </a>
        </div>
        <div class="notice-title">
          <v-icon light color="rgba(251, 140, 0, 1.000)" style="font-size: 40px; margin-right: 20px;">mdi-alert-circle-outline</v-icon>
          <div class="notice-content">
            {{ $t('soundEffectWarning') }}
            <br>
            {{ $t('reviewWarning') }}
          </div>
        </div>
        <div class="soundeffect-container">
          <img :src="soundEffectCoverRaw" class="cover" />
          <div class="info-container">
            <div class="soundeffect-title-container">
              <div class="soundeffect-title">
                {{ soundEffectInfo.title }}
              </div>
            </div>
            <div class="soundeffect-artist">
              {{ username }}
            </div>
            <div class="soundeffect-desp">
              <p v-html="soundEffectInfo.desp"></p>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="other-container">
            <div class="soundeffect-price">
                <div class="other-title">
                  {{ $t('priceCost') }}
                </div>
                <v-text-field
                  v-model="price"
                  solo
                  disabled
                  class="soundeffect-price"
                  :style="`width: ${priceWidth}px;`"
                ></v-text-field>
            </div>
            <div class="soundeffect-demo">
                <div class="other-title">
                  {{ $t('demoDuration') }}
                </div>
                <v-text-field
                  v-model="durationDisplay"
                  solo
                  disabled
                  class="soundeffect-demo"
                  :style="`width: 110px;`"
                ></v-text-field>
            </div>
          </div>
          <div class="player">
            <aplayer id="ap" v-if="audio !== ''" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" />
          </div>
        </div>
        <v-btn color="#E56D9B" v-if="!uploadDone" depressed light class="submit-btn" large :loading="submitBtnLoading" @click="submit">{{ $t('submit') }}</v-btn>
        <v-btn color="#E56D9B" v-else depressed light class="submit-btn" large :loading="submitBtnLoading" @click="jump">{{ $t('done') }}</v-btn>
        <div class="upload-status" v-if="submitBtnLoading">
          <div class="upload-status-cover" v-if="coverPct !== 100">
            <div class="upload-title">{{ $t('uploadingCover') }}</div>
            <v-progress-linear
              :buffer-value="coverPct"
              v-model="coverPct"
              :value="coverPct"
              stream
              color="#3B8CFF"
            ></v-progress-linear>
          </div>
          <div class="upload-status-music" v-if="!uploadDone">
            <div style="display: flex;">
              <div class="upload-title" style="flex: 1">{{ $t('uploadingMusic') }} {{ uploadMusicPct }}%</div>
              <div class="upload-title">{{ uploadStatusDisplay }}</div>
            </div>
            <v-progress-linear
              :buffer-value="musicPct"
              v-model="musicPct"
              :value="musicPct"
              :indeterminate="musicPct === 100"
              stream
              color="#E56D9B"
            ></v-progress-linear>
          </div>
        </div>
        <div v-if="uploadDone" >
          <div class="upload-title">{{ $t('uploadSuccess') }}</div>
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
            {{ $t('close') }}
          </v-btn>
        </template>
      </v-snackbar>
      <keyReader
        v-model="showWallet"
        @key-file="step2" />
      <uploadPriceReceipt
        v-model="showDialog"
        :bill="bill"
        @confirm="step3"
      />
      <v-dialog
        v-model="showUpload"
        width="360"
      >
        <v-card dark class="upload-notice">
          <h3 class="upload-notice-title">
            {{ $t('uploadPending') }}
          </h3>
          <p class="upload-notice-content">
            {{ $t('uploadPendingInfo') }}
          </p>
          <p class="upload-notice-content">
            {{ $t('transaction') }} ID: {{ soundEffectInfoIdDisplay }}
          </p>
          <v-btn class="confirm-button" depressed color="#E56D9B" block @click="showUpload = false">
            {{ $t('confirm') }}
          </v-btn>
        </v-card>
      </v-dialog>
    </div>
  </spaceLayout>
</template>

<script>
/* eslint-disable no-async-promise-executor */
import api from '@/api/api'
import stringUtil from '@/util/string'
import { mapActions, mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space.vue'
import uploadPriceReceipt from '@/components/uploadPriceReceipt'
import keyReader from '@/components/KeyReader'

export default {
  components: {
    spaceLayout,
    uploadPriceReceipt,
    keyReader
  },
  data () {
    return {
      price: '',
      duration: '',
      durationDisplay: '',
      priceWidth: 0,
      audio: '',
      failSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      coverPct: 0,
      musicPct: 0,
      uploadDone: false,
      bill: {},
      showWallet: false,
      showDialog: false,
      showUpload: false,
      canGoBack: true,
      uploadStatusDisplay: '',
      soundEffectInfoIdDisplay: '',
      keyFileContent: ''
    }
  },
  computed: {
    ...mapState(['isWalletLoaded', 'soundEffectInfoId', 'username', 'soundEffectCoverFile', 'soundEffectCoverRaw', 'soundEffectCoverType', 'soundEffectMusicType', 'soundEffectInfo', 'uploadCoverPct', 'uploadMusicPct', 'soundEffectUploadComplete', 'uploadStatus'])
  },
  watch: {
    soundEffectUploadComplete (val) {
      if (val) {
        this.showUpload = true
        this.submitBtnLoading = false
        this.uploadDone = true
        this.canGoBack = false
      }
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
    },
    uploadStatus (val) {
      this.uploadStatusDisplay = val
    },
    soundEffectInfoId (val) {
      this.soundEffectInfoIdDisplay = val
    }
  },
  methods: {
    ...mapActions(['uploadSoundEffect', 'resetSoundEffectInfo']),
    submit () {
      if (this.submitBtnLoading) return
      if (this.isWalletLoaded) {
        this.showDialog = true
      } else {
        this.showWallet = true
      }
    },
    step2 (key) {
      this.keyFileContent = key
      this.showDialog = true
    },
    step3 () {
      this.showDialog = true
      this.submitBtnLoading = true
      this.uploadDone = false
      this.musicPct = 0
      this.coverPct = 0
      this.uploadSoundEffect({
        img: { data: this.soundEffectCoverRaw, type: this.soundEffectCoverType },
        music: { data: this.$route.params.data, type: this.soundEffectMusicType },
        key: this.keyFileContent,
        soundEffect: this.soundEffectInfo
      })
    },
    getMusic () {
      return new Promise(async (resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob([this.$route.params.data.music], { type: this.soundEffectMusicType }))
        reader.onload = (event) => {
          const url = window.webkitURL.createObjectURL(new Blob([event.target.result]))
          resolve(url)
        }
      })
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
      api.arweave.getUploadPrice(this.$route.params.data.file.size).then(res => { bill.audioPrice = res })
      api.arweave.getUploadPrice(this.soundEffectCoverFile.size).then(res => { bill.coverPrice = res })
      api.arweave.getUploadPrice(stringUtil.lengthInUtf8Bytes(this.createInfoJsonString(this.soundEffectInfo))).then(res => { bill.infoPrice = res })
      return bill
    },
    createInfoJsonString (info) {
      const strJson = JSON.stringify({
        title: info.title,
        desp: info.desp,
        price: info.price,
        duration: info.duration,
        cover: '-'.repeat(43),
        program: '-'.repeat(43)
      })
      return strJson
    },
    jump () {
      this.resetSoundEffectInfo()
      this.$router.push({ name: 'Songs' })
    }
  },
  mounted () {
    document.title = this.$t('reviewYourUpload') + ' - ArcLight'

    this.musicPct = 0
    this.coverPct = 0
    this.uploadStatusDisplay = 0
    this.uploadDone = false

    if (!this.soundEffectInfo) {
      this.failMessage = this.$t('unknownErrorOccurred')
      this.failSnackbar = true

      this.$router.push({ name: 'Upload' })
      return
    }

    this.bill = this.getUploadPrice()

    this.getMusic().then(url => {
      const audio = {
        title: this.soundEffectInfo.title,
        artist: this.username,
        src: url,
        pic: this.soundEffectCoverRaw
      }
      this.audio = audio
    })

    this.price = stringUtil.toPlainString(this.soundEffectInfo.price) + ' AR'
    this.duration = this.soundEffectInfo.duration
    if (this.duration === -1) {
      this.durationDisplay = 'Album Full'
    } else if (this.duration === 0) {
      this.durationDisplay = 'Off'
    } else {
      this.durationDisplay = this.duration + 's'
    }

    const priceString = stringUtil.toPlainString(this.soundEffectInfo.price) + ''
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
.soundeffect {
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

.soundeffect-container {
  margin-top: 16px;
  display: flex;
}

.soundeffect-title-container {
  display: flex;
  align-items: center;
}

.soundeffect-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.soundeffect-artist {
  margin-top: 10px;
  font-size: 24px;
  color: #E56D9B;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.soundeffect-desp {
  margin-top: 10px;
  color: white;
  font-size: 20px;
}

.cover {
  width: 250px;
  height: 250px;
  border-radius: 10px;
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

.soundeffect-price {
  margin-right: 20px;
}

.submit-btn {
  width: 100px;
  color: white !important;
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
    margin-bottom: 24px;
    text-align: left;
  }
}

.upload-notice-title {
  margin-bottom: 24px;
  text-align: left;
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

@media screen and (max-width: 1200px) {
  .soundeffect-container {
    flex-direction: column;
    .info-container {
      .soundeffect-title-container {
        width: 100%;
        margin-top: 16px;
        flex-direction: column;
        text-align: left;
        justify-content: flex-start;
        align-items: baseline;
      }
      .soundeffect-title {
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
    .soundeffect-artist {
      font-size: 18px;
    }
    .soundeffect-desp {
      p {
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
  .music-player {
    width: 90vw;
  }
}
</style>
