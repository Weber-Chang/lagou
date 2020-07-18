# 简答题

1. ##### Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

   首先是配置入口文件Entry，类型可以是string, array, object，相对路径前面必须加./

   还有mode配置相应的打包环境

   其次配置输出文件

   ```javascript
   output：{
   
   	path: __dirname + '/pubilc',
   
   	filename: '/js/[name].js',//编译生成的js文件存放到根目录下面的js目录下面
   
   	chunkFilename:'js/[chunkhash:8].chunk.js' //  配置无入口的 Chunk 在输出时的文件名称
   
   }
   ```

   然后是配置module

   ```javascript
   module: {
     rules: [
       {
         test: /\.js$/,
         use: ['babel-loader'],
         parser: {
         amd: false, // 禁用 AMD
         commonjs: false, // 禁用 CommonJS
         system: false, // 禁用 SystemJS
         harmony: false, // 禁用 ES6 import/export
         requireInclude: false, // 禁用 require.include
         requireEnsure: false, // 禁用 require.ensure
         requireContext: false, // 禁用 require.context
         browserify: false, // 禁用 browserify
         requireJs: false, // 禁用 requirejs
         }
       },
     ]
   }
   ```

   最后是配置Plugin

   ```javascript
   new MyPlugin() // 根据插件的不同，配置方式也不同
   ```

   

2. ##### Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

   Loader：用于对模块源码的转换，loader可以让webpack懂得如何转换非javascript模块，并且在buld中引入这些依赖。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或者将内联图像转换为data URL。

   Plugin：可以解决loader无法实现的其他事，从打包优化和压缩，到重新定义环境变量等各种各样的任务，可以用到webpack的钩子。

   开发Loader：

   ```javascript
    // 输入参数source是加载的资源文件的内容，输出是此次加工后的结果（需是Javascript代码）
   module.exports = source => {
     const content = source + '12333211234567'
     return `export default ${content}`
   }
   ```

   开发Plugin：

   ```javascript
   class MyPlugin {
     apply (compiler) { // webpack工作启动时自动调用apply方法，compiler包含了所有的配置信息
       // 通过hooks属性访问到emit钩子,这个钩子接收两个参数，第一个是插件的名称，第二个是挂载到钩子上的函数
       compiler.hooks.emit.tap('MyPlugin', compilation => {
         // compilation可以理解为此次打包的上下文，assets属性获取即将写入目录当中的资源文件信息，是个对象，键名是每个文件的名称
         for (const name in compilation.assets) {
           if (name.endsWith('.js')) {
             const contents = compilation.assets[name].source()
             const withoutComments = content.replace(/\/\*+\*\//g, '')
             compilation.asstes[name] = {
               source: () => withoutComments,
               size: () => withoutComments.length
             }
           }
         }
       })
     }
   }
   ```

   

# 编程题

1. ##### 使用 Webpack 实现 Vue 项目打包任务

   答：

   相关代码存放至code中，这里进行说明，看了项目结构后，发现webpack有三个配置文件，那么首先就是改动package.json的命令，如下：

   ```json
   "scripts": {
       "serve": "webpack-dev-server --config webpack.dev.js", // 开发模式走dev.js的配置文件
       "start": "yarn serve", // 这边为了符合平时开发习惯加多了一条用于yarn start
       "build": "webpack --config webpack.prod.js", // 生产自然是走生产配置文件prod.js了
       "lint": "eslint --ext js,vue src" // lint检测js、vue这两个后缀的文件
    }
   ```

   下一步就是开始配置三个文件，首先是从webpack.common.js开始

   ```javascript
   const path = require('path')  // 这个是node环境下自带的文件路径操作模块
   const webpack = require('webpack')
   const { VueLoaderPlugin } = require('vue-loader') // vue项目打包必备的一个插件
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   module.exports = {
     entry: path.join(__dirname, 'src/main.js'), // 设置入口文件，vue项目中默认根目录src内的main.js
     output: {
       filename: 'bundle.js', // 输出文件名
       path: path.join(__dirname, 'dist'), // 输出文件目录为根目录下的dist文件夹内
     },
     resolve: { // 用于告诉webpack如何寻找模块所对应的文件等
       alias: { // 配置项通过别名来把原导入路径映射成一个新的导入路径
         components: './src/components/'
       },
       extensions: ['.js', '.json', '.css', '.vue'], // 在导入文件没有带后缀时，设置可以忽略的文件名后缀
     },
     module: { // 该处设置loader，每一个对应类型的文件都有个对应的loader去转换编译
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader',
         },
         {
           test: /\.js$/,
           loader: 'babel-loader',
           exclude: /node_modules/,
         },
         {
           test: /\.css$/,
           use: ['vue-style-loader', 'css-loader'],
         },
         {
           test: /\.less$/,
           use: ['style-loader', 'css-loader', 'less-loader'],
         },
         {
           test: /.png$/,
           use: {
             loader: 'url-loader',
             options: {
               limit: 10 * 1024,
               esModule: false,
             },
           },
         },
       ],
     },
     plugins: [
       new VueLoaderPlugin(),
       new HtmlWebpackPlugin({
         title: 'Yue-Webpack', // index.html的标题名
         template: './public/index.html', // 采用的html模板的路径
         filename: 'index.html', // 输出的HTML文件名
       }),
       new webpack.DefinePlugin({ // 这个是用来配置全局变量
         URL: '"http://127.0.0.1:5000"'
       }),
     ],
   }
   ```

   

   本着先有开发后有生产的，我接下来就先配置webpack.dev.js，当然，前提是得桩一个webpack-dev-server

   ```javascript
   const path = require('path')
   const common = require('./webpack.common')
   const merge = require('webpack-merge')
   
   module.exports = merge(common, {
     mode: 'development',
     devServer: {
       open: false, // 我并不喜欢自动打开浏览器，因为我的默认浏览器是safari，调试不是很方便，一般用谷歌
       contentBase: path.join(__dirname, 'public'),
       port: 5000, //  开发服务器的端口
       hot: true, // 开启热更新
     },
     optimization: {
       usedExports: true, // 能够去除未使用的导出内容,开发模式下要手动开启
       minimize: true, // 在开发模式下，默认js压缩是关闭的，所以我要手动打开
     },
     devtool: 'eval-cheap-module-source-map' // 配置sourcemap，用于开发模式下快速定位错误
   })
   ```

   接下来是webpack.prod.js 生产模式打包文件

   ```javascript
   const path = require('path')
   const merge = require('webpack-merge')
   const { CleanWebpackPlugin } = require('clean-webpack-plugin')
   const CopyWebpackPlugin = require('copy-webpack-plugin')
   const common = require('./webpack.common')
   
   module.exports = merge(common, {
     mode: 'production',
     output: {
       filename: '[name]-[contenthash:8].bundle.js', // 采用哈希值生成文件
       path: path.join(__dirname, 'dist'),
     },
     devtool: 'none', // 为防止暴露源代码，生产模式不使用sourcemap
     plugins: [
       new CleanWebpackPlugin(), // 清除上次打包的旧文件
       new CopyWebpackPlugin({ // 用于拷贝public的静态文件
         patterns: ['public'],
       }),
     ],
   })
   
   ```

   





