<template>
  <div class="notice">
    {{ $t("developedBy") }}
    <a href="https://github.com/Arcucy" target="_blank">Arcucy</a>
    {{ $t("forProject") }}
    <a href="https://github.com/AyakaLab/ArcLight" target="_blank">ArcLight</a>
    <span v-if="$i18n.locale === 'zhCN'">{{ $t("developedApp") }}</span>
    <br />
    Version {{ version }} {{ detailVersion }}
  </div>
</template>

<script>
import packageJson from '../../package.json'

export default {
  data () {
    return {
      version: '',
      detailVersion: ''
    }
  },
  mounted () {
    this.version = packageJson.version
    this.detailVersion = packageJson.detailVersion
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
  color: #E56D9B !important;
}
.notice {
  color: rgb(177, 177, 177);
  margin: 0 auto 0;
  text-align: center;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 4s;
  padding-bottom: 50px;
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
