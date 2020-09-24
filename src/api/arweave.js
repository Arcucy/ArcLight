/* eslint-disable no-trailing-spaces */
import Arweave from 'arweave'
import Axios from 'axios'

import { decryptBuffer } from '../util/encrypt'
import decode from '../util/decode'

const arweaveHost = 'https://arweave.net/'

let ar = Arweave.init({
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

const APP_NAME = 'arclight-test'

let arweave = {

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
      ar.transactions.getData(txid, {decode: true, string: true}).then(data => {
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
    let ret = {}
    for (let i = 0; i < tags.length; i++) {
      let key = tags[i].get('name', { decode: true, string: true })
      let value = tags[i].get('value', { decode: true, string: true })
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
          resolve(res)
        }

        const id = ids[0]

        // Get transaction detial
        // 获取交易明细
        this.getTransactionDetail(id).then(transaction => {
          // Go through for each id to find the tag
          // 遍历每个id来找到标签
          transaction.get('tags').forEach(tag => {
            let key = tag.get('name', { decode: true, string: true })
            let value = tag.get('value', { decode: true, string: true })
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
          })
        })
      })
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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
      let hasTypedSearch = style ? {
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
          resolve(ids)
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
      let hasTypedSearch = style ? {
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
          resolve(ids)
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
      ar.transactions.getData(txid, {decode: true, string: true}).then(data => {
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
   * @param {Function} callback - 如果需要获取加载进度，请使用这个回调方法
   */
  getMusic (txid, callback) {
    return new Promise((resolve, reject) => {
      // 加载进度回调
      let onDownloadProgress
      if (callback) {
        onDownloadProgress = progressEvent => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          callback(percentCompleted)
        }
      }
      // get
      Axios.get(arweaveHost + txid, {
        responseType: 'arraybuffer',
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
          resolve(data)
        })
      })
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
          resolve(data)
        })
      })
    })
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
            expr2: 'arclight'
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'post-info'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve(false)
          return
        }

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
          resolve(data)
        })
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

        let detail = await this.getTransactionDetail(ids[0])
        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
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
  },

  /**
   * Publish a single based on the given address and key file   
   * 根据给定的钱包地址和密钥文件发布音乐（单曲）
   * @param {String} address              - 用户的钱包地址
   * @param {JSON Object} key             - 使用 keyFileContent，不是原始文件
   * @param {SingleMusic Object} single   - Single 单曲音乐的 data obejct 对象
   */
  postSingleFromAddress (address, key, single) {

  },

  /**
   * Publish an album based on the given address and key file   
   * 根据给定的地址和密钥文件发布专辑
   * @param {*} address                   - 用户的钱包地址
   * @param {*} key                       - 使用 keyFileContent，不是原始文件
   * @param {*} single                    - Album 专辑音乐的 data object 对象
   */
  postAlbumFromAddress (address, key, single) {

  },

  /**
   * Publish a podcast based on the given address and key file   
   * 根据给定的地址和密钥文件发布播客
   * @param {*} address                   - 用户的钱包地址
   * @param {*} key                       - 使用 keyFileContent，不是原始文件
   * @param {*} podcast                   - Podcast 播客的 data object 对象
   */
  postPodcastFromAddress (address, key, podcast) {

  }
}

export default arweave
