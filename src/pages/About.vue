<template>
  <div>
    <spaceLayout>
      <div class="about-container">
        <div class="about-title">
          {{ $t('whyArcLight') }} ?
        </div>
        <div class="about-subtitle">
          {{ $t('about') }} Project <span class="pink-text">{{ $t('arcLightLocalized') }}</span>
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('about1P1Part1') }} <a href="https://gitcoin.co/issue/ArweaveTeam/Bounties/32/100023546">Gitcoin bounty</a> {{ $t('about1P1Part2') }}
          </p>
          <p id="p2" class="about-p">
            {{ $t('about1P2Part1') }}
          </p>
        </div><div class="about-title">
          {{ $t('allDifferent') }} <span class="pink-text">{{ $t('sound') }}</span>
        </div>
        <div class="about-subtitle">
          {{ $t('weSupport') }} <span class="pink-text">{{ $t('singleMusic') }}</span>, <span class="pink-text">{{ $t('albums') }}</span>, <span class="pink-text">{{ $t('podcasts') }}</span>{{ $t('andWithComma') }}<span class="pink-text">{{ $t('soundEffects') }}</span>
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('about2P1Part1') }}
          </p>
          <p id="p2" class="about-p">
            {{ $t('about2P1Part2') }}
          </p>
        </div>
        <div class="about-title">
          <span class="pink-text">{{ $t('encryption') }}</span>{{ $t('andWithSpace') }}<span class="pink-text">{{ $t('profit') }}</span>
        </div>
        <div class="about-subtitle">
          <span class="pink-text">{{ $t('secureWay') }}</span> {{ $t('toStoreYourArtworks') }}
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('about3P1Part1') }}
          </p>
          <p id="p2" class="about-p">
            {{ $t('about3P2Part1') }}
          </p>
        </div>
        <div class="about-title">
          <span class="pink-text">{{ $t('ensure') }}</span>{{ $t('yourWithSpace') }}<span class="pink-text">{{ $t('rewards') }}</span>
        </div>
        <div class="about-subtitle">
          <span class="pink-text">{{ $t('validation') }}</span> {{ $t('ofThePayments') }}
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            {{ $t('about4P1Part1') }}
          </p>
          <p id="p2" class="about-p">
            {{ $t('about4P2Part1') }}
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
