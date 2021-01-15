const AudioUtil = {
  /**
   * 剪切音频
   * @param {AudioBuffer} audioBuffer 需要剪切的音频
   * @param {Number} start 开始位置（单位秒）
   * @param {Number} last 持续时间（单位秒）
   */
  cutAudio (audioBuffer, start, last) {
    // 声道数量和采样率
    const channels = audioBuffer.numberOfChannels
    const rate = audioBuffer.sampleRate
    // 裁切后的采样长度
    const lastOffset = rate * last
    // 创建同样采用率、同样声道数量的空的AudioBuffer
    const newAudioBuffer = new AudioContext().createBuffer(channels, lastOffset, rate)
    // 创建临时的Array存放复制的buffer数据
    const anotherArray = new Float32Array(lastOffset)
    // 声道的数据的复制和写入
    const offset = 0
    for (var channel = 0; channel < channels; channel++) {
      audioBuffer.copyFromChannel(anotherArray, channel, start)
      newAudioBuffer.copyToChannel(anotherArray, channel, offset)
    }
    return newAudioBuffer
  },

  /**
   * 将 AudioBuffer 转换成 Wav 格式的文件
   * @param {AudioBuffer} abuffer 需要转换的 AudioBuffer
   */
  audioBufferToWave (abuffer) {
    const numOfChan = abuffer.numberOfChannels
    const length = abuffer.length * numOfChan * 2 + 44
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)
    const channels = []
    let i
    let sample
    let offset = 0
    let pos = 0

    const setUint16 = (data) => {
      view.setUint16(pos, data, true)
      pos += 2
    }

    const setUint32 = (data) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    setUint32(0x46464952)
    setUint32(length - 8)
    setUint32(0x45564157)
    setUint32(0x20746d66)
    setUint32(16)
    setUint16(1)
    setUint16(numOfChan)
    setUint32(abuffer.sampleRate)
    setUint32(abuffer.sampleRate * 2 * numOfChan)
    setUint16(numOfChan * 2)
    setUint16(16)
    setUint32(0x61746164)
    setUint32(length - pos - 4)

    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i))
    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]))
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
        view.setInt16(pos, sample, true)
        pos += 2
      }
      offset++
    }

    return new Blob([buffer], { type: 'audio/wav' })
  }
}

module.exports = AudioUtil
