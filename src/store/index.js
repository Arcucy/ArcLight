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
    userAvatar: ''
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
      state.walletAddress = address
    },
    setUsername (state, username) {
      state.username = username
    },
    setUserType (state, type) {
      state.userType = type
    },
    setUserAvatar (state, avatar) {
      state.userAvatar = avatar
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
        console.log(res)
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
    }
  }
})
