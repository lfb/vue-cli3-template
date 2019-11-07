const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://homestead.test/api',
        pathRewrite: { '^/api': '' }
      }
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 上线压缩去除console等信息
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // 删除所有的console语句
              drop_console: true,
              // 把使用多次的静态值自动定义为变量
              reduce_vars: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            },
            output: {
              // 使输出的代码尽可能紧凑
              beautify: false
            }
          },
          sourceMap: false,
          // 允许并发
          parallel: true,
          // 开启缓存
          cache: true
        })
      )
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
      // 配置 dll 文件
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require('./public/vendor/vendor-manifest.json')
        }),
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, './public/vendor/*.js'),
          // dll 引用路径
          publicPath: './vendor',
          // dll最终输出的目录
          outputPath: './vendor'
        })
      )
      if (process.env.npm_config_report) {
        // 打包后模块大小分析
        // npm run build --report
        config.plugins.push(new BundleAnalyzerPlugin())
      }
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!isProduction,
    // 开启 CSS source maps
    sourceMap: !!isProduction,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        // 这是rem适配的配置
        plugins: [
          require('postcss-px2rem')({
            remUnit: 75
          })
        ]
      },
      less: {
        // 全局引入，多文件以分号隔开
        data: '"@import "~@/assets/css/common.less";'
      }
    }
  },
  // 打包时不生成.map文件
  productionSourceMap: false
}
