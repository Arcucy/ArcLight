<template>
  <div class="nav">
    <router-link
      v-for="(tab, index) in tabs"
      :key="index"
      :class="$route.name === tab.name && 'active'"
      :to="{ name: tab.name }"
    >
      {{ tab.label }}
    </router-link>
  </div>
</template>

<script>

export default {
  data () {
    return {
      navTab: '',
      tabs: [
        {
          name: 'Songs',
          label: 'SONG'
        },
        {
          name: 'Sound',
          label: 'SOUND'
        },
        {
          name: 'Podcast',
          label: 'PODCAST'
        }
      ]
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

  a {
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
    text-decoration: none;

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
@media screen and (max-width: 640px) {
  .nav {
    margin-top: 40px;
    a {
      margin: 0 0 0 40px;
      font-size: 20px;
    }
  }
}
@media screen and (max-width: 480px) {
  .nav {
    a {
      margin: 0 0 0 20px;
      font-size: 16px;
    }
  }
}
</style>
