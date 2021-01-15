module.exports = {
  configureWebpack: {
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    module: {
      rules: [
        {
          test: /\.(svg)(\?.*)?$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                limit: 10000,
                name: 'assets/img/[name].[hash:7].[ext]',
                symbolId: 'icon-[name]'
              }
            }
          ]
        }
      ]
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '././'
    : './',
  chainWebpack: config => {
    config.module
      .rule('svg')
      .test(() => false)
      .use('file-loader')
  }
}
