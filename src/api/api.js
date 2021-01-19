const arweave = require('./arweave')
const converter = require('@lemonneko/currency-converter')
const getPrice = require('@limestonefi/api')

const API = {
  arweave: arweave.default,
  converter: converter.converter,
  priceGetter: getPrice
}

export default API
