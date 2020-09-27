<template>
  <spaceLayout>
    <div class="user">
      <userInfo class="user-info" :id="$route.params.id" />
      <router-view />
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import userInfo from '@/components/User/UserInfo'

export default {
  components: {
    spaceLayout,
    userInfo
  },
  inject: ['routerRefresh'],
  watch: {
    $route (val, oldVal) {
      if (val.params.id !== oldVal.params.id) this.routerRefresh()
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  margin: 48px auto;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;
  &-info {
    margin-bottom: 48px;
  }
}
</style>
