<template>
  <spaceLayout>
    <div>
      <div class="album">
        <div class="upload-header">
          <a @click="$router.go(-1)" class="back-link">
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
                  v-model="duration"
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
                <aplayer id="ap" :music="music" :lrcType="0" class="music-player" theme="#E56D9B" style="width: 300px" />
              </div>
            </div>
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
      data: '',
      price: '',
      duration: '',
      priceWidth: 0,
      audio: '',
      submitBtnLoading: false,
      failSnackbar: false,
      failMessage: '',
      musicList: [],
      urlArray: [],
      musicIsReady: false,
      interval: ''
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'albumCoverFile', 'albumCoverRaw', 'albumCoverType', 'albumMusicFile', 'albumMusicRaw', 'albumMusicType', 'albumInfo', 'albumUploadComplete'])
  },
  watch: {
    albumUploadComplete (val) {
      this.submitBtnLoading = !val
    }
  },
  methods: {
    ...mapActions(['uploadAlbum']),
    submit () {
      this.submitBtnLoading = true
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
    }
  },
  mounted () {
    this.data = this.$route.params.data
    if (!this.albumInfo) {
      this.failMessage = 'Unknown Error Occurred'
      this.failSnackbar = true

      this.$router.push({ name: 'Upload' })
    }

    this.getList().then(urls => {
      this.musicIsReady = true
      this.musicList = urls
    })

    this.price = this.albumInfo.price + ' AR'
    this.duration = this.albumInfo.duration

    const priceString = this.albumInfo.price + ''
    let length = priceString.length
    if (length < 4) length = 4
    this.priceWidth = length * 10 + 30
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

.album-price {
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

.players {
  margin-top: 16px;
}

.player-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>
