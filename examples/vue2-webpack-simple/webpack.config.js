var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
  },
  devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin(),
  ]
}
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'PRODUCTION prerender-spa-plugin',
      template: 'index.html',
      filename: path.resolve(__dirname, 'dist/index.html')
    }),
    new PrerenderSPAPlugin({
      // 指定需要预渲染的文件路径
      staticDir: path.join(__dirname, 'dist'),
      // 指定需要预渲染的页面路由，为何关闭historyApiFallback也会渲染呢？
      // 这里的路由主要是express服务访问的地址，同时也是puppeteer渲染的路由
      routes: [ '/about', '/contact' ],

      renderer: new Renderer({
        inject: {
          foo: 'bar'
        },
        headless: true,
        renderAfterDocumentEvent: 'render-event'
      })
    })
  ])
} else {
  // NODE_ENV === 'development'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'DEVELOPMENT prerender-spa-plugin',
      template: 'index.html',
      filename: 'index.html'
    }),
    // new PrerenderSPAPlugin({
    //   // 指定需要预渲染的文件路径
    //   staticDir: path.join(__dirname, 'dist'),
    //   // 指定需要预渲染的页面路由，为何关闭historyApiFallback也会渲染呢？
    //   // 这里的路由主要是express服务访问的地址，同时也是puppeteer渲染的路由
    //   routes: [ '/', '/about', '/contact?aaa' ],

    //   renderer: new Renderer({
    //     inject: {
    //       foo: 'bar'
    //     },
    //     headless: true,
    //     renderAfterDocumentEvent: 'render-event'
    //   })
    // })
  ])
}