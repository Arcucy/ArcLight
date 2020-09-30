<template>
  <div>
    <spaceLayout>
      <div class="edit-profile-container">
        <div class="edit-header">
          <a @click="backPage()" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Profile
          </a>
        </div>
        <div class="container">
          <div class="avatar input-box">
            <span class="edit-title">Avatar</span>
            <avatar class="edit-avatar" :src="userAvatar" :size="140" />
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
        v-model="successSnackbar"
        color="#00C853"
        timeout="3000"
        top="top"
        style="margin-top: 16px;"
      >
        {{ successMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="successSnackbar = false"
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

import spaceLayout from '@/components/Layout/Space.vue'
import avatar from '@/components/User/Avatar'

import neteaseLogo from '@/assets/image/neteasecloudmusic.png'
import soundcloudLogo from '@/assets/image/soundcloud.png'
import bandcampLogo from '@/assets/image/bandcamp.png'

import API from '@/api/api'

export default {
  inject: ['backPage'],
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
      failMessage: '',
      successSnackbar: false,
      successMessage: '',
      user: {
        location: '',
        website: '',
        intro: '',
        neteaseId: '',
        soundcloudId: '',
        bandcampId: ''
      }
    }
  },
  computed: {
    ...mapState(['username', 'keyFileContent', 'wallet', 'userAvatar'])
  },
  watch: {
    wallet (val) {
      if (!val) {
        this.failSnackbar = true
        this.failMessage = 'Please Login First'
        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 2000)
      }
    },
    userInfoUpdateComplete (val) {
      if (val) {
        console.log(val)
        if (val === 'location') {
          this.successSnackbar = true
          this.successMessage = 'Location Update Successfully'
        }
        if (val === 'website') {
          this.successSnackbar = true
          this.successMessage = 'Website Update Successfully'
        }
        if (val === 'intro') {
          this.successSnackbar = true
          this.successMessage = 'Introduction Update Successfully'
        }
        if (val === 'neteaseId') {
          this.successSnackbar = true
          this.successMessage = 'Netease CloudMusic ID Update Successfully'
        }
        if (val === 'soundcloudId') {
          this.successSnackbar = true
          this.successMessage = 'SoundCloud ID Update Successfully'
        }
        if (val === 'bandcampId') {
          this.successSnackbar = true
          this.successMessage = 'Bandcamp ID Update Successfully'
        }
      }
    }
  },
  methods: {
    ...mapActions(['updateLocation', 'updateWebsite', 'updateIntro', 'updateNeteaseId', 'updateSoundCloudId', 'updateBandcampId', 'userInfoUpdateComplete']),
    submit () {
      if (this.location && this.location !== this.user.location) {
        this.updateLocation({ key: this.keyFileContent, value: this.location })
      }
      if (this.website && this.website !== this.user.website) {
        if (/^(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_.~#?&//=]*)|(((\d+\.\d+\.\d+\.\d+))(:\d{0,5})?)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_.~#?&//=]*)$/.test(this.website)) {
          this.updateWebsite({ key: this.keyFileContent, value: this.website })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Invalid Website URL'
        }
      }
      if (this.intro && this.intro !== this.user.introduction) {
        if (this.intro.length < 1001) {
          let intro = this.intro

          intro = intro.replace(/<br>/gm, '\\n')
          intro = intro.replace(/<[^>]*>/gmu, '')
          intro = intro.replace(/\\n/gmu, '<br>')

          this.updateIntro({ key: this.keyFileContent, value: intro })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Introduction Length has 1000 characters limit'
        }
      }
      if (this.neteaseId && this.neteaseId !== this.user.neteaseId) {
        if (/\d+/.test(this.neteaseId)) {
          this.updateNeteaseId({ key: this.keyFileContent, value: this.neteaseId })
        } else {
          this.failSnackbar = true
          this.failMessage = 'Invalid Netease CloudMusic User ID'
        }
      }
      if (this.soundcloudId && this.soundcloudId !== this.user.soundcloudId) {
        this.updateSoundCloudId({ key: this.keyFileContent, value: this.soundcloudId })
      }
      if (this.bandcampId && this.bandcampId !== this.user.bandcampId) {
        this.updateBandcampId({ key: this.keyFileContent, value: this.bandcampId })
      }
    },
    getUserInfo () {
      API.arweave.getLocationFromAddress(this.wallet).then(location => {
        if (location) {
          this.user.location = location
          this.location = location
        }
      })
      API.arweave.getWebsiteFromAddress(this.wallet).then(website => {
        if (website) {
          this.user.website = website
          this.website = website
        }
      })
      API.arweave.getIntroFromAddress(this.wallet).then(introduction => {
        if (introduction) {
          this.user.introduction = introduction
          this.intro = introduction
        }
      })
      API.arweave.getNeteaseIdFromAddress(this.wallet).then(neteaseId => {
        if (neteaseId) {
          this.user.neteaseId = neteaseId
          this.neteaseId = neteaseId
        }
      })
      API.arweave.getSoundCloudIdFromAddress(this.wallet).then(soundcloudId => {
        if (soundcloudId) {
          this.user.soundcloudId = soundcloudId
          this.soundcloudId = soundcloudId
        }
      })
      API.arweave.getBandCampFromAddress(this.wallet).then(bandcampId => {
        if (bandcampId) {
          this.user.bandcampId = bandcampId
          this.bandcampId = bandcampId
        }
      })
    }
  },
  created () {
    document.title = 'Edit Profile - ArcLight'
  },
  mounted () {
    if (!this.wallet) {
      this.failSnackbar = true
      this.failMessage = 'Please Login First'
      setTimeout(() => {
        this.$router.push({ name: 'Landing' })
      }, 2000)
    }
    this.getUserInfo()
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

.container {
  .edit-avatar {
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
    color: white !important;
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
