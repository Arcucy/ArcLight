/* eslint-disable no-async-promise-executor */
import Arweave from 'arweave'
import Axios from 'axios'

import { decryptBuffer } from '../util/encrypt'
import decode from '../util/decode'
import stringUtil from '../util/string'

const arweaveHost = 'https://arweave.net/'

const ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

// Configuration

/**
 * Single 单曲信息的标记均为 single-info,
 * Album 专辑信息的标记均为 album-info,
 * Podcast 播客的标记均为 podcast-info,
 * SoundEffect 音效的标记均为 soundeffect-info.
 */
const AUDIO_TYPE = {
  single: 'single-info',
  album: 'album-info',
  podcast: 'podcast-info',
  soundEffect: 'soundeffect-info'
}

const AUDIO_ICON = {
  'single-info': 'mdi-music-circle',
  'album-info': 'mdi-album',
  'podcast-info': 'mdi-podcast',
  'soundeffect-info': 'mdi-waveform'
}

const REVERSED_AUDIO_TYPE = {
  'single-info': 'Single',
  'album-info': 'Album',
  'podcast-info': 'Podcast',
  'soundeffect-info': 'Sound Effect'
}

const APP_NAME = 'arclight-app'

const arweave = {
  breakOnCall: false,
  timerInterval: undefined,

  /**
   * Get user address based on key file content input
   * 根据密钥文件内容获取用户地址
   * @param {String} key      - 使用 keyFileContent，不是原始文件
   */
  getAddress (key) {
    return new Promise((resolve, reject) => {
      ar.wallets.jwkToAddress(key).then((address) => {
        resolve(address)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 转换 AR 为 Winston
   * @param {} ar   - AR 币值
   */
  getWinstonFromAr (arprice) {
    return ar.ar.arToWinston(arprice)
  },

  /**
   * 转换 Winston 为 AR
   * @param {*} winston
   */
  getArFromWinston (winston) {
    return ar.ar.winstonToAr(winston)
  },

  /**
   * Get transaction detail entirely based on given txid
   * 根据给定的 txid (交易ID) 获取完整的交易明细
   * @param {String} txid     - 交易编号
   */
  getTransactionDetail (txid) {
    return new Promise((resolve, reject) => {
      ar.transactions.get(txid).then(detail => {
        resolve(detail)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * Get the decoded data and buffer to string from the given transaction id
   * 根据给定的 txid (交易ID) 获取解码的数据并缓冲为字符串
   * @param {String} txid     - 交易编号
   */
  getTransactionDataDecodedString (txid) {
    return new Promise((resolve, reject) => {
      ar.transactions.getData(txid, { decode: true, string: true }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 提取给定的交易对象中的所有标签
   * @param {Object} transaction
   */
  getTagsByTransaction (transaction) {
    const tags = transaction.get('tags')
    const ret = {}
    for (let i = 0; i < tags.length; i++) {
      const key = tags[i].get('name', { decode: true, string: true })
      const value = tags[i].get('value', { decode: true, string: true })
      ret[key] = value
    }
    return ret
  },

  /**
   * Get user's Arweave Id based on the input wallet address
   * 根据输入的钱包地址获取用户的 Arweave ID
   * @param {String} address  - 用户的钱包地址
   */
  getIdFromAddress (address) {
    return new Promise((resolve, reject) => {
      /**
       * Use ArQL language to search the user's Arweave ID database
       * 使用 ArQL 语言搜索用户的 Arweave ID 数据库
       */
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address // User address 用户钱包地址
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'arweave-id' // Specified the App-Name as arweave-id 将应用程序名称指定为arweave-id
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'name'
          }
        }
      }).then(ids => {
        // Init a object to be resolved later
        // 初始化要稍后返回的对象
        const res = {
          type: 'User',
          data: ''
        }

        // Sepecify the user to be a guest if ids is empty
        // 如果 id 为空，则指定用户为访客 Guest
        if (ids.length === 0) {
          res.type = 'guest'
          res.data = 'Guest'
          // resolve data on finish
          return resolve(res)
        }

        const id = ids[0]

        // Get transaction detial
        // 获取交易明细
        this.getTransactionDetail(id).then(transaction => {
          // Go through for each id to find the tag
          // 遍历每个id来找到标签
          transaction.get('tags').forEach(tag => {
            const key = tag.get('name', { decode: true, string: true })
            const value = tag.get('value', { decode: true, string: true })
            if (key === 'Type') {
              res.type = value
            }
          })

          // Get the encoded data from transaction
          // 从交易中获取编码数据
          this.getTransactionDataDecodedString(id).then(data => {
            res.data = data
            // resolve data on finish
            // 完成时返回数据
            resolve(res)
          }).catch(err => reject(err))
        }).catch(() => reject(new Error('Account has errored transactions, check your balance')))
      }).catch(err => reject(err))
    })
  },

  /**
   * Get user's Arweave Avatar based on the input wallet address
   * 根据输入的钱包地址获取用户的 Arweave 头像
   * @param {String} address    - 用户的钱包地址
   */
  getAvatarFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'arweave-avatar'
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'avatar'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * Get All Audio Release List
   * 获取所有音频发行列表
   * @param {String} type 音频类型（single, album, podcast, soundEffect）
   * @param {String} style 【可选】筛选歌曲风格（需要注意的是部分音频类型下没有区分歌曲风格）
   */
  getAllAudioList (type, style) {
    return new Promise((resolve, reject) => {
      // 筛选音频类型
      const typeString = AUDIO_TYPE[type]
      if (!typeString) throw new Error(`${type} is the wrong type`)
      // 筛选歌曲风格
      const ordinary = {
        op: 'equals',
        expr1: 'Type',
        expr2: typeString
      }
      const hasTypedSearch = style ? {
        op: 'and', // 使用相等运算符
        expr1: ordinary,
        expr2: {
          op: 'equals',
          expr1: 'Genre',
          expr2: style
        }
      } : ordinary

      ar.arql({
        op: 'and', // 使用 AND 运算符
        expr1: {
          op: 'equals', // 使用 相等 运算符
          expr1: 'App-Name', // 特指 App-Name 标签
          expr2: APP_NAME // 特指值为 arclight-test (测试网)
        },
        expr2: hasTypedSearch
      }).then(ids => {
        if (ids.length === 0) {
          resolve([])
        } else {
          resolve(stringUtil.getBlockedArray(ids, type))
        }
      })
    })
  },

  /**
   * Get User Audio Release List
   * 获取用户发行的音频列表
   * @param {String} address  - 用户的钱包地址
   * @param {String} type     - 音频类型（single, album, podcast, soundEffect）
   * @param {String} style    -【可选】筛选歌曲风格（需要注意的是部分音频类型下没有区分歌曲风格）
   */
  getUserAudioList (address, type, style) {
    return new Promise((resolve, reject) => {
      // 筛选音频类型
      const typeString = AUDIO_TYPE[type]
      if (!typeString) throw new Error(`${type} is the wrong type`)
      // 筛选歌曲风格
      const ordinary = {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'Author-Address',
          expr2: address
        },
        expr2: {
          op: 'equals',
          expr1: 'Type',
          expr2: typeString
        }
      }
      const hasTypedSearch = style ? {
        op: 'and', // 使用相等运算符
        expr1: ordinary,
        expr2: {
          op: 'equals',
          expr1: 'Genre',
          expr2: style
        }
      } : ordinary

      ar.arql({
        op: 'and', // 使用 AND 运算符
        expr1: {
          op: 'equals', // 使用 相等 运算符
          expr1: 'App-Name', // 特指 App-Name 标签
          expr2: APP_NAME // 特指值为 arclight-test (测试网)
        },
        expr2: hasTypedSearch
      }).then(ids => {
        if (ids.length === 0) {
          resolve([])
        } else {
          resolve(stringUtil.getBlockedArray(ids, type))
        }
      })
    })
  },

  /**
   * 根据给定的交易 ID 列表获取歌曲信息列表
   * @param {Number} txids 交易 ID 列表
   * @param {Function} callback (item, index) 如果需要实时的逐条获取列表，请使用这个回调，如果需要在所有的查询完成后获取，则直接接收返回值。
   */
  async getAudioInfoByTxids (txids, callback) {
    const infoList = []
    for (let i = 0; i < txids.length; i++) {
      let transaction
      try {
        transaction = await this.getTransactionDetail(txids[i])
      } catch (e) {
        console.error(txids[i], e)
      }
      let audioInfo = null
      if (transaction) {
        const tags = this.getTagsByTransaction(transaction)
        const audioData = JSON.parse(decode.uint8ArrayToString(transaction.data))
        audioInfo = {
          txid: txids[i],
          authorAddress: tags['Author-Address'],
          authorUsername: tags['Author-Username'],
          type: tags.Type,
          unixTime: Number(tags['Unix-Time']),
          title: audioData.title,
          desp: audioData.desp,
          price: audioData.price,
          duration: audioData.duration,
          coverTxid: audioData.cover,
          musicTxid: audioData.music
        }
      }
      infoList.push(audioInfo)
      if (callback) callback(audioInfo, i)
    }
    return infoList
  },

  /**
   * Get cover image based on given txid (transaction id)
   * 根据输入的 txid (交易 ID)获取封面
   * @param {String} txid(TransactionId)  - 图片的交易地址
   */
  getCover (txid) {
    return new Promise((resolve, reject) => {
      ar.transactions.getData(txid, { decode: true, string: true }).then(data => {
        resolve(data)
      })
    })
  },

  /**
   * Get audio data based on given txid (transaction id)
   * @param {String} txid(TransactionId)  - 音频的交易地址
   */
  getMusicUrl (txid) {
    return arweaveHost + txid
  },

  /**
   * Get audio data based on given txid (transaction id)
   * @param {String} txid(TransactionId)  - 音频的交易地址
   * @param {any} cancelToken - 取消标记（用来取消下载）
   * @param {Function} callback - 如果需要获取加载进度，请使用这个回调方法
   */
  getMusic (txid, cancelToken, callback) {
    return new Promise((resolve, reject) => {
      // 加载进度回调
      let onDownloadProgress
      if (callback) {
        onDownloadProgress = progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          callback(percentCompleted)
        }
      }
      // get
      Axios.get(arweaveHost + txid, {
        responseType: 'arraybuffer',
        cancelToken,
        onDownloadProgress
      }).then(res => {
        const data = decryptBuffer(Buffer.from(res.data))
        resolve({ data: data, type: res.headers['content-type'] })
      })
    })
  },

  /**
   * 获取已购买的音频
   * @param {String} address 用户的钱包地址
   * @param {String} type 音频类型
   */
  getPurchasedItems (address, type) {
    const typeString = AUDIO_TYPE[type]
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Source',
              expr2: address
            },
            expr2: {
              op: 'equals',
              expr1: 'Type',
              expr2: 'Purchase'
            }
          },
          expr2: {
            op: 'equals',
            expr1: 'Purchase-Type',
            expr2: typeString
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve([])
          return
        }
        resolve(ids)
      })
    })
  },

  /**
   * 获取用户购买物品的状态
   * @param {*} address   - 用户钱包地址
   * @param {*} item      - 购买物品地址
   */
  getItemPurchaseStatus (address, item) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Source',
              expr2: address
            },
            expr2: {
              op: 'equals',
              expr1: 'Type',
              expr2: 'Purchase'
            }
          },
          expr2: {
            op: 'equals',
            expr1: 'Item',
            expr2: item
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }
        resolve(ids[0])
      })
    })
  },

  /**
   * 获取用户购买完整专辑的状态
   * @param {*} address   - 用户钱包地址
   * @param {*} item      - 购买物品地址
   */
  getAlbumPurchaseStatus (address, item) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Source',
              expr2: address
            },
            expr2: {
              op: 'equals',
              expr1: 'Type',
              expr2: 'Purchase'
            }
          },
          expr2: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Album-Type',
              expr2: 'full'
            },
            expr2: {
              op: 'equals',
              expr1: 'Item',
              expr2: item
            }
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }
        resolve(ids[0])
      })
    })
  },

  /**
   * 获取用户购买物品的状态
   * @param {*} address   - 用户钱包地址
   * @param {*} item      - 购买物品地址
   */
  getAlbumItemPurchaseStatus (address, item, trackNumber) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Source',
              expr2: address
            },
            expr2: {
              op: 'equals',
              expr1: 'Type',
              expr2: 'Purchase'
            }
          },
          expr2: {
            op: 'and',
            expr1: {
              op: 'equals',
              expr1: 'Item',
              expr2: item
            },
            expr2: {
              op: 'equals',
              expr1: 'Track-Number',
              expr2: trackNumber + ''
            }
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }
        resolve(ids[0])
      })
    })
  },

  querySearch (val, callback) {
    return new Promise(async (resolve, reject) => {
      this.breakOnCall = false
      const res = []
      const singleData = await ar.arql({
        op: 'and',
        expr1: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: AUDIO_TYPE.single
          }
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'Title',
            expr2: val
          },
          expr2: {
            op: 'equals',
            expr1: 'Author-Username',
            expr2: val
          }
        }
      })
      const albumData = await ar.arql({
        op: 'and',
        expr1: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: AUDIO_TYPE.album
          }
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'Title',
            expr2: val
          },
          expr2: {
            op: 'equals',
            expr1: 'Author-Username',
            expr2: val
          }
        }
      })
      const podcastData = await ar.arql({
        op: 'and',
        expr1: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: AUDIO_TYPE.podcast
          }
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'Title',
            expr2: val
          },
          expr2: {
            op: 'equals',
            expr1: 'Author-Username',
            expr2: val
          }
        }
      })
      const soundeffectData = await ar.arql({
        op: 'and',
        expr1: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: AUDIO_TYPE.soundEffect
          }
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'Title',
            expr2: val
          },
          expr2: {
            op: 'equals',
            expr1: 'Author-Username',
            expr2: val
          }
        }
      })
      let data = []
      data = data.concat(singleData).concat(albumData).concat(podcastData).concat(soundeffectData)
      for (let i = 0; i < data.length; i++) {
        if (this.breakOnCall) {
          break
        }
        const tx = await this.getTransactionDetail(data[i])
        const tags = await this.getTagsByTransaction(tx)
        const type = REVERSED_AUDIO_TYPE[tags.Type]
        const icon = AUDIO_ICON[tags.Type]

        const id = data[i]
        const title = tags.Title
        const artist = tags['Author-Username']
        const final = { searchType: 'Music', id: id, title: title, artist: artist, type: type, icon: icon }
        if (icon !== undefined) callback(final)
        else continue
      }
      resolve(res)
    })
  },

  getAllInfo (arr, type, icon) {
    return new Promise(async (resolve, reject) => {
      const res = []
      for (let i = 0; i < arr.length; i++) {
        const tx = await this.getTransactionDetail(arr[i].id)
        const tags = await this.getTagsByTransaction(tx)
        res.push({ id: arr[i].id, title: tags.Title, artist: tags['Author-Username'] })
      }
    })
  },

  /**
   * Get user's location settings from given address
   * @param {String} address  - 用户的钱包地址
   */
  getLocationFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-location'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * Get user's website settings from given address
   * @param {String} address  - 用户的钱包地址
   */
  getWebsiteFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-website'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * Get user's introduction settings from given address
   * @param {String} address  - 用户的钱包地址
   */
  getIntroFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-introduction'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * Get user's netease id settings from given address
   * @param {String} address  - 用户的钱包地址
   */
  getNeteaseIdFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-neteaseid'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * Get user's soundcloud id settings from given address
   * @param {String} address  - 用户的钱包地址
   */
  getSoundCloudIdFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-soundcloudid'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * 获取与提供的类型标签最相似的用户类型（一种类型符合目标的一级类型）。
   * @param {Number} genre1 歌曲类型
   */
  getTheMostSimilarUsers (genre1) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          },
          expr2: { // 匹配歌曲类型
            op: 'equals',
            expr1: 'Top1-Genre',
            expr2: genre1 || 'noGenreData'
          }
        }
      }).then(ids => { resolve(ids || []) })
    })
  },

  /**
   * 获取与提供的类型标签相似的用户类型(两种类型的任意一种符合目标的一或二级类型)。
   * @param {Number} genre1 歌曲类型
   */
  GetTheSimilarUsers (genre1, genre2) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          },
          expr2: { // 匹配歌曲类型
            op: 'or',
            expr1: { // Top1 类型
              op: 'or',
              expr1: {
                op: 'equals',
                expr1: 'Top1-Genre',
                expr2: genre1 || 'noGenreData'
              },
              expr2: {
                op: 'equals',
                expr1: 'Top1-Genre',
                expr2: genre2 || 'noGenreData'
              }
            },
            expr2: { // Top2 类型
              op: 'or',
              expr1: {
                op: 'equals',
                expr1: 'Top2-Genre',
                expr2: genre1 || 'noGenreData'
              },
              expr2: {
                op: 'equals',
                expr1: 'Top2-Genre',
                expr2: genre2 || 'noGenreData'
              }
            }
          }
        }
      }).then(ids => { resolve(ids || []) })
    })
  },

  /**
   * 获取与提供的类型标签有些相似的用户类型(三种类型的任意一种符合目标的一或二或三级类型)。
   * @param {Number} genre1 歌曲类型
   */
  getSomewhatSimilarUsers (excluded, genre1, genre2, genre3) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: APP_NAME
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          },
          expr2: { // 匹配歌曲类型
            op: 'or',
            expr1: { // Top1 类型
              op: 'or',
              expr1: {
                op: 'equals',
                expr1: 'Top1-Genre',
                expr2: genre1 || 'noGenreData'
              },
              expr2: {
                op: 'or',
                expr1: {
                  op: 'equals',
                  expr1: 'Top1-Genre',
                  expr2: genre2 || 'noGenreData'
                },
                expr2: {
                  op: 'equals',
                  expr1: 'Top1-Genre',
                  expr2: genre3 || 'noGenreData'
                }
              }
            },
            expr2: {
              op: 'or',
              expr1: { // Top2 类型
                op: 'or',
                expr1: {
                  op: 'equals',
                  expr1: 'Top2-Genre',
                  expr2: genre1 || 'noGenreData'
                },
                expr2: {
                  op: 'or',
                  expr1: {
                    op: 'equals',
                    expr1: 'Top2-Genre',
                    expr2: genre2 || 'noGenreData'
                  },
                  expr2: {
                    op: 'equals',
                    expr1: 'Top2-Genre',
                    expr2: genre3 || 'noGenreData'
                  }
                }
              },
              expr2: { // Top3 类型
                op: 'or',
                expr1: {
                  op: 'equals',
                  expr1: 'Top3-Genre',
                  expr2: genre1 || 'noGenreData'
                },
                expr2: {
                  op: 'or',
                  expr1: {
                    op: 'equals',
                    expr1: 'Top3-Genre',
                    expr2: genre2 || 'noGenreData'
                  },
                  expr2: {
                    op: 'equals',
                    expr1: 'Top3-Genre',
                    expr2: genre3 || 'noGenreData'
                  }
                }
              }
            }
          }
        }
      }).then(ids => { resolve(ids || []) })
    })
  },

  /**
   * Get user's Bandcamp Id settings from given address
   * @param {String} address  - 用户的钱包地址s
   */
  getBandCampFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'profile-bandcampid'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * 获取用户上传的所有 post info 的 txid 列表
   * @param {*} address
   */
  getPostInfosByAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          }
        }
      }).then(async ids => { resolve(ids || []) })
    })
  },

  getDataForPost (address) {
    return new Promise(async (resolve, reject) => {
      const list = await this.getPostInfosByAddress(address)
      if (!list.length) {
        resolve(null)
      } else {
        let data = await this.getPostData(list[0], address)
        if (!data) {
          resolve(false)
        } else {
          clearTimeout(this.timerInterval)
          data = decode.uint8ArrayToString(data.data)
          resolve(data)
        }
      }
    })
  },

  async getPostData (txid, address) {
    let transaction
    try {
      transaction = await this.getTransactionDetail(txid)
    } catch (e) {
      if (e.type === 'TX_PENDING') {
        this.timerInterval = setTimeout(() => {
          console.log('retry')
          this.getDataForPost(address)
        }, 2000)
      } else {
        console.log(e)
      }
    }
    return transaction
  },

  getPostFromAddress (address) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          }
        }
      }).then(async ids => {
        if (!ids.length) {
          resolve(null)
          return
        }
        // 有可能查到正在等待确认的交易所以需要通过循环尝试另一个交易地址，直到成功或者遍历了所有的地址。
        let detail
        for (let i = 0; i < ids.length; i++) {
          try {
            detail = await this.getTransactionDetail(ids[i])
            break
          } catch (e) {
            if (e.type !== 'TX_PENDING') {
              reject(new Error(e))
            }
          }
        }
        if (!detail) resolve(false)
        const tags = this.getTagsByTransaction(detail)
        const data = JSON.parse(decode.uint8ArrayToString(detail.data))
        resolve({ data, tags, tx: detail })
      })
    })
  },

  getSearchObject (data) {
    return new Promise((resolve, reject) => {
      ar.arql({
        op: 'equals',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: data
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        ar.transactions.getData(ids[0], { decode: true, string: true }).then(data => {
          resolve(data)
        })
      })
    })
  },

  /**
   * 获取上传给定大小的文件需要支付多少 Winston。
   * 注意：在展示时请使用 winstonToAr 转换为 AR 在显示，在运算时，请保持在 Winston 单位运算，以保证精确。
   * @param {*} byte
   */
  async getUploadPrice (byte) {
    const res = await Axios.get(`${arweaveHost}/price/${Number(byte)}`)
    if (res && res.data) return res.data
    else return 0
  },

  async getPaymentPrice (address) {
    const res = await Axios.get(`${arweaveHost}/price/1/${address}`)
    if (res && res.data) return res.data
    else return 0
  },

  winstonToAr (winston) {
    return ar.ar.winstonToAr(winston)
  },

  getBalance (key) {
    return new Promise((resolve, reject) => {
      ar.wallets.jwkToAddress(key).then(address => {
        ar.wallets.getBalance(address).then((balance) => {
          resolve(ar.ar.winstonToAr(balance))
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
}

export default arweave
