<template>
  <div>
    <spaceLayout>
      <div class="edit-profile-container">
        <div class="edit-header">
          <router-link :to="() => { $router.go(-1) }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Profile
          </router-link>
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
              v-model="intro"
            ></v-textarea>
          </div>
          <div class="netease-id input-box">
            <span class="edit-title">Netease CloudMusic ID</span>
            <v-text-field
              v-model="neteaseId"
              placeholder="The digits of your id"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="soundcloud-id input-box">
            <span class="edit-title">SoundCloud ID</span>
            <v-text-field
              v-model="soundcloudId"
              placeholder="User is is after soundcloud.com/"
              solo
              dark
            ></v-text-field>
          </div>
          <div class="bandcamp-id input-box">
            <span class="edit-title">BandCamp ID</span>
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
    </spaceLayout>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space.vue'
import avatar from '@/components/User/Avatar'

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
      neteaseId: '',
      soundcloudId: '',
      bandcampId: '',
      submitBtnLoading: false
    }
  },
  computed: {
    ...mapState(['userPage', 'username']),
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
  methods: {
    submit () {
    }
  },
  created () {
    document.title = 'Edit Profile - ArcLight'
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
}

.edit-content {
  color: white;
  margin-bottom: 10px;
}
</style>
