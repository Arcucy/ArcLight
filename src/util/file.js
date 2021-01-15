import API from '@/api/api'

class FileUtil {
  // 检查是否是Arweave的key文件
  static async isValidKeyFile (content) {
    let shouldContinue = true
    await API.arweave.getAddress(content).catch(() => { // 提前检查是否是Arweave的key
      shouldContinue = false
    })
    return shouldContinue
  }
}

export {
  FileUtil
}
