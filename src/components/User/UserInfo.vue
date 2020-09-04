<template>
  <div class="userinfo">
    <div class="userinfo-avatar">
      <avatar :src="avatar" :size="140" />
    </div>
    <h1 class="userinfo-nickname">
      {{ nickname }}
    </h1>
    <P class="userinfo-introduction" v-html="introduction" />
    <v-btn small class="userinfo-btn" outlined light>
      <v-icon left>mdi-pencil</v-icon>
      EDIT PROFILE
    </v-btn>
  </div>
</template>

<script>
import avatar from '@/components/User/Avatar'

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

  computed: {
    avatar () {
      return this.user.avatar
    },
    nickname () {
      return this.user.nickname
    },
    introduction () {
      return this.user.introduction
    }
  }
}
</script>

<style lang="less" scoped>
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
    margin: 23px 0 0;
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    color: white;
    line-height: 22px;
    max-width: 720px;
  }
  &-btn {
    position: relative;
    color: white;
    position: absolute;
    right: 0;
    top: 159px;
  }
}

</style>
