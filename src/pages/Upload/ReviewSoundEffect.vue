<template>
  <spaceLayout>
    <div>
      <div class="soundeffect">
        <div class="upload-header">
          <a @click="$router.go(-1)" class="back-link">
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
          <img :src="soundeffectCoverRaw" class="cover" />
          <div class="info-container">
            <div class="soundeffect-title-container">
              <div class="soundeffect-genre">
                {{ soundEffectInfo.genre }}
              </div>
              <div class="soundeffect-title">
                {{ soundEffectInfo.title }}
              </div>
            </div>
            <div class="soundeffect-artist">
              {{ username }}
            </div>
            <div class="soundeffect-desp">
              {{ soundEffectInfo.desp }}
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
              <aplayer id="ap" v-if="audio !== ''" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" style="width: 300px" />
            </div>
        </div>
        <v-btn color="#E56D9B" depressed light class="submit-btn" large :loading="submitBtnLoading" @click="submit">Submit</v-btn>
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
      failMessage: ''
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'soundEffectCoverFile', 'soundEffectCoverRaw', 'soundEffectCoverType', 'soundEffectMusicFile', 'soundEffectMusicRaw', 'soundEffectMusicType', 'soundEffectInfo'])
  },
  methods: {
    ...mapActions(['uploadsoundEffect']),
    submit () {
      this.submitBtnLoading = true
      this.uploadsoundEffect({
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
    }
  },
  mounted () {
    if (!this.soundEffectInfo) {
      this.failMessage = 'Unknown Error Occurred'
      this.failSnackbar = true

      this.$router.push({ name: 'Upload' })
    }

    this.getMusic().then(url => {
      const audio = {
        title: this.soundEffectInfo.title,
        artist: this.username,
        src: url,
        pic: this.soundEffectCoverRaw
      }
      this.audio = audio
    })

    this.price = this.soundEffectInfo.price + ' AR'
    this.duration = this.soundEffectInfo.duration

    const priceString = this.soundEffectInfo.price + ''
    let length = priceString.length
    if (length < 4) length = 4
    this.priceWidth = length * 10 + 30
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

.soundeffect-genre {
  margin-right: 8px;
  padding: 8px 16px 8px;
  background-color: #FAE5ED;
  border-radius: 10px;
  font-weight: 700;
  color: #D85C8B;
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
  border-radius: 25px;
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
  color: white;
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
