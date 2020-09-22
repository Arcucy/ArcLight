<template>
  <div class="userinfo">
    <div class="userinfo-avatar">
      <avatar :src="avatar" :size="140" />
    </div>
    <h1 class="userinfo-nickname">
      {{ nickname }}
    </h1>
    <div v-if="location" class="userinfo-location">
      <v-icon color="#DDD">mdi-map-marker</v-icon>
      <h4>
        {{ location }}
      </h4>
    </div>
    <div v-if="website" class="userinfo-website">
      <a :href="website" target="_blank">{{ website }}</a>
    </div>
    <div class="userinfo-resource">
        <a v-if="neteaseId" :href="'https://music.163.com/#/user/home?id=' + neteaseId" target="_blank">
          <img :src="neteaseLogo" class="id-logo" />
        </a>
        <a v-if="soundcloudId" :href="'https://soundcloud.com/' + soundcloudId" target="_blank">
          <img :src="soundcloudLogo" class="id-logo" />
        </a>
        <a v-if="bandcampId" :href="'https://' + bandcampId + '.bandcamp.com'" target="_blank">
          <img :src="bandcampLogo" class="id-logo" />
        </a>
    </div>
    <P class="userinfo-introduction" v-html="introduction" />
    <v-btn v-if="isMe" small class="userinfo-btn" color="#FFF" outlined light @click="edit">
      <v-icon left>mdi-pencil</v-icon>
      EDIT PROFILE
    </v-btn>
    <v-btn v-if="isMe" x-small fab class="mobile mobile-userinfo-btn" color="#FFF" outlined light @click="edit">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script>
import avatar from '@/components/User/Avatar'

import neteaseLogo from '@/assets/image/neteasecloudmusic.png'
import soundcloudLogo from '@/assets/image/soundcloud.png'
import bandcampLogo from '@/assets/image/bandcamp.png'
import { mapState } from 'vuex'

export default {
  components: {
    avatar
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      neteaseLogo: neteaseLogo,
      soundcloudLogo: soundcloudLogo,
      bandcampLogo: bandcampLogo
    }
  },
  computed: {
    ...mapState(['isMe']),
    avatar () {
      return this.user.avatar
    },
    nickname () {
      return this.user.nickname
    },
    introduction () {
      return this.user.introduction
    },
    location () {
      return this.user.location
    },
    website () {
      return this.user.website
    },
    neteaseId () {
      return this.user.neteaseId
    },
    soundcloudId () {
      return this.user.soundcloudId
    },
    bandcampId () {
      return this.user.bandcampId
    }
  },
  watch: {
    user (val) {
      console.log('updated', val)
    }
  },
  methods: {
    edit () {
      this.$router.push({ name: 'Edit' })
    }
  },
  created () {
    console.log(this.user)
  }
}
</script>

<style lang="less" scoped>
.mobile {
  display: none;
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  &-avatar {
    width: 140px;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-nickname {
    margin: 16px 145px 0;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    color: white;
    line-height: 33px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  &-introduction {
    margin: 16px 0 0;
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    color: white;
    line-height: 22px;
    max-width: 720px;
  }
  &-location {
    margin-top: 5px;
    color: white;
    display: flex;
    h4 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }
  &-website {
    margin-top: 10px;
    a {
      text-decoration: none;
      color: #EC4E6F;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }
  &-resource {
    margin-top: 16px;
    .id-logo {
      height: 25px;
      margin-right: 10px;
    }
  }
  &-btn {
    position: relative;
    color: white;
    position: absolute;
    right: 0;
    top: 159px;
  }
}
@media screen and (max-width: 992px) {
  .userinfo-btn {
    display: none;
  }
  .mobile-userinfo-btn {
    display: block;
    color: white;
    position: absolute;
    right: 20px;
    top: 159px;
  }
}
@media screen and (max-width: 768px) {
  .userinfo {
    &-nickname {
      margin: 16px 40px 0px;
    }
  }
}
@media screen and (max-width: 640px) {
}
@media screen and (max-width: 480px) {
}
</style>
