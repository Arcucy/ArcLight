<template>
  <spaceLayout>
    <div>
      <div class="single">
        <div class="upload-header">
          <a @click="$router.go(-1)" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Upload
          </a>
        </div>
        <div class="notice-title">
          <v-icon light color="rgba(251, 140, 0, 1.000)" style="font-size: 40px; margin-right: 20px;">mdi-alert-circle-outline</v-icon>
          <div class="notice-content">
            Please carefully review your Single release here,
            <br>
            if there is no problem, you can submit your wonderful work
          </div>
        </div>
        <div class="single-container">
          <img :src="singleCoverRaw" class="cover" />
          <div class="info-container">
            <div class="single-title-container">
              <div class="single-genre">
                {{ singleInfo.genre }}
              </div>
              <div class="single-title">
                {{ singleInfo.title }}
              </div>
            </div>
            <div class="single-artist">
              {{ username }}
            </div>
            <div class="single-desp">
              <p v-html="singleInfo.desp"></p>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="other-container">
            <div class="single-price">
                <div class="other-title">
                  Price Cost
                </div>
                <v-text-field
                  v-model="price"
                  solo
                  disabled
                  class="single-price"
                  :style="`width: ${priceWidth}px;`"
                ></v-text-field>
            </div>
            <div class="single-demo">
                <div class="other-title">
                  Demo Duration
                </div>
                <v-text-field
                  v-model="duration"
                  solo
                  disabled
                  class="single-demo"
                  :style="`width: 54px;`"
                ></v-text-field>
            </div>
          </div>
          <div class="player">
            <aplayer id="ap" v-if="audio !== ''" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" style="width: 300px" />
          </div>
        </div>
        <v-btn color="#E56D9B" v-if="!uploadDone" depressed light class="submit-btn" large :loading="submitBtnLoading" @click="submit">Submit</v-btn>
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
              color="#FF7A7A"
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
    </div>
  </spaceLayout>
</template>

<script>

import spaceLayout from '@/components/Layout/Space.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    spaceLayout
  },
  data () {
    return {
      price: '',
      duration: '',
      priceWidth: 0,
      audio: '',
      submitBtnLoading: false,
      failSnackbar: false,
      failMessage: '',
      coverPct: 0,
      musicPct: 0,
      uploadDone: false
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'singleCoverFile', 'singleCoverRaw', 'singleCoverType', 'singleMusicFile', 'singleMusicRaw', 'singleMusicType', 'singleInfo', 'uploadCoverPct', 'uploadMusicPct', 'singleUploadComplete'])
  },
  watch: {
    singleUploadComplete (val) {
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
    ...mapActions(['uploadSingle']),
    submit () {
      this.uploadDone = false
      this.musicPct = 0
      this.coverPct = 0
      this.submitBtnLoading = true
      this.uploadSingle({
        img: { data: this.singleCoverRaw, type: this.singleCoverType },
        music: { data: this.$route.params.data, type: this.singleMusicType },
        key: this.keyFileContent,
        single: this.singleInfo
      })
    },
    getMusic () {
      return new Promise(async (resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob([this.$route.params.data.music], { type: this.singleMusicType }))
        reader.onload = (event) => {
          const url = window.webkitURL.createObjectURL(new Blob([event.target.result]))
          resolve(url)
        }
      })
    }
  },
  mounted () {
    this.coverPct = 0
    this.musicPct = 0
    this.uploadDone = false

    if (!this.singleInfo) {
      this.failMessage = 'Unknown Error Occurred'
      this.failSnackbar = true

      this.$router.push({ name: 'Upload' })
    }

    this.getMusic().then(url => {
      const audio = {
        title: this.singleInfo.title,
        artist: this.username,
        src: url,
        pic: this.singleCoverRaw
      }
      this.audio = audio
    })

    this.price = this.singleInfo.price + ' AR'
    this.duration = this.singleInfo.duration

    const priceString = this.singleInfo.price + ''
    let length = priceString.length
    if (length < 4) length = 4
    this.priceWidth = length * 10 + 30
  }
}
</script>

<style lang="less" scoped>
.single {
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

.single-container {
  margin-top: 16px;
  display: flex;
}

.single-title-container {
  display: flex;
  align-items: center;
}

.single-genre {
  margin-right: 8px;
  padding: 8px 16px 8px;
  background-color: #FAE5ED;
  border-radius: 10px;
  font-weight: 700;
  color: #D85C8B;
}

.single-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.single-artist {
  margin-top: 10px;
  font-size: 24px;
  color: #E56D9B;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.single-desp {
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

.single-price {
  margin-right: 20px;
}

.submit-btn {
  width: 100px;
  color: white;
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

</style>
