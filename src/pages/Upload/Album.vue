<template>
  <div>
    <spaceLayout>
      <div class="upload-album-container">
        <div class="upload-header">
          <router-link :to="{ name: 'Upload' }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Selection
          </router-link>
        </div>
        <div class="container">
          <div class="cover-title side-title">Album Cover</div>
          <img-upload
          :img-upload-done="imgUploadDone"
          :update-type="'album'"
          class="app-icon"
          @doneImageUpload="doneImageUpload"
          >
            <div
              slot="uploadButton"
              class="user-avatar"
            >
              <div class="edit">
                <v-icon color="#FFF">mdi-camera</v-icon>
                Album Cover
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
              placeholder="Enter Your Album Title..."
              solo
              color="#FFF"
              style="margin-top: 16px;"
            ></v-text-field>
          <div class="name-desp side-title">Description</div>
          <v-textarea
            v-model="albumDesp"
            solo
            name="input-7-4"
            label="Your Album Description..."
          ></v-textarea>
          <div class="name-desp side-title">Genre</div>
          <genreSelect v-model="genre" style="margin-bottom: 16px;" />
          <div class="name-desp side-title">Demo Duration</div>
          <v-select
            dark
            v-model="duration"
            :items="durationSelection"
            label="Select Demo duration"
            solo
          ></v-select>
          <div v-for="(file, index) in fileList" :key="index">
            <div class="name-title side-title">#{{ index + 1 }} Music Name</div>
            <v-text-field
              v-model="fileList[index].title"
              label="Solo"
              placeholder="Enter Your Music Title..."
              solo
              color="#FFF"
              style="margin-top: 16px;"
            ></v-text-field>
            <div class="finput-container">
              <v-file-input
                class="finput"
                v-model="fileList[index].music"
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
              <v-btn v-if="fileList.length > 2" @click="musicLess" color="#EA6290" depressed small dark style="margin: 0 0 15px 10px; height: 54px;">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </div>
            <div class="name-desp side-title">#{{ index + 1 }} Music Price</div>
            <v-text-field
              v-model="fileList[index].price"
              class="price"
              solo
              label="Prepend"
              prepend-inner-icon="mdi-cash-multiple"
            ></v-text-field>
          </div>
          <v-btn v-if="fileList.length < 20" @click="musicAdd" color="#EA6290" depressed small dark style="margin-bottom: 16px; height: 54px;">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div class="name-desp side-title">Album Price</div>
          <v-text-field
            v-model="price"
            class="price"
            solo
            label="Prepend"
            prepend-inner-icon="mdi-cash-multiple"
          ></v-text-field>
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
        v-model="albumSnackbar"
        color="#00C853"
        timeout="3000"
        top="top"
      >
        Album Release Successful

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="albumSnackbar = false"
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

import albumDefault from '@/assets/image/album.png'

import { getCookie } from '@/util/cookie'

export default {
  components: {
    imgUpload,
    spaceLayout,
    genreSelect
  },
  data () {
    return {
      file: null,
      fileList: [{ music: null, title: '', price: 0, type: '' }, { music: null, title: '', price: 0, type: '' }],
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
      albumSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      durationSelection: ['10s', '30s', '60s', 'Off']
    }
  },
  computed: {
    ...mapState(['albumCoverFile', 'isLoggedIn', 'keyFileContent', 'albumLink'])
  },
  methods: {
    ...mapActions(['uploadAlbumCoverFile', 'reviewAlbum']),
    async submit () {
      this.submitBtnLoading = true

      if (this.albumCover === '') {
        this.failMessage = 'A cover for a album release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.albumTitle === '') {
        this.failMessage = 'A title for a album release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.albumDesp === '') {
        this.failMessage = 'A description for a album release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.genre) {
        this.failMessage = 'Please select the genre of your music (None for blank)'
        this.failSnackbar = true
        this.submitBtnLoading = false
      }

      if (!this.duration) {
        this.failMessage = 'The demo duration is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (isNaN(parseFloat(this.price))) {
        this.failMessage = 'The price must be numbers'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      for (let i = 0; i < this.fileList.length; i++) {
        if (!this.fileList[i]) {
          this.failMessage = 'You must select sources of music file for two album release'
          this.failSnackbar = true
          this.submitBtnLoading = false
          return
        }
      }

      let imgType = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      let ext = this.albumCoverFile.name.split('.').pop()
      console.log('Content-Type:', imgType[ext])

      let audioType = {
        mp3: 'audio/mp3',
        flac: 'audio/flac',
        wav: 'audio/wav',
        ogg: 'audio/ogg'
      }

      let musicList = []

      for (let i = 0; i < this.fileList.length; i++) {
        this.price = this.price + parseInt(this.fileList[i].price)
        let aext = this.fileList[i].music.name.split('.').pop()
        this.fileList[i].type = audioType[aext]
        console.log('Content-Type:', audioType[aext])
        musicList.push(await this.getMusicList(this.fileList[i], audioType[aext]))
      }

      this.price = this.price * 0.8
      this.albumDesp = this.albumDesp.replace(/\\n/g, '<br>')
      this.albumDesp = this.albumDesp.replace(/(<script>|<script src=.*>)(.*)(<\/script>)/, '')
      this.albumDesp = this.albumDesp.replace(/(<img src=.*(\/)?>)/, '')
      this.albumDesp = this.albumDesp.replace(/<audio>.*<\/audio>/, '')
      this.albumDesp = '<p>' + this.albumDesp + '</p>'

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
      console.log(this.music.length)
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
      this.fileList.push({ music: null, title: '', price: 0, type: '' })
    },
    musicLess (i) {
      if (this.fileList.length <= 2) return
      this.fileList.splice(i, 1)
    }
  },
  mounted () {
    document.title = 'Upload a new Album - ArcLight'

    const c = getCookie('arclight_userkey')
    setTimeout(() => {
      if (!this.isLoggedIn || c) {
        this.failMessage = 'Login is required to upload'
        this.failSnackbar = true

        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 3000)
      }
    }, 3000)
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
  color: white;
  &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white;
    opacity: 1; /* Firefox */
  }
}

/deep/ .v-text-field__slot > textarea {
  color: white;
}

/deep/ .v-text-field__slot > label {
  color: white;
}

.price {
  /deep/ &.v-text-field {
    .v-input__control .v-input__slot .v-text-field__slot {
      margin-left: 10px;
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
  color: white;
}

/deep/ .v-select__selection {
  color: white !important;
}

/deep/ .v-select__slot > label {
  color: white;
}

/deep/ .v-input__icon > i {
  color: white;
}

/deep/ .v-text-field--is-booted {
  color: #E56D9B;
  border-color: white;
}

/deep/ .v-file-input__text.v-file-input__text--placeholder {
  color: white;
}

/deep/ .theme--light.v-text-field--solo>.v-input__control>.v-input__slot {
  background-color: rgba(51,51,51,0.8);
}

.finput {
  /deep/ .v-input__control .v-input__slot fieldset {
    color: rgba(254, 118, 164, 0.7) !important;
  }
}

.finput-container {
  display: flex;
  align-items: center;
}
</style>
