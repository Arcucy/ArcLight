<template>
  <div id="app" v-if="routerAlive">
    <router-view/>
    <Player />
  </div>
</template>

<script>
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
        let item = lang[i]
        if (item === 'zh-CN') return item
        if (item === 'zh-TW') return item
        if (item === 'en-US') return item
      }
    },
    getLangCode () {
      const localStore = window.localStorage || localStorage
      return localStore.getItem('locale_lang')
    },
    setLangCode () {
      const localStore = window.localStorage || localStorage
      localStore.setItem('locale_lang', this.getBrowserLangCode())
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
        this.$moment.locale('zh-cn')
        break
      case 'zh-TW':
        this.$i18n.locale = 'zhTW'
        this.$moment.locale('zh-tw')
        break
      case 'en-US':
        this.$i18n.locale = 'en'
        this.$moment.locale('en-us')
        break
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
