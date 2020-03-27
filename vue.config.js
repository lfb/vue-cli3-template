const path = require('path');
const merge = require('webpack-merge');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const resolve = (dir) => path.join(__dirname, dir);

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
        target: 'http://mall.test/api',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  // 链式修改
  chainWebpack: (config) => {
    // 使用 alias 简化路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@lib', resolve('src/lib'))
      .set('@components', resolve('src/components'))
      .set('@img', resolve('src/assets/images'))
      .set('@api', resolve('src/api'));
    // 图片下的 url-loader 值，将其 limit 限制改为 5M
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => merge(options, {
        limit: 5 * 1024,
      }));
    config.module
      .rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve('src'))
      .end()
      .use('babel')
      .loader('babel-loader?cacheDirectory=true')
      .options({
        presets: [
          '@vue/cli-plugin-babel/preset',
        ],
        // 可以再这里按需引入组件库，如 vant 组件
        plugins: [
          ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
          }, 'vant']
        ]
      });
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高，有限抽离
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1, // 最少复用过几次
        },
        // 公共模块
        common: {
          name: 'common',
          priority: 0,
          minSize: 0, // 大小限制
          minChunks: 2, // 最少复用过几次
        },
      },
    });
  },
  // 和 chainWebpack 一样，但configureWebpack 更倾向于整体替换和修改
  configureWebpack: (config) => {
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
              pure_funcs: ['console.log'],
            },
            output: {
              // 使输出的代码尽可能紧凑
              beautify: false,
            },
          },
          sourceMap: false,
          // 允许并发
          parallel: true,
          // 开启缓存
          cache: true,
        }),
      );
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
          minRatio: 0.8,
        }),
      );
      if (process.env.npm_config_report) {
        // 打包后模块大小分析
        config.plugins.push(
          new BundleAnalyzerPlugin(),
        );
      }
    }
  },
  // 生产环境下为了快速定位错误信息
  productionSourceMap: false,
  // 引入公共样式文件
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('src/assets/css/common.less'),
      ],
    },
  },
};
