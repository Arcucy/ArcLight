<template>
  <div>
    <spaceLayout>
      <div class="upload-single-container">
        <router-link :to="{ name: 'Upload' }" class="back-link">
          <v-icon color="#E56D9B">mdi-chevron-left</v-icon>
          Back to Selection
        </router-link>
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
            label="Solo"
            placeholder="Enter Your Music Title..."
            solo
            color="#FFF"
            style="margin-top: 16px;"
          ></v-text-field>
          <div class="name-desp side-title">Description</div>
          <v-textarea
            solo
            name="input-7-4"
            label="Solo textarea"
          ></v-textarea>
          <v-file-input
            v-model="files"
            color="#FFF"
            chips
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            outlined
            :show-size="1000"
            style="margin-top: 16px;"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                v-if="index < 2"
                color="deep-purple accent-4"
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
          <v-btn color="#E56D9B" depressed light class="side-title">Submit</v-btn>
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
        v-model="failSnackbar"
        color="#E53935"
        timeout="3000"
        top="top"
      >
        Image Read Failed, Try again

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
    </spaceLayout>
  </div>
</template>

<script>

import imgUpload from '@/components/imgUpload/imgUpload.vue'
import spaceLayout from '@/components/Layout/Space.vue'

import singleDefault from '@/assets/image/single.png'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    imgUpload,
    spaceLayout
  },
  data () {
    return {
      singleDefault: singleDefault,
      needUpload: true,
      attachments: [],
      singleCover: '',
      fileContent: '',
      fileRaw: '',
      fileName: '',
      imgUploadDone: 0,
      snackbar: false,
      failSnackbar: false
    }
  },
  computed: {
    ...mapState(['singleCoverFile'])
  },
  methods: {
    ...mapActions(['']),
    submit () {
      let type = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      let ext = this.singleCoverFile.name.split('.').pop()
      console.log('Content-Type:', type[ext])
      this.uploadSingleCoverFile({ data: this.fileRaw, key: this.keyFileContent, type: type[ext] })
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
          this.failSnackbar = true
        }
      }
      this.imgUploadDone += Date.now()
      this.snackbar = true
    }
  },
  mounted () {
    document.title = 'Upload a new Single - ArcLight'
    console.log(this.singleCover)
  }
}
</script>

<style lang="less" scoped>
.upload-single-container {
  margin: 20px auto;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
}

.back-link {
  display: block;
  text-align: left;
  margin-bottom: 16px;
}

.side-title {
  font-weight: 600;
  display: block;
  text-align: left;
  color: white;
}

.user-avatar {
  margin: 0 auto;
}

.app-icon {
  cursor: pointer;
  margin-top: 16px;
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

/deep/ .v-btn__content {
  color: white;
}

/deep/ .v-text-field__slot > textarea {
  color: white;
}

/deep/ .v-text-field__slot > label {
  color: white;
}

/deep/ .v-icon--link {
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
  background-color: rgba(51,51,51,0.5);
}
</style>
