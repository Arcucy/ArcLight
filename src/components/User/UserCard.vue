<template>
  <router-link :to="toUrl">
    <div class="card">
      <div class="card-avatar">
        <avatar :src="avatar" :size="size" />
      </div>
      <h1 class="card-nickname">
        {{ nickname }}
      </h1>
    </div>
  </router-link>
</template>

<script>
import api from '@/api/api'

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
  data () {
    return {
      size: 140,
      avatar: 'Loading'
    }
  },
  computed: {
    toUrl () {
      return this.user && this.user.address ? { name: 'User', params: { id: this.user.address } } : {}
    },
    nickname () {
      return this.user.nickname
    }
  },
  watch: {
    user () {
      this.getAvatar()
    }
  },
  mounted () {
    this.adaptive()
    window.addEventListener('resize', this.adaptive)
    this.getAvatar()
  },
  destroyed () {
    window.removeEventListener('resize', this.adaptive)
  },
  methods: {
    adaptive () {
      this.size = window.innerWidth > 992 ? 140 : 100
    },
    async getAvatar () {
      if (!this.user || !this.user.address) return
      try {
        const address = this.user.address
        const avatar = await api.arweave.getAvatarFromAddress(this.user.address)
        if (address !== this.user.address) return
        this.avatar = avatar || ''
      } catch (e) {
        console.error(`[Unable to get avatar] type: ${e.type}, address: ${this.user.address}, error:`, e)
        this.avatar = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
.card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 140px;
  &-avatar {
    width: 140px;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  &-nickname {
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: white;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
}

@media screen and (max-width: 992px) {
  .card {
    width: 100px;
    &-avatar {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
