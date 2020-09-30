<template>
  <div id="app" v-if="routerAlive">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      routerAlive: true
    }
  },
  provide () {
    return {
      routerRefresh: this.routerRefresh,
      updateQuery: this.updateQuery
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
