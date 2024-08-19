const { generateWebpackConfig } = require('shakapacker')

const webpackConfig = generateWebpackConfig()

// Defina o modo (mode) para development ou production
webpackConfig.mode = 'development' // ou 'production'

module.exports = webpackConfig
