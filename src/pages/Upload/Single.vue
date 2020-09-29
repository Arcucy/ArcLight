<template>
  <div>
    <spaceLayout>
      <div class="upload-single-container">
        <div class="upload-header">
          <router-link :to="{ name: 'Upload' }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Selection
          </router-link>
        </div>
        <div class="container">
          <div class="cover-title side-title">Single Cover</div>
          <img-upload
          :img-upload-done="imgUploadDone"
          :update-type="'single'"
          class="app-icon"
          @doneImageUpload="doneImageUpload"
          >
            <div
              slot="uploadButton"
              class="user-avatar"
            >
              <div class="edit">
                <v-icon color="#FFF">mdi-camera</v-icon>
                Single Cover
              </div>
              <img
                id="avatar"
                v-if="singleCover"
                slot="description"
                :src="singleCover"
                alt="avatar"
              >
              <img v-else id="new-logo" src="../../assets/image/single.png" style="margin-top: 10px;"/>
            </div>
          </img-upload>
          <div class="name-title side-title">Music Name</div>
          <v-text-field
            v-model="singleTitle"
            label="Solo"
            placeholder="Enter Your Music Title..."
            solo
            dark
            color="#FFF"
            style="margin-top: 16px;"
            counter
            maxlength="100"
          ></v-text-field>
          <div class="name-desp side-title">Description</div>
          <v-textarea
            v-model="singleDesp"
            solo
            dark
            name="input-7-4"
            label="Your Single Description..."
            counter
            maxlength="1000"
          ></v-textarea>
          <div class="name-desp side-title">Genre</div>
          <genreSelect v-model="genre" style="margin-bottom: 16px;" />
          <div class="name-desp side-title">Price</div>
          <v-text-field
            v-model="price"
            class="price"
            id="price"
            solo
            dark
            type="number"
            label="Price"
            maxlength="12"
            prepend-inner-icon="mdi-cash-multiple"
          ></v-text-field>
          <v-file-input
            class="finput"
            v-model="file"
            color="#FFF"
            chips
            placeholder="Select your file"
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
          <div class="name-desp side-title">Demo Duration</div>
          <v-select
            dark
            :disabled="disableDuration"
            color="#E56D9B"
            v-model="duration"
            :items="durationSelection"
            :label="durationSelectStr"
            :loading="disableDuration"

            solo
          ></v-select>
          <v-btn color="#E56D9B" depressed light class="side-title" :loading="submitBtnLoading" @click="submit">Review</v-btn>
        </div>
      </div>
      <v-snackbar
        v-model="snackbar"
        color="#00C853"
        timeout="3000"
        top="top"
      >
        Image Read Successful

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
        v-model="singleSnackbar"
        color="#00C853"
        timeout="3000"
        top="top"
      >
        Single Release Successful

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="singleSnackbar = false"
          >
            Close
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
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </spaceLayout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import imgUpload from '@/components/imgUpload/imgUpload.vue'
import spaceLayout from '@/components/Layout/Space.vue'
import genreSelect from '@/components/GenreSelect.vue'

import singleDefault from '@/assets/image/single.png'

