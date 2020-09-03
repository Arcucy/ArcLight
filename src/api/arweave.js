import Arweave from 'arweave'

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
   * @param {String} key      - The key file content, not file raw
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
   * @param {String} txid     - The transaction id
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
   * Get the decoded data to string for the given transaction
   * @param {String} txid     - The transaction id
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
   * Get user arweave id from based on addresss input
   * @param {String} address  - The address of user
   */
  getIdFromAddress (address) {
    return new Promise((resolve, reject) => {
      /**
       * Use ArQL language to search the user's Arweave ID database
       */
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address // User address
        },
        expr2: {
          op: 'and',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'arweave-id' // Sepecified the App-Name to arweave-id
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'name'
          }
        }
      }).then(ids => {
        // Init a object to be resolved later
        const res = {
          type: '',
          data: ''
        }

        // Sepecify the user to be a guest if ids is empty
        if (ids.length === 0) {
          res.type = 'guest'
          res.data = 'Guest'
          // resolve data on finish
          resolve(res)
        }

        // If the user has multiple records, use for go through
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i]

          // Get transaction detial
          this.getTransactionDetail(id).then(transaction => {
            // Go through for each id to find the tag
            transaction.get('tags').forEach(tag => {
              let key = tag.get('name', { decode: true, string: true })
              let value = tag.get('value', { decode: true, string: true })
              if (key === 'Type') {
                res.type = value
              }
            })

            // Get the encoded data from transaction
            this.getTransactionDataDecodedString(id).then(data => {
              res.data = data
              // resolve data on finish
              resolve(res)
            })
          })
        }
      })
    })
  },

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
  }
}

export default arweave
