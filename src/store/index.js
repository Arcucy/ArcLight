import Vue from 'vue'
import Vuex from 'vuex'
import Arweave from 'arweave'

import API from '../api/api'

Vue.use(Vuex)

let ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

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
    userPageLoading: true,
    singleCoverFile: '',
    singleCoverId: '',
    singleCoverLink: '',
    albumCoverFile: '',
    albumCoverId: '',
    albumCoverLink: '',
    podcastCoverFile: '',
    podcastCoverId: '',
    podcastCoverLink: ''
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
    },
    setSingleCoverFile (state, file) {
      state.singleCoverFile = file
    },
    setSingleCoverId (state, id) {
      state.singleCoverId = id
    },
    setSingleCoverLink (state, link) {
      state.singleCoverLink = link
    },
    setAlbumCoverFile (state, file) {
      state.albumCoverFile = file
    },
    setAlbumCoverId (state, id) {
      state.albumCoverId = id
    },
    setAlbumCoverLink (state, link) {
      state.albumCoverLink = link
    },
    setPodcastCoverFile (state, file) {
      state.podcastCoverFile = file
    },
    setPodcastCoverId (state, id) {
      state.podcastCoverId = id
    },
    setPodcastCoverLink (state, link) {
      state.podcastCoverLink = link
    }
  },
  getters: {
  },
  actions: {
    async setKey ({ commit }, data) {
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
    },
    setSingleCoverFile ({ commit }, file) {
      commit('setSingleCoverFile', file)
    },
    setAlbumCoverFile ({ commit }, file) {
      commit('setAlbumCoverFile', file)
    },
    setPodcastCoverFile ({ commit }, file) {
      commit('setPodcastCoverFile', file)
    },
    uploadSingleCoverFile ({ commit }, data) {
      ar.createTransaction({ data: data.data }, data.key).then(async transaction => {
        const address = await API.arweave.getAddress(data.key)
        const user = await API.arweave.getIdFromAddress(address)

        // Add tag 添加标签
        transaction.addTag('Content-Type', data.type)
        transaction.addTag('App-Name', 'arclight')
        transaction.addTag('Unix-Time', Date.now())
        transaction.addTag('Type', 'single-cover')
        transaction.addTag('Author-Address', address)
        transaction.addTag('Author-Username', user.data)

        await ar.transactions.sign(transaction, data.key)
        let uploader = await ar.transactions.getUploader(transaction)

        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          commit('setUploadPct', uploader.pctComplete)
          console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
        }

        commit('setSingleCoverId', transaction.id)
        commit('setSingleCoverLink', 'https://arweave.net/' + transaction.id)

        await ar.transactions.post(transaction)
      })
    },
    uploadSingleMusicFile ({ commit }, data) {
      ar.createTransaction({ data: data.data }, data.key).then(async transaction => {
        const address = await API.arweave.getAddress(data.key)
        const user = await API.arweave.getIdFromAddress(address)

        // Add tag 添加标签
        transaction.addTag('Content-Type', data.type)
        transaction.addTag('App-Name', 'arclight')
        transaction.addTag('Unix-Time', Date.now())
        transaction.addTag('Type', 'single-music')
        transaction.addTag('Author-Address', address)
        transaction.addTag('Author-Username', user.data)

        await ar.transactions.sign(transaction, data.key)
        let uploader = await ar.transactions.getUploader(transaction)

        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          commit('setUploadPct', uploader.pctComplete)
          console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
        }

        commit('setSingleCoverId', transaction.id)
        commit('setSingleCoverLink', 'https://arweave.net/' + transaction.id)

        await ar.transactions.post(transaction)
      })
    }
  }
})
