const StringUtil = {
  /**
   * 计算 Utf8 字符串的体积
   * @param {String} str 需要计算的字符串
   */
  lengthInUtf8Bytes (str) {
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return str.length + (m ? m.length : 0)
  },

  toPlainString (num) {
    return ('' + num).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/,
      function (a, b, c, d, e) {
        return e < 0
          ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
          : b + c + d + Array(e - d.length + 1).join(0)
      })
  }
}

module.exports = StringUtil
