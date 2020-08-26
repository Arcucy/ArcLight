const crypto = require("crypto")

function sha256(string) {
    let str = string
    for (let i = 0; i < 4; i++) {
        str += Math.floor(Math.random() * Math.floor(9))
    }
    let hash = crypto.createHash('sha256').update(str, "utf8").digest("hex")
    return hash
}

exports.sha256 = sha256