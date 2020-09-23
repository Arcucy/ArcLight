const StringUtil = {
  /**
   * 计算 Utf8 字符串的体积
   * @param {String} str 需要计算的字符串
   */
  lengthInUtf8Bytes (str) {
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return str.length + (m ? m.length : 0)
  }
}

module.exports = StringUtil
