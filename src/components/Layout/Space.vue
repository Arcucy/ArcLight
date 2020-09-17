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
    <div class="slot-shell">
      <slot />
    </div>
    <div class="notice">
      Developed by
      <a href="https://github.com/AyakaLab">Ayaka Lab</a>
      for Project
      <a href="https://github.com/AyakaLab/ArcLight">ArcLight</a>
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
  background: #0000;
}
.slot-shell {
  margin-top: 73px;
  position: relative;
  width: 100%;
  flex: 1;
}

.notice {
  color: rgb(177, 177, 177);
  margin: 50px auto 50px;
  text-align: center;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 4s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
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
