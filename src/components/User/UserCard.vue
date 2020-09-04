<template>
  <div class="card">
    <div class="card-avatar">
      <avatar :src="avatar" :size="140" />
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
  computed: {
    avatar () {
      return this.user.avatar
    },
    nickname () {
      return this.user.nickname
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
</style>
