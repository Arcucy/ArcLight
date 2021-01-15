<template>
  <div>
    <spaceLayout>
      <div class="about-container">
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
      </div>
    </spaceLayout>
  </div>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

export default {
  components: {
    spaceLayout
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
</style>