export default {
  components: {
    imgUpload,
    spaceLayout,
    genreSelect
  },
  data () {
    return {
      file: null,
      genre: '',
      duration: '',
      price: 0,
      singleDefault: singleDefault,
      singleTitle: '',
      singleDesp: '',
      needUpload: true,
      attachments: [],
      singleCover: '',
      fileContent: '',
      fileRaw: '',
      fileName: '',
      imgUploadDone: 0,
      music: '',
      musicContent: '',
      snackbar: false,
      failSnackbar: false,
      singleSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      shouldLoad: true,
      durationSelection: ['15s', '30s', '60s', 'Off', 'Allow Full'],
      maxDuration: 0,
      disableDuration: true,
      durationSelectStr: 'Please Upload Your Artwork...'
    }
  },
  computed: {
    ...mapState(['wallet', 'singleCoverFile', 'singleCoverRaw', 'isLoggedIn', 'keyFileContent', 'singleLink', 'userType', 'singleInfo'])
  },
  watch: {
    $router (val) {
      alert('You sure you want to leave?')
    },
    wallet (val) {
      if (!val) {
        this.failMessage = 'Login is required to upload'
        this.failSnackbar = true

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    },
    userType (val) {
      if (this.userType === 'guest') {
        this.failSnackbar = true
        this.failMessage = 'You must have a username in order to upload'

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    },
    file (val, oldVal) {
      if (val && val !== oldVal) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(val)
        reader.onload = async (e) => {
          const data = e.target.result
          let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
          let source

          audioCtx.createBufferSource()
          source = await audioCtx.decodeAudioData(data.slice())
          let duration = source.duration
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
          this.durationSelectStr = 'Select Demo duration'
          this.disableDuration = false
        }
      }
    }
  },
  methods: {
    ...mapActions(['uploadSingleCoverFile', 'reviewSingle']),
    submit () {
      this.submitBtnLoading = true
      if (this.singleCover === '') {
        this.failMessage = 'A cover for a single release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.singleTitle === '') {
        this.failMessage = 'A title for a single release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.singleDesp === '') {
        this.failMessage = 'A description for a single release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.genre) {
        this.failMessage = 'Please select the genre of your music (None for blank)'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.duration) {
        this.failMessage = 'The demo duration is required'
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

      if (isNaN(parseFloat(this.price))) {
        this.failMessage = 'The price must be numbers'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.file) {
        this.failMessage = 'A source music file for a single release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      let imgType = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      let ext = this.singleCoverFile.name.split('.').pop()
      console.log('Content-Type:', imgType[ext])

      let audioType = {
        mp3: 'audio/mp3',
        flac: 'audio/flac',
        wav: 'audio/wav',
        ogg: 'audio/ogg'
      }

      let aext = this.file.name.split('.').pop()
      console.log('Content-Type:', audioType[aext])
      const reader = new FileReader()
      reader.readAsArrayBuffer(this.file)
      reader.onload = async (e) => {
        this.music = e.target.result
        this.musicContent = this.file

        this.singleDesp = this.singleDesp.replace(/<.*>/gmu, '')
        this.singleDesp = this.singleDesp.replace(/\\n/g, '<br>')
        this.singleDesp = this.singleDesp

        const dataObj = {
          img: { data: this.fileRaw, type: imgType[ext] },
          music: { data: this.music, type: audioType[aext], read: this.file },
          key: this.keyFileContent,
          single: {
            title: this.singleTitle,
            desp: this.singleDesp,
            genre: this.genre,
            duration: this.duration,
            price: parseFloat(this.price)
          }
        }
        this.reviewSingle(dataObj)
        this.$router.push({ name: 'ReviewSingle', params: { data: { music: this.music, raw: this.musicContent, file: this.file } } })
      }
    },
    doneImageUpload () {
      this.singleCover = this.singleCoverFile
      this.fileName = this.singleCover.name
      const reader = new FileReader()
      reader.readAsDataURL(this.singleCover)
      reader.onload = async (e) => {
        try {
          this.fileContent = e.target.result
          this.fileRaw = this.fileContent
          this.needUpload = false
          this.singleCover = this.fileRaw
          this.snackbar = true
        } catch (err) {
          this.imgFailSnackbar = true
        }
      }
      this.imgUploadDone += Date.now()
      this.snackbar = true
    }
  },
  mounted () {
    if (this.singleInfo) {
      this.shouldLoad = false
    }
    if (this.$route.params.file) {
      this.file = this.$route.params.file
      let audioType = {
        mp3: 'audio/mp3',
        flac: 'audio/flac',
        wav: 'audio/wav',
        ogg: 'audio/ogg'
      }

      let aext = this.file.name.split('.').pop()
      console.log('Content-Type:', audioType[aext])
      const reader = new FileReader()
      reader.readAsArrayBuffer(this.file)
      reader.onload = async (e) => {
        this.music = e.target.result
        this.musicContent = this.file
      }
    }

    if (this.singleCoverRaw) {
      this.singleCover = this.singleCoverRaw
      this.fileRaw = this.singleCoverRaw
    }

    if (this.singleInfo) {
      this.disableDuration = false
      this.durationSelectStr = 'Select Demo duration'
      this.singleTitle = this.singleInfo.title
      this.singleDesp = this.singleInfo.desp
      this.genre = this.singleInfo.genre
      if (this.singleInfo.duration !== 0 && this.singleInfo.duration !== -1) {
        this.duration = this.singleInfo.duration + 's'
      } else if (this.singleInfo.duration === -1) {
        this.duration = 'Allow Full'
      } else {
        this.duration = 'Off'
      }
      this.price = this.singleInfo.price
    }

    this.shouldLoad = true

    if (this.userType === 'guest') {
      this.failSnackbar = true
      this.failMessage = 'You must have a username in order to upload'

      setTimeout(() => {
        this.$router.push({ name: 'Landing' })
      }, 3000)
    }
    document.title = 'Upload a new Single - ArcLight'
    setTimeout(() => {
      if (!this.isLoggedIn) {
        this.failMessage = 'Login is required to upload'
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
.upload-single-container {
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
  color: white;
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
</style>
