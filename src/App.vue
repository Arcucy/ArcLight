<template>
  <div id="app" v-if="routerAlive">
    <router-view/>
    <Player />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import Player from '@/components/Player'

export default {
  name: 'App',
  components: {
    Player
  },
  data () {
    return {
      routerAlive: true
    }
  },
  provide () {
    return {
      routerRefresh: this.routerRefresh,
      updateQuery: this.updateQuery,
      backPage: this.backPage
    }
  },
  methods: {
    ...mapMutations(['setAppLang', 'setPreferredCurrency', 'setAlwaysUseAr']),
    /** 对页面进行软刷新，不会丢失 vuex 中的数据 */
    routerRefresh () {
      this.routerAlive = false
      this.$nextTick(() => {
        this.routerAlive = true
      })
    },
    /** 更改 Query */
    updateQuery (key, val) {
      const query = { ...this.$route.query }
      if (query[key] !== val) {
        if (!val) delete query[key]
        else query[key] = val
        this.$router.replace({ query }).catch(e => { // 过滤掉不必要的错误
          if (!e.message.includes('Avoided redundant navigation to current location')) {
            console.error(e.message)
          }
        })
      }
    },
    backPage (defaultLink) {
      const originRoute = { ...this.$route }
      const pushLink = defaultLink || { name: 'Landing' }
      this.$router.go(-1)
      // 如果页面没有变化，返回失败，将回到默认页面
      this.$nextTick(() => {
        if (this.$route.fullPath === originRoute.fullPath) {
          this.$router.push(pushLink)
        }
      })
    },
    getBrowserLangCode () {
      const lang = navigator.languages
      for (let i = 0; i < lang.length; i++) {
        const item = lang[i]
        if (item === 'zh-CN') return item
        if (item === 'zh-TW') return item
        if (item === 'en-US') return item
        if (item === 'ja-JP') return item
      }
    },
    getLangCode () {
      const localStore = window.localStorage || localStorage
      this.setAppLang(localStore.getItem('locale_lang'))
      return localStore.getItem('locale_lang')
    },
    setLangCode () {
      const localStore = window.localStorage || localStorage
      console.log(this.getBrowserLangCode())
      localStore.setItem('locale_lang', this.getBrowserLangCode())
    },
    // get指的是从已保存的读取，或者自动从语言选择
    // set指的是设置货币到界面
    getAndSetPreferredCurrency () {
      const localStore = window.localStorage || localStorage
      // 是否始终使用AR显示价格
      const alwaysAr = localStore.getItem('always_ar')
      if (alwaysAr === 'true') {
        // 是，那就没有必要用法定货币了
        this.setAlwaysUseAr(alwaysAr)
        return
      }
      // 尝试获取已保存的货币类型
      let currency = localStore.getItem('preferred_currency')
      // 没有已保存的类型，从已保存的语言自动设定
      if (!currency) {
        const lang = this.getLangCode()
        switch (lang) {
          case 'zh-CN': currency = 'CNY'; break
          case 'en-US': currency = 'USD'; break
          case 'ja-JP': currency = 'JPY'; break
          case 'zh-TW': currency = 'TWD'; break
          // 出错默认USD
          default: currency = 'USD'; break
        }
      }
      // 完成设定
      this.setPreferredCurrency(currency)
    }
  },
  mounted () {
    let lang = this.getLangCode()
    if (!lang) {
      this.setLangCode()
      lang = this.getLangCode()
    }
    switch (lang) {
      case 'zh-CN':
        this.$i18n.locale = 'zhCN'
        break
      case 'zh-TW':
        this.$i18n.locale = 'zhTW'
        break
      case 'en-US':
        this.$i18n.locale = 'en'
        break
      case 'ja-JP':
        this.$i18n.locale = 'jaJP'
        break
    }
    // get and set preferred currency type
    this.getAndSetPreferredCurrency()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
