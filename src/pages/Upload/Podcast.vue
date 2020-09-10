<template>
  <div>
    <spaceLayout>
      <div class="upload-podcast-container">
        <div class="upload-header">
          <router-link :to="{ name: 'Upload' }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Selection
          </router-link>
        </div>
        <div class="container">
          <div class="cover-title side-title">Podcast Cover</div>
          <img-upload
          :img-upload-done="imgUploadDone"
          :update-type="'podcast'"
          class="app-icon"
          @doneImageUpload="doneImageUpload"
          >
            <div
              slot="uploadButton"
              class="user-avatar"
            >
              <div class="edit">
                <v-icon color="#FFF">mdi-camera</v-icon>
                Podcast Cover
              </div>
              <img
                id="avatar"
                v-if="podcastCover"
                slot="description"
                :src="podcastCover"
                alt="avatar"
              >
              <img v-else id="new-logo" src="../../assets/image/podcast.png" style="margin-top: 10px;"/>
            </div>
          </img-upload>
          <div class="name-title side-title">Podcast Title (Update old podcast = same title)</div>
          <v-text-field
            v-model="podcastTitle"
            label="Solo"
            placeholder="Enter Your Podcast Title..."
            solo
            color="#FFF"
            style="margin-top: 16px;"
          ></v-text-field>
          <div class="name-title side-title">Program Title</div>
          <v-text-field
            v-model="programTitle"
            label="Solo"
            placeholder="Enter Your Program Title..."
            solo
            color="#FFF"
            style="margin-top: 16px;"
          ></v-text-field>
          <div class="name-desp side-title">Description</div>
          <v-textarea
            v-model="podcastDesp"
            solo
            name="input-7-4"
            label="Your podcast Description..."
          ></v-textarea>
          <div class="name-desp side-title">Category</div>
          <podcastSelect v-model="category" style="margin-bottom: 16px;" />
          <div class="name-desp side-title">Demo Duration</div>
          <v-select
            v-model="duration"
            :items="durationSelection"
            label="Select Demo duration"
            solo
          ></v-select>
          <div class="name-desp side-title">Price</div>
          <v-text-field
            v-model="price"
            class="price"
            id="price"
            solo
            label="Prepend"
            prepend-inner-icon="mdi-cash-multiple"
          ></v-text-field>
          <v-file-input
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
        v-model="podcastSnackbar"
        color="#00C853"
        timeout="3000"
        top="top"
      >
        Podcast Release Successful

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="podcastSnackbar = false"
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
import podcastSelect from '@/components/PodcastCategorySelect.vue'

import podcastDefault from '@/assets/image/podcast.png'

import { getCookie } from '@/util/cookie'

export default {
  components: {
    imgUpload,
    spaceLayout,
    podcastSelect
  },
  data () {
    return {
      file: null,
      category: '',
      duration: '',
      price: 0,
      podcastDefault: podcastDefault,
      podcastTitle: '',
      programTitle: '',
      podcastDesp: '',
      needUpload: true,
      attachments: [],
      podcastCover: '',
      fileContent: '',
      fileRaw: '',
      fileName: '',
      imgUploadDone: 0,
      music: '',
      musicContent: '',
      snackbar: false,
      failSnackbar: false,
      podcastSnackbar: false,
      failMessage: '',
      submitBtnLoading: false,
      durationSelection: ['10s', '30s', '60s', 'Off']
    }
  },
  computed: {
    ...mapState(['podcastCoverFile', 'isLoggedIn', 'keyFileContent', 'podcastUploadComplete', 'podcastLink'])
  },
  watch: {
    podcastUploadComplete (val) {
      this.submitBtnLoading = false
      this.podcastSnackbar = true

      setTimeout(() => {
        this.$router.push({ path: '/music/' + this.podcastLink })
      }, 2000)
    }
  },
  methods: {
    ...mapActions(['uploadPodcastCoverFile', 'reviewPodcast']),
    submit () {
      this.submitBtnLoading = true
      if (this.podcastCover === '') {
        this.failMessage = 'A cover for a podcast release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.podcastTitle === '') {
        this.failMessage = 'A title for your Podcast release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.programTitle === '') {
        this.failMessage = 'A title for a program (episode) release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (this.podcastDesp === '') {
        this.failMessage = 'A description for a podcast release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      if (!this.category) {
        this.failMessage = 'Please select the category of your program (None for blank)'
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

      if (!this.file) {
        this.failMessage = 'A source music file for a podcast release is required'
        this.failSnackbar = true
        this.submitBtnLoading = false
        return
      }

      const newCategory = this.category.split('(').pop().trim()

      let imgType = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      let ext = this.podcastCoverFile.name.split('.').pop()
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
        const dataObj = {
          img: { data: this.fileRaw, type: imgType[ext] },
          music: { data: this.music, type: audioType[aext], read: this.file },
          key: this.keyFileContent,
          podcast: {
            podcast: this.podcastTitle,
            title: this.programTitle,
            desp: this.podcastDesp,
            category: newCategory,
            duration: this.duration,
            price: parseFloat(this.price)
          }
        }
        this.reviewPodcast(dataObj)
        this.$router.push({ name: 'ReviewPodcast', params: { data: { music: this.music, raw: this.musicContent, file: this.file } } })
      }
    },
    doneImageUpload () {
      this.podcastCover = this.podcastCoverFile
      this.fileName = this.podcastCover.name
      const reader = new FileReader()
      reader.readAsDataURL(this.podcastCover)
      reader.onload = async (e) => {
        try {
          this.fileContent = e.target.result
          this.fileRaw = this.fileContent
          this.needUpload = false
          this.podcastCover = this.fileRaw
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
    document.title = 'Upload a new Podcast - ArcLight'

    const c = getCookie('arclight_userkey')
    setTimeout(() => {
      if (!c || !this.isLoggedIn) {
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
.upload-podcast-container {
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
</style>
