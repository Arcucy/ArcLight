/* eslint-disable no-trailing-spaces */
import Arweave from 'arweave'
import Axios from 'axios'

const arweaveHost = 'https://arweave.net/'

let ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

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
          type: '',
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

        // If the user has multiple records, use for go through
        // 如果用户有多个记录，使用 for 循环遍历
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i]

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
        }
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
   */
  getMusic (txid) {
    return new Promise((resolve, reject) => {
      Axios.get(arweaveHost + txid, { responseType: 'arraybuffer' }).then(res => {
        resolve({ data: res.data, type: res.headers['content-type'] })
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
