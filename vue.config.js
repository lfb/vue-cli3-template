const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('webpack-merge')
const isProduction = process.env.NODE_ENV === 'production'

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  // 构建好的文件打包输出到 output 文件夹下
  outputDir: 'dist',
  assetsDir: 'static',
  // 可以对本地服务器进行相应配置
  devServer: {
    // string | Object 代理设置
    proxy: {
      '/api': {
        target: 'http://homestead.test/api',
        pathRewrite: { '^/api': '' }
      }
    }
  },
  // chainWebpack 配置项允许我们更细粒度的控制 webpack 的内部配置
  // 链式修改
  chainWebpack: config => {
    // 使用 alias 简化路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@lib', resolve('src/lib'))
      .set('@components', resolve('src/components'))
      .set('@img', resolve('src/images'))
      .set('@api', resolve('src/api'))
    // 图片下的 url-loader 值，将其 limit 限制改为 5M
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options =>
        merge(options, {
          limit: 5120
        })
      )
  },
  // 和 chainWebpack 一样，但configureWebpack 更倾向于整体替换和修改
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
              // 移除console
              pure_funcs: ['console.log']
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
      config.plugins.push(
        new CompressionWebpackPlugin({
          // 目标文件名称。[path] 被替换为原始文件的路径和 [query] 查询
          filename: '[path].gz[query]',
          // 使用 gzip 压缩
          algorithm: 'gzip',
          // 处理与此正则相匹配的所有文件
          test: /\.(js|css|json|txt|html|ico|svg|tiff)(\?.*)?$/i,
          // 只处理大于此大小的文件
          threshold: 10240,
          // 最小压缩比达到 0.8 时才会被压缩
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
      // 打包后模块大小分析
      config.plugins.push(
        new BundleAnalyzerPlugin()
      )
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!isProduction,
    // 开启 CSS source maps
    sourceMap: !!isProduction
  },
  // 生产环境下为了快速定位错误信息
  productionSourceMap: !!isProduction,
  // 引入公共样式文件
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('src/assets/css/common.less')
      ]
    }
  }
}
