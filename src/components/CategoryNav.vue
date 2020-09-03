<template>
  <div class="nav">
    <h1
      v-for="(tab, index) in tabs"
      :key="index"
      :class="navTab === tab.value && 'active'"
      @click="switchTab(tab.value)"
    >
      {{ tab.label }}
    </h1>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    value: {
      type: String,
      default: 'song'
    }
  },
  data () {
    return {
      navTab: '',
      tabs: [
        {
          value: 'song',
          label: 'SONG'
        },
        {
          value: 'sound',
          label: 'SOUND'
        },
        {
          value: 'podcast',
          label: 'PODCAST'
        }
      ]
    }
  },
  watch: {
    value (val) {
      this.navTab = val
      this.updateQuery('tab', val)
    }
  },
  created () {
    if (this.$route.query.tab) {
      this.navTab = this.$route.query.tab
      this.$emit('input', this.navTab)
    } else {
      this.navTab = this.value || 'song'
    }
  },
  methods: {
    switchTab (val) {
      this.navTab = val
      this.$emit('input', this.navTab)
      this.updateQuery('tab', this.navTab)
    },
    updateQuery (key, val) {
      const query = { ...this.$route.query }
      if (query[key] !== val) {
        query[key] = val
        this.$router.replace({ query })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  margin-top: 60px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;

  h1 {
    cursor: pointer;
    color: rgba(178, 178, 178, 1);
    padding: 0 0 5px 0;
    margin: 0 0 0 68px;
    display: block;
    font-size: 24px;
    line-height: 33px;
    font-weight: 500;
    box-sizing: border-box;
    border-bottom: 3px solid transparent;

    &:hover {
      color: white;
    }

    &.active {
      color: white;
      border-bottom-color: #E56D9B;
    }

    &:nth-child(1) {
      margin-left: 0;
    }
  }
}
</style>
