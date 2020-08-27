<template>
  <div class="music-list">
    <b-menu>
      <b-menu-list v-for="(audio, index) in audioList" :key="index" label="Music List">
        <b-menu-item :label="audio.name" tag="router-link" :to="audio.path"></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      audioList: [
        {
          name: 'Flower Dance',
          path: '/music/flowerdance'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.music-list {
  padding-top: 200px;
  text-align: center;
  margin-top: 20rem;
  width: 50%;
  border-radius: 20px;
  margin: 0 auto;
}

/deep/ .menu-list a {
  border-radius: 10px;
  color: white;
}

/deep/ .menu-list a:hover {
  background-color: #E56D9B;
}

/deep/ .menu-label {
  font-size: 1rem !important;
}

/deep/ span {
  font-size: 1.2rem !important;
}
</style>
