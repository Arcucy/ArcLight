<template>
  <div class="card">
    <div class="card-avatar">
      <avatar :src="avatar" :size="size" />
    </div>
    <h1 class="card-nickname">
      {{ nickname }}
    </h1>
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
  data () {
    return {
      size: 140
    }
  },
  computed: {
    avatar () {
      return this.user.avatar
    },
    nickname () {
      return this.user.nickname
    }
  },
  mounted () {
    this.adaptive()
    window.addEventListener('resize', this.adaptive)
  },
  destroyed () {
    window.removeEventListener('resize', this.adaptive)
  },
  methods: {
    adaptive () {
      this.size = window.innerWidth > 992 ? 140 : 100
    }
  }
}
</script>

<style lang="less" scoped>
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
