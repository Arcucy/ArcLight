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
    singleCoverRaw: '',
    singleCoverId: '',
    singleCoverLink: '',
    singleCoverType: '',
    albumCoverFile: '',
    albumCoverId: '',
    albumCoverLink: '',
    podcastCoverFile: '',
    podcastCoverId: '',
    podcastCoverLink: '',
    uploadCoverPct: 0,
    uploadMusicPct: 0,
    singleMuiscRaw: '',
    singleMusicId: '',
    singleMusicLink: '',
    singleMusicType: '',
    singleUploadComplete: false,
    singleLink: '',
    singleInfo: '',
    singleObj: ''
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
    setSingleCoverRaw (state, raw) {
      state.singleCoverRaw = raw
    },
    setSingleCoverId (state, id) {
      state.singleCoverId = id
    },
    setSingleCoverLink (state, link) {
      state.singleCoverLink = link
    },
    setSingleCoverType (state, type) {
      state.singleCoverType = type
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
    },
    setUploadCoverPct (state, pct) {
      state.uploadCoverPct = pct
    },
    setUploadMusicPct (state, pct) {
      state.uploadMusicPct = pct
    },
    setSingleMusicRaw (state, raw) {
      state.singleMuiscRaw = raw
    },
    setSingleMusicId (state, id) {
      state.singleMusicId = id
    },
    setSingleMusicLink (state, link) {
      state.singleMusicLink = link
    },
    setSingleMusicType (state, type) {
      state.singleMusicType = type
    },
    setSingleUploadComplete (state, status) {
      state.singleUploadComplete = status
    },
    setSingleLink (state, link) {
      state.singleLink = link
    },
    setSingleInfo (state, info) {
      state.singleInfo = info
    },
    setSingleObj (state, obj) {
      state.singleObj = obj
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
    reviewSingle ({ commit }, data) {
      commit('setSingleCoverRaw', data.img.data)
      commit('setSingleCoverType', data.img.type)
      commit('setSingleMusicRaw', data.music.data)
      commit('setSingleMusicType', data.music.type)
      commit('setSingleInfo', data.single)
      commit('setSingleObj', data)
    },
    async uploadSingle ({ commit }, data) {
      let imgTransaction = ''
      let musicTransaction = ''
      let singleTransaction = ''
      let postInfoTransaction = ''

      // User info
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      // Image Upload
      imgTransaction = await ar.createTransaction({ data: data.img.data }, data.key).catch(err => console.log('Image Transaction Created Failed: ', err))

      // // Add tag 添加标签
      imgTransaction.addTag('Content-Type', data.img.type)
      imgTransaction.addTag('App-Name', 'arclight')
      imgTransaction.addTag('Unix-Time', Date.now())
      imgTransaction.addTag('Type', 'single-cover')
      imgTransaction.addTag('Author-Address', address)
      imgTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(imgTransaction, data.key)
      let imgUploader = await ar.transactions.getUploader(imgTransaction)

      while (!imgUploader.isComplete) {
        await imgUploader.uploadChunk()
        commit('setUploadCoverPct', imgUploader.pctComplete)
        console.log(`${imgUploader.pctComplete}% complete, ${imgUploader.uploadedChunks}/${imgUploader.totalChunks}`)
      }

      commit('setSingleCoverId', imgTransaction.id)
      commit('setSingleCoverLink', 'https://arweave.net/' + imgTransaction.id)
      console.log(imgTransaction.id)

      const imgRes = await ar.transactions.post(imgTransaction)
      console.log(imgTransaction.id + ': ' + imgRes)

      // Upload Music
      console.log(data.music.data)
      musicTransaction = await ar.createTransaction({ data: data.music.data }, data.key).catch(err => console.log('Music Transaction Created Failed: ', err))

      // Add tag 添加标签
      musicTransaction.addTag('Content-Type', data.music.type)
      musicTransaction.addTag('App-Name', 'arclight')
      musicTransaction.addTag('Unix-Time', Date.now())
      musicTransaction.addTag('Type', 'single-music')
      musicTransaction.addTag('Author-Address', address)
      musicTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(musicTransaction, data.key)
      let musicUploader = await ar.transactions.getUploader(musicTransaction)

      while (!musicUploader.isComplete) {
        await musicUploader.uploadChunk()
        commit('setUploadMusicPct', musicUploader.pctComplete)
        console.log(`${musicUploader.pctComplete}% complete, ${musicUploader.uploadedChunks}/${musicUploader.totalChunks}`)
      }

      commit('setSingleMusicId', musicTransaction.id)
      commit('setSingleMusicLink', 'https://arweave.net/' + musicTransaction.id)
      console.log(musicTransaction.id)

      const musicRes = await ar.transactions.post(musicTransaction)
      console.log(musicTransaction.id + ': ' + musicRes)

      // Create single info
      const singleInfo = {
        title: data.single.title,
        desp: data.single.desp,
        genre: data.genre,
        cover: imgTransaction.id,
        music: musicTransaction.id
      }

      console.log(singleInfo)

      singleTransaction = await ar.createTransaction({ data: JSON.stringify(singleInfo) }, data.key).catch(err => console.log('Single Transaction Created Failed: ', err))

      singleTransaction.addTag('App-Name', 'arclight')
      singleTransaction.addTag('Unix-Time', Date.now())
      singleTransaction.addTag('Type', 'single-info')
      singleTransaction.addTag('Author-Address', address)
      singleTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(singleTransaction, data.key)
      let singleUploader = await ar.transactions.getUploader(singleTransaction)

      while (!singleUploader.isComplete) {
        await singleUploader.uploadChunk()
        console.log(`${singleUploader.pctComplete}% complete, ${singleUploader.uploadedChunks}/${singleUploader.totalChunks}`)
      }

      const singleRes = await ar.transactions.post(singleTransaction)
      console.log(singleTransaction.id + ': ' + singleRes)

      // Create post info
      let postInfo = await API.arweave.getPostFromAddress(address)
      if (postInfo) {
        postInfo = JSON.parse(postInfo)
      } else {
        postInfo = []
      }

      postInfo.push({ 'single': singleTransaction.id, 'timestamp': Date.now() })

      postInfoTransaction = await ar.createTransaction({ data: JSON.stringify(postInfo) }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      postInfoTransaction.addTag('App-Name', 'arclight')
      postInfoTransaction.addTag('Unix-Time', Date.now())
      postInfoTransaction.addTag('Type', 'post-info')
      postInfoTransaction.addTag('Author-Address', address)
      postInfoTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(postInfoTransaction, data.key)
      let postInfoUploader = await ar.transactions.getUploader(postInfoTransaction)

      while (!postInfoUploader.isComplete) {
        await postInfoUploader.uploadChunk()
        console.log(`${postInfoUploader.pctComplete}% complete, ${postInfoUploader.uploadedChunks}/${postInfoUploader.totalChunks}`)
      }

      const postInfoRes = await ar.transactions.post(postInfoTransaction)
      console.log(postInfoTransaction.id + ': ' + postInfoRes)

      commit('setSingleLink', singleTransaction.id)
      commit('setSingleUploadComplete', true)
    }
  }
})
