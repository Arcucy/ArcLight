const crypto = require('crypto')

const passcode = require('../../secrets/encrypt.json')

const algorithm = 'aes-256-ctr'

const key = passcode.code
let iv = passcode.iv

function encryptText (text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString('hex')
}

function decryptText (text) {
  iv = Buffer.from(iv)
  const encryptedText = Buffer.from(text, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

function encryptBuffer (audioBuffer) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(audioBuffer)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted
}

function decryptBuffer (audioBuffer) {
  iv = Buffer.from(iv)
  const encryptedContent = audioBuffer
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedContent)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted
}

module.exports = {
  encryptText,
  decryptText,
  encryptBuffer,
  decryptBuffer
}
