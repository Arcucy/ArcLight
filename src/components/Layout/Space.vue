<template>
  <v-app class="layout appstyle">
    <div class="layout-bg">
      <div class="stars">
        <div id='stars' />
        <div id='stars2' />
        <div id='stars3' />
      </div>
      <div id='horizon'>
        <div class='glow' />
      </div>
      <div id='earth' />
    </div>
    <Header />
    <div class="slot-shell" id="slot-shell">
      <slot />
    </div>
    <div class="notice-space" id="notice-space">
    </div>
  </v-app>
</template>

<script>

import Header from '@/components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style scoped src="./Space.css" />

<style lang="less" scoped src="./AppStyle.less" />

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0000 !important;
}
.slot-shell {
  margin-top: 73px;
  position: relative;
  width: 100%;
  flex: 1;
  margin-bottom: 50px;
}

.notice-space {
  margin: 0 auto 0;
  text-align: center;
  padding-bottom: 50px;
}

@media screen and (max-width: 400px){
  .notice {
    font-size: 12px;
  }
}
</style>

<style>
html, body {
  height: 100%;
}

#app {
  height: 100%;
}
</style>
