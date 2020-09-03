<template>
  <div class="header">
    <div class="link-container">
      <router-link :to="{ name: 'Landing' }" class="link">
        <img src="../assets/logo.png" style="height: 3rem">
      </router-link>
      <router-link :to="{ name: 'Landing' }" class="link text-link">
        ArcLight
      </router-link>
      <router-link :to="{ name: 'Songs' }" class="link text-link">
        Music
      </router-link>
    </div>
    <Search class="search-bar"/>
    <v-btn v-if="!isLoggedIn" depressed large color="#E56D9B" class="sign" @click="show = true" :outlined="loginBtnLoading" :loading="loginBtnLoading">Login</v-btn>
    <v-btn
      v-if="isLoggedIn"
      class="upload"
      depressed
      large
      color="#E56D9B"
      :outlined="true"
      @click="uploadMusic"
    >
      <v-avatar :size="24">
        <v-icon :size="24" light style="color: #E56D9B;">mdi-upload</v-icon>
      </v-avatar>
      Upload Music
    </v-btn>
    <v-menu v-if="isLoggedIn" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          depressed
          class="user"
          large
          color="#E56D9B"
          v-bind="attrs"
          v-on="on"
        >
          <v-avatar :size="24">
            <v-icon :size="24" v-if="!userAvatar" dark style="margin-right: 0.3rem;">mdi-account-circle</v-icon>
            <img
              v-if="userAvatar"
              :src="userAvatar"
              :alt="username"
              style="margin-right: 0.3rem;"
            >
          </v-avatar>
          {{ username }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="goto(item)"
        >
          <v-list-item-title v-if="!item.type">{{ item.title }}</v-list-item-title>
          <v-list-item-title v-if="item.type" :class="item.type">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Upload your key</v-card-title>
        <v-file-input
          v-model="file"
          accept="application/json"
          label="Upload"
          style="width: 90%; margin-left: 10px;"
          placeholder="Insert your wallet key"
        >
        </v-file-input>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="#ff92bc"
            @click="submit"
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
    <v-snackbar
      v-model="snackbar"
      color="#00C853"
      timeout="3000"
      top="top"
    >
      File Read Successful

      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="failSnackbar"
      color="#E53935"
      timeout="3000"
      top="top"
    >
      File Read Failed, Try again

      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

import Search from './Search.vue'

export default {
  components: {
    Search
  },
  data () {
    return {
      show: false,
      loginBtnLoading: false,
      file: null,
      keyFile: '',
      fileName: '',
      fileContent: '',
      fileRaw: '',
      needUpload: false,
      snackbar: false,
      failSnackbar: false,
      menuItems: [
        { title: 'My Profile', path: '/profile' },
        { title: 'My Library', path: '/library' },
        { title: 'Sign Out', type: 'danger' }
      ]
    }
  },
  computed: {
    ...mapState(['isLoggedIn', 'username', 'userAvatar'])
  },
  watch: {
  },
  methods: {
    ...mapActions(['setKey', 'logout']),
    submit () {
      this.loginBtnLoading = true
      this.keyFile = this.file
      this.fileName = this.keyFile.name
      const reader = new FileReader()
      reader.readAsText(this.keyFile)
      reader.onload = async (e) => {
        try {
          this.fileContent = JSON.parse(e.target.result)
          this.fileRaw = JSON.stringify(this.fileContent)
          const data = {
            file: this.file,
            raw: this.fileRaw,
            name: this.fileName,
            content: this.fileContent
          }
          this.setKey(data)
          this.needUpload = false
          this.snackbar = true
          this.show = false
        } catch (err) {
          this.failSnackbar = true
        }
      }
    },
    goto (item) {
      if (item.type) {
        this.loginBtnLoading = false
        this.logout()
      } else {
        this.$router.push({ path: item.path })
      }
    },
    uploadMusic () {
      console.log('music')
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

.user {
  margin-left: 1rem;
  margin-right: 2rem;
  /deep/ .v-btn__content {
    color: white;
  }
}

.danger {
  color: #E53935 !important;
}

/deep/ .v-menu__content > .v-list {
  background-color: rgba(51,51,51,0.5);
}

.upload-btn {
  /deep/ .v-btn__content {
    color: white;
  }
}

.upload {
  margin-left: 1rem;
  /deep/ i {
    color: white;
  }
}

/deep/ a {
  color: white;
  text-decoration: none;
}
</style>
