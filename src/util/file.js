class FileUtil {
  // 检查是否是Arweave的key文件
  static isValidKeyFile (content) {
    return content.kty && content.e && content.n && content.d && content.p && content.q && content.dp && content.dq && content.qi
  }
}

export {
  FileUtil
}
