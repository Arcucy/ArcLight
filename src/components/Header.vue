<template>
  <div class="header">
    <div class="link-container">
      <router-link :to="{ name: 'Landing' }" class="link">
        <img src="../assets/logo.png" style="height: 3rem">
      </router-link>
      <router-link :to="{ name: 'Landing' }" class="link text-link">
        ArcLight
      </router-link>
      <router-link :to="{ name: 'MusicMenu' }" class="link text-link">
        Music
      </router-link>
    </div>
    <Search class="search-bar"/>
    <v-btn depressed large color="#E56D9B" class="sign" @click="show = true">Sign In</v-btn>
    <v-dialog
      v-model="show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Upload your key</v-card-title>
        <v-file-input accept="application/json" label="Upload" style="width: 90%; margin-left: 10px;"></v-file-input>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="#ff92bc"
            @click="show = false"
            class="upload-btn"
          >
            Upload
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="show = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Search from './Search.vue'

export default {
  components: {
    Search
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<style lang="less" scoped>

.header {
  margin-top: 2rem;
  display: flex;
  align-items: center;
}

.link-container {
  margin-left: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
}

.link {
  margin-left: .75rem;
  font-size: 1.2rem;
}

.text-link {
  margin-bottom: 5px;
}

.text-link:hover {
  animation-name: colorChange;
  animation-duration: 0.25s;
  animation-timing-function: ease-in-out;
  color: #ff92bc;
}

@keyframes colorChange {
  0% {
    color: white;
  }
  100% {
    color: #ff92bc;
  }
}

.search-bar {
  width: 50%;
}

.sign {
  margin-left: 1rem;
  margin-right: 2rem;
  /deep/ .v-btn__content {
    color: white;
  }
}

.upload-btn {
  /deep/ .v-btn__content {
    color: white;
  }
}

/deep/ a {
  color: white;
  text-decoration: none;
}
</style>
