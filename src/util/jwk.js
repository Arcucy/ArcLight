const crypto = require('crypto')
const jwkToPem = require('jwk-to-pem')

/**
 * 用来签名的小工具
 */
class JwkUtil {
  /**
   * 将 jwk 转换为 PEM 格式的 RSA 密钥
   * @param {Object} input jwk 对象
   * @param {*} mode 输出模式：['private': 私钥, 'public': 公钥]
   */
  static async toPem (input, mode) {
    let key = ''
    if (mode === 'private') {
      key = jwkToPem(input, { private: true })
    } else if (mode === 'public') {
      key = jwkToPem(input)
    }
    return key
  }

  /**
   * 对数据签名，输入私钥，客户端
   * @param {String} pri - 私钥
   * @param {String} data - 需要签名的数据
   */
  static async signMessage (pri, data) {
    // 创建签名
    const sign = crypto.createSign('sha384')
    sign.update(data)
    const signature = sign.sign(pri, 'hex')
    return signature
  }

  /**
   * 验证签名，输入公钥，服务端验证
   * @param {String} pub - 公钥
   * @param {String} signature - signMessage 获得的签名数据
   * @param {String} data - 之前签名的数据
   */
  static async verifyMessage (pub, signature, data) {
    const verify = crypto.createVerify('sha384')
    verify.update(data)
    return verify.verify(pub, signature, 'hex')
  }
}

module.exports = JwkUtil
