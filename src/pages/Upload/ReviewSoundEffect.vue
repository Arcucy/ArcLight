<template>
  <spaceLayout>
    <div>
      <div class="soundeffect">
        <div class="upload-header">
          <a @click="$router.push({ name: 'uploadSoundEffect', params: $route.params.data })" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Upload
          </a>
        </div>
        <div class="notice-title">
          <v-icon light color="rgba(251, 140, 0, 1.000)" style="font-size: 40px; margin-right: 20px;">mdi-alert-circle-outline</v-icon>
          <div class="notice-content">
            Please carefully review your Sound Effect release here,
            <br>
            if there is no problem, you can submit your wonderful work
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
                  Price Cost
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
                  Demo Duration
                </div>
                <v-text-field
                  v-model="duration"
                  solo
                  disabled
                  class="soundeffect-demo"
                  :style="`width: 54px;`"
                ></v-text-field>
            </div>
          </div>
          <div class="player">
            <aplayer id="ap" v-if="audio !== ''" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" />
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
          <div class="upload-status-music" v-if="uploadMusicPct !== 100">
            <div class="upload-title">Uploading Music...</div>
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
      price: '',
      duration: '',
      priceWidth: 0,
      audio: '',
      failSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      coverPct: 0,
      musicPct: 0,
      uploadDone: false,
      bill: {},
      showDialog: false
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'soundEffectCoverFile', 'soundEffectCoverRaw', 'soundEffectCoverType', 'soundEffectMusicFile', 'soundEffectMusicRaw', 'soundEffectMusicType', 'soundEffectInfo', 'uploadCoverPct', 'uploadMusicPct', 'soundEffectUploadComplete'])
  },
  watch: {
    soundEffectUploadComplete (val) {
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
    ...mapActions(['uploadSoundEffect']),
    submit () {
      if (this.submitBtnLoading) return
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
    }
  },
  mounted () {
    this.musicPct = 0
    this.coverPct = 0
    this.uploadDone = false

    if (!this.soundEffectInfo) {
      this.failMessage = 'Unknown Error Occurred'
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
