import API from '@/api/api'
import decode from '@/util/decode'
import localforage from 'localforage'

class LocalCache {
  async findKeyByTxid (txid) {
    let result
    const keys = await localforage.keys()
    for (const index in keys) {
      if (keys[index].endsWith(txid)) {
        result = keys[index]
        break
      }
    }
    return result
  }

  async getInfoByTxid (txid) {
    const keyName = await this.findKeyByTxid(txid)
    if (keyName) {
      const cached = await localforage.getItem(keyName)
      if (cached) {
        return JSON.parse(cached)
      }
    }
    const transaction = await API.arweave.getTransactionDetail(txid)
    if (transaction) {
      const data = JSON.parse(decode.uint8ArrayToString(transaction.data))
      console.log(data)
      const tags = API.arweave.getTagsByTransaction(transaction)
      console.log(tags)
      const type = tags.Type
      const needToCache = {
        txid,
        authorAddress: tags['Author-Address'],
        authorUsername: tags['Author-Username'],
        type: tags.Type,
        unixTime: Number(tags['Unix-Time']),
        title: data.title,
        desp: data.desp,
        price: data.price,
        duration: data.duration,
        coverTxid: data.cover,
        tags
      }
      switch (type) {
        case 'single-info':
          needToCache.musicTxid = data.music
          needToCache.genre = data.genre
          break
        case 'album-info':
          needToCache.music = data.music
          needToCache.genre = data.genre
          break
        case 'soundeffect-info':
          needToCache.audio = data.audio
          break
        case 'podcast-info':
          needToCache.category = data.category
          needToCache.podcast = data.podcast
          break
        case 'playlist-info':
          break
      }
      const keyName = type + ':' + Date.now() + ':' + txid
      await localforage.setItem(keyName, JSON.stringify(needToCache))
      return needToCache
    }
  }
}

export const localCache = new LocalCache()
