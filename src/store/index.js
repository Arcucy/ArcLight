import Vue from 'vue'
import Vuex from 'vuex'
import Arweave from 'arweave'

import { encryptBuffer } from '../util/encrypt'
import config from '../config/index'
import API from '../api/api'
import Community from 'community-js'

Vue.use(Vuex)

const APP_NAME = 'arclight-app'

let ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 10000,
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
    userInfoUpdateComplete: '',
    userNoBalanceFailure: false,
    isMe: false,
    userPageLoading: true,
    singleCoverFile: '',
    singleCoverRaw: '',
    singleCoverType: '',
    albumCoverFile: '',
    albumCoverRaw: '',
    albumCoverType: '',
    albumUploadComplete: false,
    albumInfo: '',
    albumObj: '',
    albumInfoId: '',
    podcastCoverFile: '',
    podcastCoverRaw: '',
    podcastCoverType: '',
    podcastMusicType: '',
    podcastUploadComplete: false,
    podcastInfo: '',
    podcastObj: '',
    podcastInfoId: '',
    soundEffectCoverFile: '',
    soundEffectCoverRaw: '',
    soundEffectCoverType: '',
    soundEffectMusicType: '',
    soundEffectUploadComplete: false,
    soundEffectInfo: '',
    soundEffectObj: '',
    soundEffectInfoId: '',
    uploadCoverPct: 0,
    uploadMusicNumber: 0,
    uploadMusicPct: 0,
    uploadStatus: 'Await',
    singleMusicType: '',
    singleUploadComplete: false,
    singleLink: '',
    singleInfo: '',
    singleObj: '',
    singleInfoId: '',
    purchaseComplete: false,
    paymentId: ''
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
    setUserInfoUpdateComplete (state, status) {
      state.userInfoUpdateComplete = status
    },
    setUserNoBalanceFailure (state, status) {
      state.userNoBalanceFailure = status
    },
    setUserAccountFailure (state, status) {
      state.userAccountFailure = status
    },
    setIsMe (state, status) {
      state.isMe = status
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
    setSingleCoverType (state, type) {
      state.singleCoverType = type
    },
    setAlbumCoverFile (state, file) {
      state.albumCoverFile = file
    },
    setAlbumCoverRaw (state, raw) {
      state.albumCoverRaw = raw
    },
    setAlbumCoverType (state, type) {
      state.albumCoverType = type
    },
    setAlbumUploadComplete (state, status) {
      state.albumUploadComplete = status
    },
    setAlbumInfo (state, info) {
      state.albumInfo = info
    },
    setAlbumObj (state, obj) {
      state.albumObj = obj
    },
    setAlbumInfoId (state, id) {
      state.albumInfoId = id
    },
    setPodcastCoverFile (state, file) {
      state.podcastCoverFile = file
    },
    setPodcastCoverRaw (state, raw) {
      state.podcastCoverRaw = raw
    },
    setPodcastCoverType (state, type) {
      state.podcastCoverType = type
    },
    setPodcastMusicType (state, type) {
      state.podcastMusicType = type
    },
    setPodcastUploadComplete (state, status) {
      state.podcastUploadComplete = status
    },
    setPodcastInfo (state, info) {
      state.podcastInfo = info
    },
    setPodcastObj (state, obj) {
      state.podcastObj = obj
    },
    setPodcastInfoId (state, id) {
      state.podcastInfoId = id
    },
    setSoundEffectCoverFile (state, file) {
      state.soundEffectCoverFile = file
    },
    setSoundEffectCoverRaw (state, raw) {
      state.soundEffectCoverRaw = raw
    },
    setSoundEffectCoverType (state, type) {
      state.soundEffectCoverType = type
    },
    setSoundEffectMusicType (state, type) {
      state.soundEffectMusicType = type
    },
    setSoundEffectUploadComplete (state, status) {
      state.soundEffectUploadComplete = status
    },
    setSoundEffectInfo (state, info) {
      state.soundEffectInfo = info
    },
    setSoundEffectObj (state, obj) {
      state.soundEffectObj = obj
    },
    setSoundEffectInfoId (state, id) {
      state.soundEffectInfoId = id
    },
    setUploadCoverPct (state, pct) {
      state.uploadCoverPct = pct
    },
    setUploadMusicNumber (state, number) {
      state.uploadMusicNumber = number
    },
    setUploadMusicPct (state, pct) {
      state.uploadMusicPct = pct
    },
    setUploadStatus (state, info) {
      state.uploadStatus = info
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
    },
    setSingleInfoId (state, id) {
      state.singleInfoId = id
    },
    setPurchaseComplete (state, status) {
      state.purchaseComplete = status
    },
    setPaymentId (state, id) {
      state.paymentId = id
    }
  },
  getters: {
  },
  actions: {
    setKey ({ commit }, data) {
      return new Promise(async (resolve, reject) => {
        commit('setKeyFile', data.file)
        commit('setKeyFileRaw', data.raw)
        commit('setKeyFileName', data.name)
        commit('setKeyFileContent', data.content)

        const balance = await API.arweave.getBalance(data.content)
        if (parseFloat(balance) <= 0) {
          commit('setUserNoBalanceFailure', true)
          return
        }

        const res = await API.arweave.getAddress(data.content)
        commit('setWallet', res)
        const res2 = await API.arweave.getIdFromAddress(res).catch(() => {
          commit('setUserAccountFailure', true)
          commit('setUsername', 'guest')
          commit('setUserType', 'Guest')
          commit('setIsLoggedIn', true)
          resolve(true)
        })
        commit('setUsername', res2.data)
        commit('setUserType', res2.type)
        commit('setIsLoggedIn', true)
        if (res2.type !== 'guest') {
          API.arweave.getAvatarFromAddress(res).then(data => {
            if (data) {
              commit('setUserAvatar', data)
            }
          })
          resolve(true)
        }
      })
    },
    logout ({ commit }) {
      commit('setUsername', '')
      commit('setUserAvatar', undefined)
      commit('setIsLoggedIn', false)
      commit('setWallet', '')
      commit('setIsMe', false)
    },
    setIsMe ({ commit }, status) {
      commit('setIsMe', status)
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
    setSoundEffectCoverFile ({ commit }, file) {
      commit('setSoundEffectCoverFile', file)
    },
    reviewSingle ({ commit }, data) {
      commit('setSingleCoverRaw', data.img.data)
      commit('setSingleCoverType', data.img.type)
      commit('setSingleMusicType', data.music.type)
      commit('setSingleInfo', data.single)
    },
    resetSingleInfo ({ commit }) {
      commit('setUploadMusicPct', 0)
      commit('setSingleCoverRaw', '')
      commit('setSingleInfo', '')
    },
    reviewAlbum ({ commit }, data) {
      commit('setAlbumCoverRaw', data.img.data)
      commit('setAlbumCoverType', data.img.type)
      commit('setAlbumInfo', data.album)
    },
    resetAlbumInfo ({ commit }) {
      commit('setUploadMusicPct', 0)
      commit('setAlbumInfo', '')
      commit('setAlbumCoverRaw', '')
    },
    reviewPodcast ({ commit }, data) {
      commit('setPodcastCoverRaw', data.img.data)
      commit('setPodcastCoverType', data.img.type)
      commit('setPodcastMusicType', data.music.type)
      commit('setPodcastInfo', data.podcast)
    },
    resetPodcastInfo ({ commit }) {
      commit('setUploadMusicPct', 0)
      commit('setPodcastCoverRaw', '')
      commit('setPodcastInfo', '')
    },
    reviewSoundEffect ({ commit }, data) {
      commit('setSoundEffectCoverRaw', data.img.data)
      commit('setSoundEffectCoverType', data.img.type)
      commit('setSoundEffectMusicType', data.music.type)
      commit('setSoundEffectInfo', data.soundeffect)
    },
    resetSoundEffectInfo ({ commit }) {
      commit('setUploadMusicPct', 0)
      commit('setSoundEffectInfo', '')
      commit('setSoundEffectCoverRaw', '')
    },
    async uploadSingle ({ commit }, data) {
      commit('setSingleUploadComplete', false)
      commit('setUploadCoverPct', 0)
      commit('setUploadMusicPct', 0)

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
      imgTransaction.addTag('App-Name', APP_NAME)
      imgTransaction.addTag('Unix-Time', Date.now())
      imgTransaction.addTag('Type', 'single-cover')
      imgTransaction.addTag('Author-Address', address)
      imgTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(imgTransaction, data.key)
      let imgUploader = await ar.transactions.getUploader(imgTransaction)

      while (!imgUploader.isComplete) {
        await imgUploader.uploadChunk()
        commit('setUploadCoverPct', imgUploader.pctComplete)
      }

      const imgRes = await ar.transactions.post(imgTransaction)
      console.log(imgTransaction.id + ': ', imgRes)

      // Upload Music
      const musicReady = encryptBuffer(Buffer.from(data.music.data.music))
      musicTransaction = await ar.createTransaction({ data: musicReady }, data.key).catch(err => console.log('Music Transaction Created Failed: ', err))

      // Add tag 添加标签
      musicTransaction.addTag('Content-Type', data.music.type)
      musicTransaction.addTag('App-Name', APP_NAME)
      musicTransaction.addTag('Unix-Time', Date.now())
      musicTransaction.addTag('Type', 'single-music')
      musicTransaction.addTag('Author-Address', address)
      musicTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(musicTransaction, data.key)
      let musicUploader = await ar.transactions.getUploader(musicTransaction)
      while (!musicUploader.isComplete) {
        await musicUploader.uploadChunk()
        commit('setUploadMusicPct', musicUploader.pctComplete)
        commit('setUploadStatus', 'Uploading chunks: ' + `${musicUploader.uploadedChunks}/${musicUploader.totalChunks}`)
      }

      commit('setUploadStatus', 'Await confirmation on post')

      const musicRes = await ar.transactions.post(musicTransaction)
      console.log(musicTransaction.id + ': ', musicRes)

      // Create single info
      const singleInfo = {
        title: data.single.title,
        desp: data.single.desp,
        genre: data.single.genre,
        price: data.single.price,
        duration: data.single.duration,
        cover: imgTransaction.id,
        music: musicTransaction.id
      }

      singleTransaction = await ar.createTransaction({ data: JSON.stringify(singleInfo) }, data.key).catch(err => console.log('Single Transaction Created Failed: ', err))

      singleTransaction.addTag('App-Name', APP_NAME)
      singleTransaction.addTag('Unix-Time', Date.now())
      singleTransaction.addTag('Type', 'single-info')
      singleTransaction.addTag('Title', data.single.title)
      singleTransaction.addTag('Genre', data.single.genre)
      singleTransaction.addTag('Price', data.single.price)
      singleTransaction.addTag('Author-Address', address)
      singleTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(singleTransaction, data.key)
      let singleUploader = await ar.transactions.getUploader(singleTransaction)

      while (!singleUploader.isComplete) {
        await singleUploader.uploadChunk()
      }

      const singleRes = await ar.transactions.post(singleTransaction)
      commit('setSingleInfoId', singleTransaction.id)
      console.log(singleTransaction.id + ': ', singleRes)

      // Create post info
      let postInfo = await API.arweave.getPostFromAddress(address)
      if (postInfo) {
        postInfo = JSON.parse(postInfo)
      } else {
        postInfo = []
      }

      let final = []
      let final2 = []
      postInfo.push({ typs: 'single', id: singleTransaction.id, genre: data.single.genre, 'timestamp': Date.now() })
      postInfo.forEach(item => {
        if (item.genre) {
          const res = final.find(val => val.genre === item.genre)
          if (res) res.count++
          else final.push({ genre: item.genre, count: 1 })
        }
      })
      final.sort((a, b) => b.count - a.count)

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final2.find(val => val.category === item.category)
          if (res) res.count++
          else final2.push({ category: item.category, count: 1 })
        }
      })
      final2.sort((a, b) => b.count - a.count)

      postInfoTransaction = await ar.createTransaction({ data: JSON.stringify(postInfo) }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      if (final[0]) postInfoTransaction.addTag('Top1-Genre', final[0].genre)
      if (final[1]) postInfoTransaction.addTag('Top2-Genre', final[1].genre)
      if (final[2]) postInfoTransaction.addTag('Top3-Genre', final[2].genre)
      if (final2[0]) postInfoTransaction.addTag('Top1-Category', final[0].category)
      if (final2[1]) postInfoTransaction.addTag('Top2-Category', final[1].category)
      if (final2[2]) postInfoTransaction.addTag('Top3-Category', final[2].category)
      postInfoTransaction.addTag('App-Name', APP_NAME)
      postInfoTransaction.addTag('Unix-Time', Date.now())
      postInfoTransaction.addTag('Type', 'post-info')
      postInfoTransaction.addTag('Author-Address', address)
      postInfoTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(postInfoTransaction, data.key)
      let postInfoUploader = await ar.transactions.getUploader(postInfoTransaction)

      while (!postInfoUploader.isComplete) {
        await postInfoUploader.uploadChunk()
      }

      const postInfoRes = await ar.transactions.post(postInfoTransaction).catch(err => console.log('single post-info error: ', JSON.stringify(err)))
      console.log(postInfoTransaction.id + ': ', postInfoRes)

      commit('setSingleLink', singleTransaction.id)
      commit('setSingleUploadComplete', true)
    },
    async uploadAlbum ({ commit }, data) {
      commit('setAlbumUploadComplete', false)
      commit('setUploadCoverPct', 0)
      commit('setUploadMusicPct', 0)
      commit('setUploadMusicNumber', 0)
      let imgTransaction = ''
      let musicTransaction = ''
      let albumTransaction = ''
      let postInfoTransaction = ''

      // User info
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      // Image Upload
      imgTransaction = await ar.createTransaction({ data: data.img.data }, data.key).catch(err => console.log('Image Transaction Created Failed: ', err))

      // // Add tag 添加标签
      imgTransaction.addTag('Content-Type', data.img.type)
      imgTransaction.addTag('App-Name', APP_NAME)
      imgTransaction.addTag('Unix-Time', Date.now())
      imgTransaction.addTag('Type', 'album-cover')
      imgTransaction.addTag('Author-Address', address)
      imgTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(imgTransaction, data.key)
      let imgUploader = await ar.transactions.getUploader(imgTransaction)

      while (!imgUploader.isComplete) {
        await imgUploader.uploadChunk()
        commit('setUploadCoverPct', imgUploader.pctComplete)
      }

      const imgRes = await ar.transactions.post(imgTransaction)
      console.log(imgTransaction.id + ': ', imgRes)

      // // Upload Music
      let musicList = []
      const musicFileList = data.music.data.music

      for (let i = 0; i < musicFileList.length; i++) {
        console.log('Uploading #' + (i + 1))
        const musicReady = encryptBuffer(Buffer.from(musicFileList[i].data))
        musicTransaction = await ar.createTransaction({ data: musicReady }, data.key).catch(err => console.log('Music Transaction Created Failed: ', err))
        // Add tag 添加标签
        musicTransaction.addTag('Content-Type', musicFileList[i].type)
        musicTransaction.addTag('App-Name', APP_NAME)
        musicTransaction.addTag('Unix-Time', Date.now())
        musicTransaction.addTag('Type', 'album-music')
        musicTransaction.addTag('Track-Number', i + 1)
        musicTransaction.addTag('Title', musicFileList[i].title)
        musicTransaction.addTag('Album-Title', data.album.title)
        musicTransaction.addTag('Album-Desp', data.album.desp)
        musicTransaction.addTag('Author-Address', address)
        musicTransaction.addTag('Author-Username', user.data)

        await ar.transactions.sign(musicTransaction, data.key)
        let musicUploader = await ar.transactions.getUploader(musicTransaction)
        while (!musicUploader.isComplete) {
          await musicUploader.uploadChunk()
          commit('setUploadMusicNumber', i + 1)
          commit('setUploadMusicPct', musicUploader.pctComplete)
          commit('setUploadStatus', 'Uploading chunks: ' + `${musicUploader.uploadedChunks}/${musicUploader.totalChunks}`)
        }

        console.log('Await confirmation on post for #' + (i + 1))
        commit('setUploadStatus', 'Await confirmation on post for #' + (i + 1))
        const musicRes = await ar.transactions.post(musicTransaction)
        console.log(musicTransaction.id + ': ', musicRes)
        musicList.push({ id: musicTransaction.id, title: musicFileList[i].title, price: musicFileList[i].price })
      }

      // Create single info
      const albumInfo = {
        title: data.album.title,
        desp: data.album.desp,
        genre: data.album.genre,
        price: data.album.price,
        duration: data.album.duration,
        cover: imgTransaction.id,
        music: musicList
      }

      albumTransaction = await ar.createTransaction({ data: JSON.stringify(albumInfo) }, data.key).catch(err => console.log('Album Transaction Created Failed: ', err))

      albumTransaction.addTag('App-Name', APP_NAME)
      albumTransaction.addTag('Unix-Time', Date.now())
      albumTransaction.addTag('Type', 'album-info')
      albumTransaction.addTag('Title', data.album.title)
      albumTransaction.addTag('Tracks', musicList.length)
      albumTransaction.addTag('Genre', data.album.genre)
      albumTransaction.addTag('Price', data.album.price)
      albumTransaction.addTag('Author-Address', address)
      albumTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(albumTransaction, data.key)
      let albumUploader = await ar.transactions.getUploader(albumTransaction)

      while (!albumUploader.isComplete) {
        await albumUploader.uploadChunk()
      }

      const singleRes = await ar.transactions.post(albumTransaction)
      commit('setAlbumInfoId', albumTransaction.id)
      console.log(albumTransaction.id + ': ', singleRes)

      // Create post info
      let postInfo = await API.arweave.getPostFromAddress(address).catch(() => {
        postInfo = []
      })
      if (postInfo) {
        postInfo = JSON.parse(postInfo)
      } else {
        postInfo = []
      }

      let final = []
      let final2 = []
      postInfo.push({ typs: 'album', id: musicList, genre: data.album.genre, 'timestamp': Date.now() })

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final.find(val => val.genre === item.genre)
          if (res) res.count++
          else final.push({ genre: item.genre, count: 1 })
        }
      })
      final.sort((a, b) => b.count - a.count)

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final2.find(val => val.category === item.category)
          if (res) res.count++
          else final2.push({ category: item.category, count: 1 })
        }
      })
      final2.sort((a, b) => b.count - a.count)

      postInfoTransaction = await ar.createTransaction({ data: JSON.stringify(postInfo) }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      if (final[0]) postInfoTransaction.addTag('Top1-Genre', final[0].genre)
      if (final[1]) postInfoTransaction.addTag('Top2-Genre', final[1].genre)
      if (final[2]) postInfoTransaction.addTag('Top3-Genre', final[2].genre)
      if (final2[0]) postInfoTransaction.addTag('Top1-Category', final[0].category)
      if (final2[1]) postInfoTransaction.addTag('Top2-Category', final[1].category)
      if (final2[2]) postInfoTransaction.addTag('Top3-Category', final[2].category)
      postInfoTransaction.addTag('App-Name', APP_NAME)
      postInfoTransaction.addTag('Unix-Time', Date.now())
      postInfoTransaction.addTag('Type', 'post-info')
      postInfoTransaction.addTag('Author-Address', address)
      postInfoTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(postInfoTransaction, data.key)
      let postInfoUploader = await ar.transactions.getUploader(postInfoTransaction)

      while (!postInfoUploader.isComplete) {
        await postInfoUploader.uploadChunk()
      }

      const postInfoRes = await ar.transactions.post(postInfoTransaction).catch(err => console.log('album post-info error: ', JSON.stringify(err)))
      console.log(postInfoTransaction.id + ': ', postInfoRes)

      commit('setAlbumUploadComplete', true)
    },
    async uploadPodcast ({ commit }, data) {
      commit('setPodcastUploadComplete', false)
      commit('setUploadCoverPct', 0)
      commit('setUploadMusicPct', 0)
      let imgTransaction = ''
      let programTransaction = ''
      let podcastTransaction = ''
      let postInfoTransaction = ''

      // User info
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      // Image Upload
      imgTransaction = await ar.createTransaction({ data: data.img.data }, data.key).catch(err => console.log('Image Transaction Created Failed: ', err))

      // // Add tag 添加标签
      imgTransaction.addTag('Content-Type', data.img.type)
      imgTransaction.addTag('App-Name', APP_NAME)
      imgTransaction.addTag('Unix-Time', Date.now())
      imgTransaction.addTag('Type', 'podcast-cover')
      imgTransaction.addTag('Author-Address', address)
      imgTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(imgTransaction, data.key)
      let imgUploader = await ar.transactions.getUploader(imgTransaction)

      while (!imgUploader.isComplete) {
        await imgUploader.uploadChunk()
        commit('setUploadCoverPct', imgUploader.pctComplete)
      }

      const imgRes = await ar.transactions.post(imgTransaction)
      console.log(imgTransaction.id + ': ', imgRes)

      // Upload Program
      const musicReady = encryptBuffer(Buffer.from(data.music.data.music))
      programTransaction = await ar.createTransaction({ data: musicReady }, data.key).catch(err => console.log('Program Transaction Created Failed: ', err))

      // Add tag 添加标签
      programTransaction.addTag('Content-Type', data.music.type)
      programTransaction.addTag('App-Name', APP_NAME)
      programTransaction.addTag('Unix-Time', Date.now())
      programTransaction.addTag('Type', 'podcast-program')
      programTransaction.addTag('Author-Address', address)
      programTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(programTransaction, data.key)
      let programUploader = await ar.transactions.getUploader(programTransaction)
      while (!programUploader.isComplete) {
        await programUploader.uploadChunk()
        commit('setUploadMusicPct', programUploader.pctComplete)
        commit('setUploadStatus', 'Uploading chunks: ' + `${programUploader.uploadedChunks}/${programUploader.totalChunks}`)
      }

      commit('setUploadStatus', 'Await confirmation on post')

      const musicRes = await ar.transactions.post(programTransaction)
      console.log(programTransaction.id + ': ', musicRes)

      // Create Podcast info
      const podcastInfo = {
        podcast: data.podcast.podcast,
        title: data.podcast.title,
        desp: data.podcast.desp,
        category: data.podcast.category,
        price: data.podcast.price,
        duration: data.podcast.duration,
        cover: imgTransaction.id,
        program: programTransaction.id
      }

      podcastTransaction = await ar.createTransaction({ data: JSON.stringify(podcastInfo) }, data.key).catch(err => console.log('Podcast Transaction Created Failed: ', err))

      podcastTransaction.addTag('App-Name', APP_NAME)
      podcastTransaction.addTag('Unix-Time', Date.now())
      podcastTransaction.addTag('Type', 'podcast-info')
      podcastTransaction.addTag('Podcast', data.podcast.podcast)
      podcastTransaction.addTag('Title', data.podcast.title)
      podcastTransaction.addTag('Category', data.podcast.category)
      podcastTransaction.addTag('Price', data.podcast.price)
      podcastTransaction.addTag('Author-Address', address)
      podcastTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(podcastTransaction, data.key)
      let podcastUploader = await ar.transactions.getUploader(podcastTransaction)

      while (!podcastUploader.isComplete) {
        await podcastUploader.uploadChunk()
      }

      const singleRes = await ar.transactions.post(podcastTransaction)
      commit('setPodcastInfoId', podcastTransaction.id)
      console.log(podcastTransaction.id + ': ', singleRes)

      // Create post info
      let postInfo = await API.arweave.getPostFromAddress(address)
      if (postInfo) {
        postInfo = JSON.parse(postInfo)
      } else {
        postInfo = []
      }

      let final = []
      let final2 = []
      postInfo.push({ typs: 'podcast', id: podcastTransaction.id, genre: data.podcast.category, 'timestamp': Date.now() })

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final.find(val => val.genre === item.genre)
          if (res) res.count++
          else final.push({ genre: item.genre, count: 1 })
        }
      })
      final.sort((a, b) => b.count - a.count)

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final2.find(val => val.category === item.category)
          if (res) res.count++
          else final2.push({ category: item.category, count: 1 })
        }
      })
      final2.sort((a, b) => b.count - a.count)

      postInfoTransaction = await ar.createTransaction({ data: JSON.stringify(postInfo) }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      if (final[0]) postInfoTransaction.addTag('Top1-Genre', final[0].genre)
      if (final[1]) postInfoTransaction.addTag('Top2-Genre', final[1].genre)
      if (final[2]) postInfoTransaction.addTag('Top3-Genre', final[2].genre)
      if (final2[0]) postInfoTransaction.addTag('Top1-Category', final[0].category)
      if (final2[1]) postInfoTransaction.addTag('Top2-Category', final[1].category)
      if (final2[2]) postInfoTransaction.addTag('Top3-Category', final[2].category)
      postInfoTransaction.addTag('App-Name', APP_NAME)
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

      const postInfoRes = await ar.transactions.post(postInfoTransaction).catch(err => console.log('podcast post-info error: ', JSON.stringify(err)))
      console.log(postInfoTransaction.id + ': ', postInfoRes)

      commit('setPodcastUploadComplete', true)
    },
    async uploadSoundEffect ({ commit }, data) {
      commit('setSoundEffectUploadComplete', false)
      commit('setUploadCoverPct', 0)
      commit('setUploadMusicPct', 0)
      let imgTransaction = ''
      let audioTransaction = ''
      let soundEffectTransaction = ''
      let postInfoTransaction = ''

      // User info
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      // Image Upload
      imgTransaction = await ar.createTransaction({ data: data.img.data }, data.key).catch(err => console.log('Image Transaction Created Failed: ', err))

      // // Add tag 添加标签
      imgTransaction.addTag('Content-Type', data.img.type)
      imgTransaction.addTag('App-Name', APP_NAME)
      imgTransaction.addTag('Unix-Time', Date.now())
      imgTransaction.addTag('Type', 'soundeffect-cover')
      imgTransaction.addTag('Author-Address', address)
      imgTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(imgTransaction, data.key)
      let imgUploader = await ar.transactions.getUploader(imgTransaction)

      while (!imgUploader.isComplete) {
        await imgUploader.uploadChunk()
        commit('setUploadCoverPct', imgUploader.pctComplete)
      }

      const imgRes = await ar.transactions.post(imgTransaction)
      console.log(imgTransaction.id + ': ', imgRes)

      // Upload Audio
      const musicReady = encryptBuffer(Buffer.from(data.music.data.music))
      audioTransaction = await ar.createTransaction({ data: musicReady }, data.key).catch(err => console.log('Music Transaction Created Failed: ', err))

      // Add tag 添加标签
      audioTransaction.addTag('Content-Type', data.music.type)
      audioTransaction.addTag('App-Name', APP_NAME)
      audioTransaction.addTag('Unix-Time', Date.now())
      audioTransaction.addTag('Type', 'soundeffect-audio')
      audioTransaction.addTag('Author-Address', address)
      audioTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(audioTransaction, data.key)
      let musicUploader = await ar.transactions.getUploader(audioTransaction)

      while (!musicUploader.isComplete) {
        await musicUploader.uploadChunk()
        commit('setUploadMusicPct', musicUploader.pctComplete)
        commit('setUploadStatus', 'Uploading chunks: ' + `${musicUploader.uploadedChunks}/${musicUploader.totalChunks}`)
      }

      commit('setUploadStatus', 'Await confirmation on post')

      const musicRes = await ar.transactions.post(audioTransaction)
      console.log(audioTransaction.id + ': ', musicRes)

      // Create SoundEffect info
      const soundEffectInfo = {
        title: data.soundEffect.title,
        desp: data.soundEffect.desp,
        price: data.soundEffect.price,
        duration: data.soundEffect.duration,
        cover: imgTransaction.id,
        audio: audioTransaction.id
      }

      soundEffectTransaction = await ar.createTransaction({ data: JSON.stringify(soundEffectInfo) }, data.key).catch(err => console.log('Single Transaction Created Failed: ', err))

      soundEffectTransaction.addTag('App-Name', APP_NAME)
      soundEffectTransaction.addTag('Unix-Time', Date.now())
      soundEffectTransaction.addTag('Type', 'soundeffect-info')
      soundEffectTransaction.addTag('Title', data.soundEffect.title)
      soundEffectTransaction.addTag('Price', data.soundEffect.price)
      soundEffectTransaction.addTag('Author-Address', address)
      soundEffectTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(soundEffectTransaction, data.key)
      let singleUploader = await ar.transactions.getUploader(soundEffectTransaction)

      while (!singleUploader.isComplete) {
        await singleUploader.uploadChunk()
      }

      const singleRes = await ar.transactions.post(soundEffectTransaction)
      commit('setSoundEffectInfoId', audioTransaction.id)
      console.log(soundEffectTransaction.id + ': ', singleRes)

      // Create post info
      let postInfo = await API.arweave.getPostFromAddress(address)
      if (postInfo) {
        postInfo = JSON.parse(postInfo)
      } else {
        postInfo = []
      }

      let final = []
      let final2 = []
      postInfo.push({ typs: 'soundEffect', id: soundEffectTransaction.id, 'timestamp': Date.now() })

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final.find(val => val.genre === item.genre)
          if (res) res.count++
          else final.push({ genre: item.genre, count: 1 })
        }
      })
      final.sort((a, b) => b.count - a.count)

      postInfo.forEach(item => {
        if (item.genre) {
          const res = final2.find(val => val.category === item.category)
          if (res) res.count++
          else final2.push({ category: item.category, count: 1 })
        }
      })
      final2.sort((a, b) => b.count - a.count)

      postInfo.push({ typs: 'soundEffect', id: soundEffectTransaction.id, 'timestamp': Date.now() })

      postInfoTransaction = await ar.createTransaction({ data: JSON.stringify(postInfo) }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      if (final[0]) postInfoTransaction.addTag('Top1-Genre', final[0].genre)
      if (final[1]) postInfoTransaction.addTag('Top2-Genre', final[1].genre)
      if (final[2]) postInfoTransaction.addTag('Top3-Genre', final[2].genre)
      if (final2[0]) postInfoTransaction.addTag('Top1-Category', final[0].category)
      if (final2[1]) postInfoTransaction.addTag('Top2-Category', final[1].category)
      if (final2[2]) postInfoTransaction.addTag('Top3-Category', final[2].category)
      postInfoTransaction.addTag('App-Name', APP_NAME)
      postInfoTransaction.addTag('Unix-Time', Date.now())
      postInfoTransaction.addTag('Type', 'post-info')
      postInfoTransaction.addTag('Author-Address', address)
      postInfoTransaction.addTag('Author-Username', user.data)

      await ar.transactions.sign(postInfoTransaction, data.key)
      let postInfoUploader = await ar.transactions.getUploader(postInfoTransaction)

      while (!postInfoUploader.isComplete) {
        await postInfoUploader.uploadChunk()
      }

      const postInfoRes = await ar.transactions.post(postInfoTransaction).catch(err => console.log('soundeffect post-info error: ', JSON.stringify(err)))
      console.log(postInfoTransaction.id + ': ', postInfoRes)

      commit('setSoundEffectUploadComplete', true)
    },
    async updateLocation ({ commit }, data) {
      console.log('Update location to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-location')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'location')
      commit('setUserInfoUpdateComplete', false)
    },
    async updateWebsite ({ commit }, data) {
      console.log('Update website to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-website')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'website')
      commit('setUserInfoUpdateComplete', false)
    },
    async updateIntro ({ commit }, data) {
      console.log('Update introduction to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-introduction')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'intro')
      commit('setUserInfoUpdateComplete', false)
    },
    async updateNeteaseId ({ commit }, data) {
      console.log('Update netease id to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-neteaseid')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'neteaseId')
      commit('setUserInfoUpdateComplete', false)
    },
    async updateSoundCloudId ({ commit }, data) {
      console.log('Update soundcloud id to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-soundcloudid')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'soundcloudId')
      commit('setUserInfoUpdateComplete', false)
    },
    async updateBandcampId ({ commit }, data) {
      console.log('Update bandcamp id to user profile')
      const address = await API.arweave.getAddress(data.key)
      const user = await API.arweave.getIdFromAddress(address)

      let transaction = ''

      transaction = await ar.createTransaction({ data: data.value }, data.key).catch(err => console.log('Post Info Transaction Created Failed: ', err))

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'profile-bandcampid')
      transaction.addTag('Username', user.data)

      await ar.transactions.sign(transaction, data.key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)
      commit('setUserInfoUpdateComplete', 'bandcampId')
      commit('setUserInfoUpdateComplete', false)
    },
    async purchaseForItem ({ commit }, data) {
      console.log(data)
      commit('setPurchaseComplete', false)
      const now = Date.now()

      let community = new Community(ar)
      community.setCommunityTx(config.community)

      let comTx = ''
      try {
        let holder = await community.selectWeightedHolder()
        console.log(holder)

        comTx = await ar.createTransaction({
          target: holder,
          quantity: data.toCommunity + ''
        }, data.key)

        comTx.addTag('App-Name', APP_NAME)
        comTx.addTag('Type', 'Tip-Community')
        comTx.addTag('Unix-Time', now)
        comTx.addTag('Target', data.target)
        comTx.addTag('Source', data.source)
        comTx.addTag('Price', data.price)
        comTx.addTag('Item', data.item)

        await ar.transactions.sign(comTx, data.key)

        const comRes = await ar.transactions.post(comTx)
        console.log('to community', comTx.id + ': ', comRes)
        community = null
      } catch (e) {
        community = null
      }

      console.log('continue')
      let devTx = ''

      devTx = await ar.createTransaction({
        target: config.dev,
        quantity: data.toDeveloper + ''
      }, data.key)

      devTx.addTag('App-Name', APP_NAME)
      devTx.addTag('Type', 'Tip-Developer')
      devTx.addTag('Unix-Time', now)
      devTx.addTag('Target', data.target)
      devTx.addTag('Source', data.source)
      devTx.addTag('Price', data.price)
      devTx.addTag('Item', data.item)

      await ar.transactions.sign(devTx, data.key)

      const devRes = await ar.transactions.post(devTx)
      console.log('to developer', devTx.id + ': ', devRes)

      let transaction = ''

      transaction = await ar.createTransaction({
        target: data.target,
        quantity: ar.ar.arToWinston(data.price + '')
      }, data.key)

      let albumType = data.type
      if (data.type === 'album-full') data.type = 'album-info'

      transaction.addTag('App-Name', APP_NAME)
      transaction.addTag('Type', 'Purchase')
      transaction.addTag('Purchase-Type', data.type)
      if (albumType === 'album-info') {
        transaction.addTag('Album-Type', 'one')
        transaction.addTag('Track-Number', data.trackNumber)
      } else if (albumType === 'album-full') {
        transaction.addTag('Album-Type', 'full')
      }
      transaction.addTag('Unix-Time', now)
      transaction.addTag('Target', data.target)
      transaction.addTag('Source', data.source)
      transaction.addTag('Price', data.price)
      transaction.addTag('Item', data.item)

      await ar.transactions.sign(transaction, data.key)

      const res = await ar.transactions.post(transaction)
      console.log(transaction.id + ': ', res)

      commit('setPaymentId', transaction.id)
      commit('setPurchaseComplete', true)
    }
  }
})
