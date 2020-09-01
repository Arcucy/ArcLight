<template>
  <div class="landing-container">
    <Header />
    <div id='stars' />
    <div id='stars2' />
    <div id='stars3' />
    <div id='horizon'>
      <div class='glow' />
    </div>
    <div id='earth' />
    <div class="notice">
      Developed by
      <a href="https://github.com/nekomeowww">Ayaka Neko</a>
      for Project
      <a href="https://github.com/AyakaLab/ArcLight">ArcLight</a>
    </div>
    <div class="slot-shell">
      <slot />
    </div>
  </div>
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

<style scoped>
.slot-shell {
  position: relative;
}

.notice {
  position: fixed;
  color: rgb(177, 177, 177);
  bottom: 30px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 6s;
}

@media screen and (max-width: 400px){
  .notice {
    font-size: 12px;
  }
}
</style>

<style>
html {
  overflow: hidden !important;
}
</style>
