<template>
  <div>
    <spaceLayout>
      <div class="edit-profile-container">
        <div class="edit-header">
          <a @click="() => { $router.go(-1) }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Profile
          </a>
        </div>
        <div class="container">
          <div class="avatar input-box">
            <span class="edit-title">Avatar</span>
            <avatar class=avatar-img :src="userPage.avatar" :size="140" />
            <span class="edit-content">Sorry, we don't provide any avatar storage option here<br>
            To change your avatar, please go to <a href="https://arweave.net/d9SXf_N32hAm3cygt1btmPC-7Dg460VhQEtW8I-cfvU">Arweave Avatar</a></span>
          </div>
          <div class="username input-box">
            <span class="edit-title">Username</span>
            <span class="username-text">{{ username }}</span>
            <span class="edit-content">Sorry, we don't provide any arweave id storage option here<br>
            To change your avatar, please go to <a href="https://mtfvznw2pwxykoicvxpoe7ao5rp4nhaueueux2bbe4klxankdhra.arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0">Arweave ID</a></span>
          </div>
          <div class="location input-box">
            <span class="edit-title">Location</span>
            <v-text-field
              v-model="location"
              placeholder="Where do you live?"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="website input-box">
            <span class="edit-title">Personal / Band Website</span>
            <v-text-field
              v-model="website"
              placeholder="Website address..."
              solo
              dark
            ></v-text-field>
          </div>
          <div class="introduction input-box">
            <span class="edit-title">Introduction</span>
            <v-textarea
              dark
              solo
              name="introduction"
              label="How do you describe your self?"
              auto-grow
              :rules="rules"
              counter
              v-model="intro"
            ></v-textarea>
          </div>
          <div class="netease-id input-box">
            <span class="edit-title">
              <img :src="neteaseLogo" class="id-logo" />
              Netease CloudMusic ID
            </span>
            <v-text-field
              v-model="neteaseId"
              placeholder="The digits of your id"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="soundcloud-id input-box">
            <span class="edit-title">
              <img :src="soundcloudLogo" class="id-logo" />
              SoundCloud ID
            </span>
            <v-text-field
              v-model="soundcloudId"
              placeholder="User id is is after the soundcloud.com/"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="bandcamp-id input-box">
            <span class="edit-title">
              <img :src="bandcampLogo" class="id-logo" />
              BandCamp ID
            </span>
            <v-text-field
              v-model="bandcampId"
              placeholder="Username as the username.bandcamp.com"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="submit-btn">
            <v-btn color="#E56D9B" depressed light class="side-title" large :loading="submitBtnLoading" @click="submit">Save</v-btn>
          </div>
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
    </spaceLayout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space.vue'
import avatar from '@/components/User/Avatar'

import neteaseLogo from '@/assets/image/neteasecloudmusic.png'
import soundcloudLogo from '@/assets/image/soundcloud.png'
import bandcampLogo from '@/assets/image/bandcamp.png'

export default {
  components: {
    spaceLayout,
    avatar
  },
  data () {
    return {
      location: '',
      website: '',
      intro: '',
      rules: [v => v.length <= 1000 || 'Max 1000 characters'],
      neteaseId: '',
      neteaseLogo: neteaseLogo,
      soundcloudId: '',
      soundcloudLogo: soundcloudLogo,
      bandcampId: '',
      bandcampLogo: bandcampLogo,
      submitBtnLoading: false,
      failSnackbar: false,
      failMessage: ''
    }
  },
  computed: {
    ...mapState(['userPage', 'username', 'keyFileContent']),
    user () {
      let introduction = ''
      if (this.userPage.introduction === '') {
        introduction = 'No Introduction Yet'
      } else {
        introduction = this.userPage.introduction
      }
      return { nickname: this.userPage.nickname, avatar: this.userPage.avatar, introduction: introduction, type: this.userPage.type }
    }
  },
  watch: {
    userPage (val) {
      if (val.location) {
        this.location = val.location
      }
      if (val.website) {
        this.website = val.website
      }
      if (val.intro) {
        this.intro = val.introduction
      }
      if (val.neteaseId) {
        this.neteaseId = val.neteaseId
      }
      if (val.soundcloudId) {
        this.soundcloudId = val.soundcloudId
      }
      if (val.bandcampId) {
        this.bandcampId = val.bandcampId
      }
    }
  },
  methods: {
    ...mapActions(['updateLocation', 'updateWebsite', 'updateIntro', 'updateNeteaseId', 'updateSoundCloudId', 'updateBandcampId']),
    submit () {
      if (this.location && this.location !== this.userPage.location) {
        this.updateLocation({ key: this.keyFileContent, value: this.location })
      }
      if (this.website && this.website !== this.userPage.website) {
        if (/(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/.test(this.website)) {
          this.updateWebsite({ key: this.keyFileContent, value: this.website })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Invalid Website URL'
        }
      }
      if (this.intro && this.intro !== this.userPage.introduction) {
        if (this.intro.length < 1001) {
          this.updateIntro({ key: this.keyFileContent, value: this.intro })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Introduction Length has 1000 characters limit'
        }
      }
      if (this.neteaseId && this.neteaseId !== this.userPage.neteaseId) {
        if (/\d+/.test(this.neteaseId)) {
          this.updateNeteaseId({ key: this.keyFileContent, value: this.neteaseId })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Invalid Netease CloudMusic User ID'
        }
      }
      if (this.soundcloudId && this.soundcloudId !== this.userPage.soundcloudId) {
        this.updateSoundCloudId({ key: this.keyFileContent, value: this.soundcloudId })
      }
      if (this.bandcampId && this.bandcampId !== this.userPage.bandcampId) {
        this.updateBandcampId({ key: this.keyFileContent, value: this.bandcampId })
      }
    }
  },
  created () {
    document.title = 'Edit Profile - ArcLight'
  },
  mounted () {
    if (this.userPage.location) {
      this.location = this.userPage.location
    }
    if (this.userPage.website) {
      this.website = this.userPage.website
    }
    if (this.userPage.introduction) {
      this.intro = this.userPage.introduction
    }
    if (this.userPage.neteaseId) {
      this.neteaseId = this.userPage.neteaseId
    }
    if (this.userPage.soundcloudId) {
      this.soundcloudId = this.userPage.soundcloudId
    }
    if (this.userPage.bandcampId) {
      this.bandcampId = this.userPage.bandcampId
    }
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
.edit-profile-container {
  margin: 48px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
}

.edit-header {
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

.avatar {
  &-img {
    margin-bottom: 16px;
  }
  a {
    text-decoration: none;
    color: #E56D9B;
    &:hover {
      font-weight: 800;
    }
  }
}

.username {
  &-text {
    font-size: 24px;
    color: white;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    margin-bottom: 16px;
  }
  a {
    text-decoration: none;
    color: #E56D9B;
    &:hover {
      font-weight: 800;
    }
  }
}

.id-logo {
  height: 25px;
  margin-right: 10px;
}

.input-box {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.submit-btn {
  text-align: left;
  button {
    color: white;
  }
}

.edit-title {
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.edit-content {
  color: white;
  margin-bottom: 10px;
}
</style>
