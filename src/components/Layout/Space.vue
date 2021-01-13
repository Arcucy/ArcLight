<template>
  <v-app class="layout appstyle">
    <div class="layout-bg">
      <div class="stars">
        <img id='stars' :src="backgroundStar"/>
      </div>
      <div id='horizon'>
        <div class='glow'/>
      </div>
      <div id='earth'/>
    </div>
    <Header/>
    <div class="slot-shell">
      <div>
        <div class="arcLight">
          <img :src="arcLight" alt="">
          <span>ArcLight</span>
        </div>
        <div class="arcucy">
          <img :src="arcucy" alt="">
          <span>Arcucy Team</span>
        </div>
      </div>
      <slot/>
    </div>
    <div class="notice">
      {{ $t('developedBy') }}
      <a href="https://github.com/Arcucy" target="_blank">Arcucy Team</a>
      {{ $t('forProject') }}
      <a href="https://github.com/AyakaLab/ArcLight" target="_blank">ArcLight </a>
      <span v-if="$i18n.locale === 'zhCN'">{{ $t('developedApp') }}</span>
      <br>
      Version {{ version }} {{ detailVersion }}
    </div>
  </v-app>
</template>

<script>

import backgroundStar from '@/assets/image/star.png'
import Header from '@/components/Header.vue'
import packageJson from '../../../package.json'

export default {
  components: {
    Header
  },
  data () {
    return {
      version: '',
      detailVersion: '',
      backgroundStar: backgroundStar
    }
  },
  mounted () {
    this.version = packageJson.version
    this.detailVersion = packageJson.detailVersion
  }
}
</script>

<style scoped src="./Space.css"/>

<style lang="less" scoped src="./AppStyle.less"/>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  background: #0000 !important;
}

.slot-shell {
  margin-top: 73px;
  position: relative;
  width: 100%;
  flex: 1;
}

.notice {
  color: rgb(177, 177, 177);
  margin: 50px auto 0;
  text-align: center;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 4s;
  padding-bottom: 116px;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@media screen and (max-width: 400px) {
  .notice {
    font-size: 12px;
  }
}

</style>
