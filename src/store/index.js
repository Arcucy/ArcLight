import Vue from 'vue'
import Vuex from 'vuex'
// import Arweave from 'arweave'

import API from '../api/api'

Vue.use(Vuex)

// let ar = Arweave.init({
//   host: 'arweave.net',
//   port: 443,
//   protocol: 'https',
//   timeout: 20000,
//   logging: false
// })

export default new Vuex.Store({
  modules: {
  },
  state: {
    isLoggedIn: false,
    keyFile: '',
    keyFileRaw: '',
    keyFileName: '',
    keyFileContent: '',
    wallet: '',
    username: '',
    userType: '',
    userAvatar: '',
    userIntroduction: '',
    isMe: false,
    userPage: {
      avatar: 'loading'
    },
    userPageLoading: true
  },
  mutations: {
    setIsLoggedIn (state, status) {
      state.isLoggedIn = status
    },
    setKeyFile (state, file) {
      state.keyFile = file
    },
    setKeyFileRaw (state, raw) {
      state.keyFileRaw = raw
    },
    setKeyFileName (state, name) {
      state.keyFileName = name
    },
    setKeyFileContent (state, content) {
      state.keyFileContent = content
    },
    setWallet (state, address) {
      state.wallet = address
    },
    setUsername (state, username) {
      state.username = username
    },
    setUserType (state, type) {
      state.userType = type
    },
    setUserAvatar (state, avatar) {
      state.userAvatar = avatar
    },
    setUserIntroduction (state, intro) {
      state.userIntroduction = intro
    },
    setIsMe (state, status) {
      state.isMe = status
    },
    setUserPage (state, data) {
      state.userPage = data
    },
    setUserPageLoading (state, status) {
      state.userPageLoading = status
    }
  },
  getters: {
  },
  actions: {
    setKey ({ commit }, data) {
      commit('setKeyFile', data.file)
      commit('setKeyFileRaw', data.raw)
      commit('setKeyFileName', data.name)
      commit('setKeyFileContent', data.content)

      API.arweave.getAddress(data.content).then(res => {
        commit('setWallet', res)
        API.arweave.getIdFromAddress(res).then(res2 => {
          console.log(res2)
          commit('setUsername', res2.data)
          commit('setUserType', res2.type)
          commit('setIsLoggedIn', true)
          if (res2.type !== 'guest') {
            API.arweave.getAvatarFromAddress(res).then(data => {
              if (data) {
                commit('setUserAvatar', data)
              }
            })
          }
        })
      })
    },
    logout ({ commit }) {
      commit('setUsername', '')
      commit('setUserAvatar', '')
      commit('setIsLoggedIn', false)
    },
    setIsMe ({ commit }, status) {
      commit('setIsMe', status)
    },
    async setUserPage ({ commit }, data) {
      let userPage = {
        nickname: '',
        avatar: '',
        introduction: '',
        type: ''
      }

      const user = await API.arweave.getIdFromAddress(data.wallet)
      userPage.nickname = user.data
      userPage.type = user.type
      if (user.type !== 'guest') {
        const avatar = await API.arweave.getAvatarFromAddress(data.wallet)
        if (avatar) {
          userPage.avatar = avatar
          commit('setUserPage', userPage)
          commit('setUserPageLoading', false)
        }
      }
    }
  }
})
