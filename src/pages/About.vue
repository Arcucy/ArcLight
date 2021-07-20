<template>
  <div>
    <spaceLayout>
      <div class="about-container">
        <div class="flexed">
          <div class="arcLight">
            <img :src="arcLight" alt="">
            <span>ArcLight</span>
          </div>
          <div class="arcucy">
            <img :src="arcucy" alt="">
            <span>Arcucy Team</span>
          </div>
        </div>

        <div class="about-title">
          {{ $t('title1') }}
        </div>
        <div class="about-subtitle">
          {{ $t('subtitle1') }} <span class="pink-text">{{ $t('arclight') }}</span> {{ $t('subtitle1part2') }}
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('desp1part1') }}
          </p>
          <p id="p2" class="about-p">
            {{ $t('desp1part2') }}
          </p>
        </div><div class="about-title">
          {{ $t('title2') }}
        </div>
        <div class="about-subtitle">
          {{ $t('weSupport') }} <span class="pink-text">{{ $t('singleMusic') }}</span>, <span class="pink-text">{{ $t('albums') }}</span>, <span class="pink-text">{{ $t('podcasts') }}, <span class="pink-text">{{ $t('soundEffects') }}</span></span>{{ $t('andWithComma') }}<span class="pink-text">{{ $t('paintings') }}</span>
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('desp2part1') }}
          </p>
        </div>
        <div class="about-title">
          {{ $t('title3') }}
        </div>
        <div class="about-subtitle">
          {{ $t('subtitle3') }} <span class="pink-text">{{ $t('secureWay') }}</span> {{ $t('toStoreYourArtworks') }}
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('desp3part1') }}
          </p>
        </div>
        <div class="about-subtitle">
          <span class="pink-text">{{ $t('thankYouForChoosingArcLight') }}</span>
        </div>

        <div class="arcLight-link">
          <a href="https://github.com/Arcucy/ArcLight" target="_blank">GitHub 源码</a>
          <a href="https://update.arcucy.io" target="_blank">官方博客</a>
          <a href="https://t.me/ArclightMusic" target="_blank">Telegram 群组</a>
          <a href="https://discord.gg/3zUXrnXyFv" target="_blank">Discord 群组</a>
          <a href="mailto:contact@arcucy.io" target="_blank">联系我们</a>
        </div>
      </div>
    </spaceLayout>
  </div>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

import arcLight from '@/assets/image/ArcLight.png'
import arcucy from '@/assets/image/Arcucy.png'

export default {
  components: {
    spaceLayout
  },
  data () {
    return {
      arcLight: arcLight,
      arcucy: arcucy
    }
  },
  mounted () {
    document.title = 'Why Choose ArcLight - ArcLight Music Distribution Platform'
  }
}
</script>

<style lang="less" scoped>
.about-container {
  margin: 80px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
  text-align: start;
}

.about-title {
  font-size: 32px;
  color: white;
}

.about-subtitle {
  font-size: 20px;
  color: white;
}

.about-content {
  color: white;
  margin-top: 20px;
  line-height: 28px;
  font-size: 18px;
}

.about-p {
  a {
    color: #EA6290;
    text-decoration: none;
  }
}

.pink-text {
  color: #EA6290;
}

.flexed {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arcLight {
  line-height: 60px;
  vertical-align: middle;
}

.arcLight img {
  width: 50px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}

.arcLight span {
  line-height: 60px;
  vertical-align: middle;
  font-size: 40px;
  color: white;
  margin: 0 20px 5px 20px;
}

.arcucy {
  line-height: 50px;
  vertical-align: middle;
  margin-bottom: 20px;
}

.arcucy img {
  vertical-align: middle;
  width: 40px;
  height: 40px;
}

.arcucy span {
  font-size: 20px;
  color: white;
  margin: 0 20px 5px 20px;
}

.arcLight-link {
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.arcLight-link a {
  margin-right: 20px;
  color: white !important;
  text-decoration: none;
  transition: all 0.2s ease;
}

.arcLight-link a:hover {
  color: #FA589A !important;
}
</style>
