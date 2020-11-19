<template>
  <div>
    <spaceLayout>
      <div class="edit-profile-container">
        <div class="edit-header">
          <a @click="backPage()" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            {{ $t('backToProfile') }}
          </a>
        </div>
        <div class="container">
          <div class="avatar input-box">
            <span class="edit-title">{{ $t('avatar') }}</span>
            <avatar class="edit-avatar" :src="userAvatar" :size="140" />
            <span class="edit-content">{{ $t('avatarEditInfo1') }}<br>
            {{ $t('avatarEditInfo2') }}<a href="https://arweave.net/d9SXf_N32hAm3cygt1btmPC-7Dg460VhQEtW8I-cfvU" target="_blank" rel="noopener noreferrer">Arweave Avatar</a></span>
          </div>
          <div class="username input-box">
            <span class="edit-title">{{ $t('username') }}</span>
            <span class="username-text">{{ username }}</span>
            <span class="edit-content">{{ $t('usernameEditInfo1') }}<br>
            {{ $t('usernameEditInfo2') }}<a href="https://mtfvznw2pwxykoicvxpoe7ao5rp4nhaueueux2bbe4klxankdhra.arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0" target="_blank" rel="noopener noreferrer">Arweave ID</a></span>
          </div>
          <div class="location input-box">
            <span class="edit-title">{{ $t('location') }}</span>
            <v-text-field
              v-model="location"
              :placeholder="$t('whereDoYouLive')"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="website input-box">
            <span class="edit-title">{{ $t('officialWebsite') }}</span>
            <v-text-field
              v-model="website"
              :placeholder="$t('websiteAddress')"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="introduction input-box">
            <span class="edit-title">{{ $t('introduction') }}</span>
            <v-textarea
              dark
              solo
              name="introduction"
              :label="$t('howDoYouDescribeYourSelf')"
              auto-grow
              :rules="rules"
              counter
              v-model="intro"
            ></v-textarea>
          </div>
          <div class="netease-id input-box">
            <span class="edit-title">
              <img :src="neteaseLogo" class="id-logo" />
              {{ $t('neteaseCloudMusic') }} ID
            </span>
            <v-text-field
              v-model="neteaseId"
              :placeholder="$t('digitsOfYourId')"
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
              :placeholder="$t('usernameOfSoundCloud')"
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
              :placeholder="$t('usernameOfBandcamp')"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="submit-btn">
            <v-btn color="#E56D9B" depressed light class="side-title" large :loading="submitBtnLoading" @click="submit">{{ $t('save') }}</v-btn>
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

import { getCookie } from '@/util/cookie'

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
        this.failMessage = this.$t('pleaseLoginFirst')
        setTimeout(() => {
          this.$router.push({ name: 'Landing' })
        }, 2000)
      } else {
        this.getUserInfo()
      }
    },
    userInfoUpdateComplete (val) {
      if (val) {
        console.log(val)
        if (val === 'location') {
          this.successSnackbar = true
          this.successMessage = this.$t('locationUpdateSuccess')
        }
        if (val === 'website') {
          this.successSnackbar = true
          this.successMessage = this.$t('websiteUpdateSuccess')
        }
        if (val === 'intro') {
          this.successSnackbar = true
          this.successMessage = this.$t('introductionUpdateSuccess')
        }
        if (val === 'neteaseId') {
          this.successSnackbar = true
          this.successMessage = this.$t('neteaseIdUpdateSuccess')
        }
        if (val === 'soundcloudId') {
          this.successSnackbar = true
          this.successMessage = this.$t('soundCloudIdUpdateSuccess')
        }
        if (val === 'bandcampId') {
          this.successSnackbar = true
          this.successMessage = this.$t('bandcampIdUpdateSuccess')
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
          this.failMessage = this.$t('websiteUrlInvalid')
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
          this.failMessage = this.$t('introductionHasLimit')
        }
      }
      if (this.neteaseId && this.neteaseId !== this.user.neteaseId) {
        if (/\d+/.test(this.neteaseId)) {
          this.updateNeteaseId({ key: this.keyFileContent, value: this.neteaseId })
        } else {
          this.failSnackbar = true
          this.failMessage = this.$t('neteaseCloudMusicIdInvalid')
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
    document.title = this.$t('editProfile') + ' - ArcLight'
  },
  mounted () {
    const c = getCookie('arclight_userkey')
    if (!c && !this.wallet) {
      this.failSnackbar = true
      this.failMessage = this.$t('pleaseLoginFirst')
      setTimeout(() => {
        this.$router.push({ name: 'Landing' })
      }, 2000)
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
