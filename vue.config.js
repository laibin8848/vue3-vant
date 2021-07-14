'use strict'
const path = require('path')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '预约系统' // page title

const port = process.env.VUE_APP_PORT || 8080

console.log('env ' + process.env.NODE_ENV + ' ==>')
console.log('port ' + port + ' ==>')

module.exports = {
  publicPath: process.env.NODE_ENV !== 'development' ? '/invite/' : './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: port,
    proxy: {
        '/gateway': {
            target: 'http://10.16.153.243:31003',
            pathRewrite: {'^/gateway' : ''},
            changeOrigin: true
        }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    const svgLoader = config.module.rule('svg')
      svgLoader.uses.clear()

    //images to base64 when size < 1024 * 10
    const urlLoader = config.module.rule('images').test(/\.(png|jpg|gif|svg)(\?.*)?$/)
      urlLoader.uses.clear()

    urlLoader.use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10240
      })

    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config.plugin('html').tap(() => [
            {
              title: name,
              vconsole: 'https://unpkg.com/vconsole/dist/vconsole.min.js',
              filename: 'index.html',
              template: __dirname + '/public/index.html',
              BASE_URL: 'https://xxx'
            }
          ])
          config.plugin('html_pc').use('html-webpack-plugin', [{
            title: name,
            BASE_URL: 'https://xxx',
            filename: 'pc.html',
            template: __dirname + '/public/pc.html',
            inject: false
          }])
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html_pc')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )

      //do analyzer
      if(process.env.VUE_APP_ANALYZER === 'true') {
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
      }
  }
}