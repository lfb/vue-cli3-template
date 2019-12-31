const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      // 开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg|tiff)(\?.*)?$/i
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  }
}
