const Arweave = require('arweave')

const Log = require('./src/util/log')

const arweave = new Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: true,
})