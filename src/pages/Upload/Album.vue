<template>
  <div>
    <spaceLayout>
      <div class="upload-album-container">
        <div class="upload-header">
          <router-link :to="{ name: 'Upload' }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            {{ $t('backToSelection') }}
          </router-link>
        </div>
        <div class="container">
          <div class="cover-title side-title">{{ $t('albumCover') }}</div>
          <img-upload
            :img-upload-done="imgUploadDone"
            :update-type="'album'"
            class="app-icon"
            @done-image-upload="doneImageUpload"
          >
            <div
              slot="uploadButton"
              class="user-avatar"
            >
              <div class="edit">
                <v-icon color="#FFF">mdi-camera</v-icon>
                {{ $t('albumCover') }}
              </div>
              <img
                id="avatar"
                v-if="albumCover"
                slot="description"
                :src="albumCover"
                alt="avatar"
              >
              <img v-else id="new-logo" src="../../assets/image/album.png" style="margin-top: 10px;"/>
            </div>
          </img-upload>
          <div class="name-title side-title">Album title</div>
            <v-text-field
              v-model="albumTitle"
              label="Solo"
              :placeholder="$t('enterYourAlbumTitle')"
              solo
              dark
              color="#FFF"
              style="margin-top: 16px;"
              counter
              maxlength="100"
            ></v-text-field>
          <div class="name-desp side-title">{{ $t('uploadDescription') }}</div>
          <v-textarea
            v-model="albumDesp"
            solo
            dark
            name="input-7-4"
            :label="$t('yourAlbumDescritption')"
            counter
            maxlength="1000"
          ></v-textarea>
          <div class="name-desp side-title">{{ $t('genre') }}</div>
          <genreSelect v-model="genre" style="margin-bottom: 16px;" />
          <div v-for="(file, index) in fileList" :key="index">
            <div class="name-title side-title">#{{ index + 1 }} {{ $t('musicName') }}</div>
            <v-text-field
              v-model="file.title"
              label="Solo"
              :placeholder="$t('enterYourMusicTitle')"
              solo
              dark
              color="#FFF"
              style="margin-top: 16px;"
              counter
              maxlength="100"
            ></v-text-field>
            <div class="finput-container">
              <v-file-input
                class="finput"
                v-model="file.music"
                color="#FFF"
                chips
                :placeholder="$t('selectYourFile')"
                prepend-icon="mdi-paperclip"
                outlined
                accept="audio/mp3,audio/flac,audio/wave,audio/wav,audio/ogg,audio/mpeg"
                :show-size="1000"
                style="margin-top: 16px;"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip
                    v-if="index < 2"
                    color="#C2185B"
                    dark
                    label
                    small
                  >
                    {{ text }}
                  </v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >
                    +{{ files.length - 2 }} File(s)
                  </span>
                </template>
              </v-file-input>
              <v-btn v-if="fileList.length > 2" @click="musicLess" color="#EA6290" depressed small dark style="margin: 0 0 15px 10px; height: 54px;">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </div>
            <div class="name-desp side-title">#{{ index + 1 }} {{ $t('price') }}</div>
            <v-text-field
              v-model="file.price"
              class="price"
              solo
              dark
              :label="$t('price')"
              type="number"
              prepend-inner-icon="mdi-cash-multiple"
              maxlength="12"
            ></v-text-field>
          </div>
          <v-btn v-if="fileList.length < 20" @click="musicAdd" color="#EA6290" depressed small dark style="margin-bottom: 16px; height: 54px;">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn color="#E56D9B" depressed dark class="side-title" :loading="checkBtnLoading" @click="verify">{{ $t('verify') }}</v-btn>
          <div class="name-desp side-title">{{ $t('demoDuration') }}</div>
          <v-select
            dark
            :disabled="demoIsDisable"
            color="#E56D9B"
            v-model="duration"
            :items="durationSelection"
            :label="durationSelectStr"
            :loading="mainDisableDuration"
            solo
          ></v-select>
          <div class="name-desp side-title">{{ $t('albumPriceWillAlwaysBe80Percent') }}</div>
          <v-btn color="#E56D9B" depressed dark class="side-title" :disabled="demoIsDisable" :loading="submitBtnLoading" @click="submit">{{ $t('review') }}</v-btn>
        </div>
      </div>
      <v-snackbar
        v-model="snackbar"
        color="#00C853"
        timeout="3000"
        top="top"
      >
        {{ $t('imageReadSuccess') }}

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            {{ $t('close') }}
          </v-btn>
        </template>
      </v-snackbar>
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
    </spaceLayout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import API from '@/api/api'

import imgUpload from '@/components/imgUpload/imgUpload.vue'
import spaceLayout from '@/components/Layout/Space.vue'
import genreSelect from '@/components/GenreSelect.vue'

import albumDefault from '@/assets/image/album.png'

export default {
  components: {
    imgUpload,
    spaceLayout,
    genreSelect
  },
  data () {
    return {
      file: null,
      fileList: [{ music: null, title: '', price: 0, type: '', disableDuration: true }, { music: null, title: '', price: 0, type: '', disableDuration: true }],
      genre: '',
      duration: '',
      price: 0,
      albumDefault: albumDefault,
      albumTitle: '',
      albumDesp: '',
      needUpload: true,
      attachments: [],
      albumCover: '',
      fileContent: '',
      fileRaw: '',
      fileName: '',
      imgUploadDone: 0,
      music: [],
      musicContent: '',
      snackbar: false,
      failSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      checkBtnLoading: false,
      durationSelection: ['10s', '30s', '60s', 'Off', 'Allow Full'],
      maxDuration: 0,
      disableDuration: true,
      demoIsDisable: true
    }
  },
  computed: {
    ...mapState(['albumCoverFile', 'albumCoverRaw', 'isLoggedIn', 'keyFileContent', 'albumLink', 'userType', 'albumInfo']),
    mainDisableDuration () {
      return !this.fileList.every(item => !item.disableDuration)
    },
    durationSelectStr () {
      return this.mainDisableDuration ? this.$t('pleaseUploadYourArtwork') : this.$t('selectDemoDuration')
    }
  },
  watch: {
    userType (val) {
      if (this.userType === 'guest') {
        this.failSnackbar = true
        this.failMessage = this.$t('usernameIsRequiredToUpload')

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    },
    wallet (val) {
      if (!val) {
        this.failMessage = this.$t('loginIsRequiredToUpload')
        this.failSnackbar = true

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    },
    fileList: {
      handler (val) {
        val.forEach(item => {
          if (!item.music) {
            item.disableDuration = true
            this.demoIsDisable = true
          }
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['uploadAlbumCoverFile', 'reviewAlbum']),
    async verify () {
      this.fileList.forEach((item, i) => {
        if (item.music) {
          const reader = new FileReader()
          reader.readAsArrayBuffer(item.music)
          reader.onload = async (e) => {
            const data = e.target.result
            e = null
            let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
            let source

            audioCtx.createBufferSource()
            source = await audioCtx.decodeAudioData(data.slice())
            const duration = source.duration
            audioCtx = null
            source = null
            let index = 0
            if (duration < 60 && duration >= 30) {
              index = this.durationSelection.indexOf('60s')
              if (index > -1) {
                this.durationSelection = this.durationSelection.filter(item => item !== '60s')
              }
            }
            if (duration < 30 && duration >= 15) {
              index = this.durationSelection.indexOf('30s')
              if (index > -1) {
                this.durationSelection = this.durationSelection.filter(item => item !== '30s')
                this.durationSelection = this.durationSelection.filter(item => item !== '60s')
              }
            }
            if (duration < 15) {
              index = this.durationSelection.indexOf('30s')
              if (index > -1) {
                this.durationSelection = this.durationSelection.filter(item => item !== '30s')
                this.durationSelection = this.durationSelection.filter(item => item !== '60s')
                this.durationSelection = this.durationSelection.filter(item => item !== '15s')
              }
            }
            item.disableDuration = false
            if (i === (this.fileList.length - 1)) {
              this.demoIsDisable = false
            }
          }
        } else {
          this.failSnackbar = true
          this.failMessage = this.$t('albumPleaseUploadAtLeast') + this.fileList.length + this.$t('albumPleaseUploadAtLeastFile')
          item.disableDuration = true
        }
      })
      this.demoIsDisable = true
    },
    async submit () {
      this.submitBtnLoading = true

      if (this.albumCover === '') {
        this.failMessage = this.$t('albumCoverIsRequiredToUpload')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.albumTitle === '') {
        this.failMessage = this.$t('albumTitleIsRequiredToUpload')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.albumDesp === '') {
        this.failMessage = this.$t('albumDespIsRequiredToUpload')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.genre) {
        this.failMessage = this.$t('genreIsRequiredToUpload')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.duration) {
        this.failMessage = this.$t('demoDurationIsRequiredToUpload')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.duration !== 'Off' && this.duration !== 'Allow Full') {
        this.duration = (this.duration + '').replace('s', '')
        this.duration = parseInt(this.duration)
      } else if (this.duration === 'Allow Full') {
        this.duration = -1
      } else {
        this.duration = 0
      }

      let shouldReturn = false
      let shouldHasPrice = false
      for (let i = 0; i < this.fileList.length; i++) {
        const item = this.fileList[i]
        if (isNaN(parseFloat(item.price))) {
          this.failMessage = this.$t('priceMustBeNumber')
          this.failSnackbar = true
          this.submitBtnLoading = false
          shouldReturn = true
        } else if (shouldHasPrice && parseFloat(item.price) === 0) {
          this.failMessage = this.$t('albumSongShouldHavePriceOrFree')
          this.failSnackbar = true
          this.submitBtnLoading = false
          shouldHasPrice = false
          shouldReturn = true
          break
        } else if (parseFloat(item.price) > 0) {
          shouldHasPrice = true
        }
      }
      if (shouldReturn) return

      if (this.price === 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          this.price = this.price + Number(API.arweave.getWinstonFromAr(this.fileList[i].price))
        }
        this.price = this.price * 0.8
      }

      if (isNaN(parseFloat(this.price))) {
        this.failMessage = this.$t('priceMustBeNumber')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      this.price = API.arweave.getArFromWinston(this.price)

      if (parseFloat(this.price) < 0) {
        this.failMessage = this.$t('priceCantBeNegative')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      } else {
        this.price = parseFloat((this.price + '').replace(/-/gm, ''))
      }

      if (!isNaN(parseFloat(this.price)) && parseFloat(this.price) === 0 && this.duration !== -1) {
        this.failMessage = this.$t('demoCantBeSetToFreeMusic')
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      for (let i = 0; i < this.fileList.length; i++) {
        if (!this.fileList[i].music) {
          this.failMessage = this.$t('albumSourceFileIsRequiredToUpload')
          this.failSnackbar = true
          this.submitBtnLoading = false
          return
        }
      }

      for (let i = 0; i < this.fileList.length; i++) {
        if (!this.fileList[i].title) {
          this.failMessage = this.$t('albumMusicTitleIsRequiredToUpload') + (i + 1)
          this.failSnackbar = true
          this.submitBtnLoading = false
          return
        }
      }

      const imgType = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      const ext = this.albumCoverFile.name.split('.').pop()
      console.log('Content-Type:', imgType[ext])

      const audioType = {
        mp3: 'audio/mp3',
        flac: 'audio/flac',
        wav: 'audio/wav',
        ogg: 'audio/ogg'
      }

      const musicList = []

      for (let i = 0; i < this.fileList.length; i++) {
        const aext = this.fileList[i].music.name.split('.').pop()
        this.fileList[i].type = audioType[aext]
        console.log('Content-Type:', audioType[aext])
        musicList.push(await this.getMusicList(this.fileList[i], audioType[aext]))
      }

      this.albumDesp = this.albumDesp.replace(/<.*>/gmu, '')
      this.albumDesp = this.albumDesp.replace(/\\n/g, '<br>')
      // eslint-disable-next-line no-self-assign
      this.albumDesp = this.albumDesp

      const dataObj = {
        img: { data: this.fileRaw, type: imgType[ext] },
        music: { data: this.music, read: musicList },
        key: this.keyFileContent,
        album: {
          title: this.albumTitle,
          desp: this.albumDesp,
          genre: this.genre,
          duration: this.duration,
          price: parseFloat(this.price)
        }
      }

      this.reviewAlbum(dataObj)
      this.$router.push({ name: 'ReviewAlbum', params: { data: { music: this.music, file: musicList } } })
    },
    getMusicList (obj, type) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(obj.music)
        reader.onload = (e) => {
          this.music.push({ data: e.target.result, title: obj.title, price: obj.price, type: type })
          resolve(obj.music)
        }
      })
    },
    doneImageUpload () {
      this.albumCover = this.albumCoverFile
      this.fileName = this.albumCover.name
      const reader = new FileReader()
      reader.readAsDataURL(this.albumCover)
      reader.onload = async (e) => {
        try {
          this.fileContent = e.target.result
          this.fileRaw = this.fileContent
          this.needUpload = false
          this.albumCover = this.fileRaw
          this.snackbar = true
        } catch (err) {
          this.imgFailSnackbar = true
        }
      }
      this.imgUploadDone += Date.now()
      this.snackbar = true
    },
    musicAdd () {
      this.fileList.push({ music: null, title: '', price: 0, type: '', disableDuration: true })
    },
    musicLess (i) {
      if (this.fileList.length <= 2) return
      this.fileList.splice(i, 1)
    }
  },
  mounted () {
    if (this.$route.params.file) {
      this.$route.params.file.forEach((file, index) => {
        if (!this.fileList[index]) this.fileList.push({ music: null, title: '', price: 0, type: '', disableDuration: true })
        this.fileList[index].music = file
      })
      this.$route.params.music.forEach((item, index) => {
        this.fileList[index].title = item.title
        this.fileList[index].price = item.price
      })
    }

    if (this.albumCoverRaw) {
      this.albumCover = this.albumCoverRaw
      this.fileRaw = this.albumCoverRaw
    }

    if (this.albumInfo) {
      console.log(this.albumInfo)
      this.albumTitle = this.albumInfo.title
      this.albumDesp = this.albumInfo.desp
      this.genre = this.albumInfo.genre
      if (this.albumInfo.duration !== 0 && this.albumInfo.duration !== -1) {
        this.duration = this.albumInfo.duration + 's'
      } else if (this.albumInfo.duration === -1) {
        this.duration = 'Allow Full'
      } else {
        this.duration = 'Off'
      }
      this.price = Number(API.arweave.getArFromWinston(this.albumInfo.price))
    }

    if (this.userType === 'guest') {
      this.failSnackbar = true
      this.failMessage = this.$t('usernameIsRequiredToUpload')

      setTimeout(() => {
        this.$router.push({ name: 'Landing' })
      }, 3000)
    }
    document.title = this.$t('uploadNewAlbum') + ' - ArcLight'
    setTimeout(() => {
      if (!this.isLoggedIn) {
        this.failMessage = this.$t('loginIsRequiredToUpload')
        this.failSnackbar = true

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    }, 3000)
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
.upload-album-container {
  margin: 48px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
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

.side-title {
  font-weight: 600;
  display: block;
  text-align: left;
  color: white !important;
  margin-bottom: 16px;
}

.user-avatar {
  margin: 0 auto;
}

.app-icon {
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width:150px;
  height:150px;
  object-fit: cover;
  background:rgba(90, 90, 90, 0.247);
  border-radius:8px;
  &:hover {
    background-color: rgb(80, 80, 80);
  }
  .user-avatar > img {
    width: 130px;
    height: 130px;
  }
  &:hover .edit {
    display: flex;
  }
  .edit {
    width: 130px;
    height: 130px;
    margin-top: 10px;
    margin-left: 10px;
    display: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: #eee;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    .el-icon-camera {
      font-size: 24px;
      margin-bottom: 4px;
      color: #eee;
    }
  }
}

#avatar {
  margin-top: 10px;
}

/deep/ .v-text-field__slot > input {
  color: white !important;
  &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white !important;
    opacity: 1; /* Firefox */
  }
}

/deep/ .v-text-field__slot > textarea {
  color: white !important;
}

/deep/ .v-text-field__slot > label {
  color: white !important;
}

.price {
  /deep/ &.v-text-field {
    .v-input__control .v-input__slot .v-text-field__slot {
      margin-left: 10px;
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      &::after {
        content: 'AR';
        color: white;
        font-weight: 900;
        margin-right: 5px;
      }
    }
  }
}

.container {
  text-align: start;
}

/deep/ .v-icon--link {
  color: white !important;
}

/deep/ .v-select__selection {
  color: white !important;
}

/deep/ .v-select__slot > label {
  color: white !important;
}

/deep/ .v-input__icon > i {
  color: white !important;
}

/deep/ .v-text-field--is-booted {
  color: #E56D9B;
  border-color: white !important;
}

/deep/ .v-file-input__text.v-file-input__text--placeholder {
  color: white !important;
}

/deep/ .v-text-field--solo>.v-input__control>.v-input__slot {
  background-color: rgba(51,51,51,0.8);
}

.finput {
  /deep/ .v-input__control {
    .v-input__slot {
      fieldset {
        color: rgba(254, 118, 164, 0.7) !important;
        border: 3px solid !important;
      }
    }
  }
}

.finput-container {
  display: flex;
  align-items: center;
}
</style>
