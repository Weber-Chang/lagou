## 2020.06.01 - 2020.07.07

### AMD规范

```
define('module', ['jquery', './module2.js'], function($, module2) { // 第一个是模块名，第二个是依赖对象，返回一个对象
    return {
    test() {
        console.log('test')
    }
  }
})
```

### CMD规范

```
define(function(require, exports, module) {
    var $ = require('jquery')
  module.exports = function() {
    console.log('123')
    $('body').append('<p>module123</p>')
  }
})
```

### CommonJS模块

属于node环境内置的

- 所有代码都运行在模块作用域，不会污染全局作用域。每个模块都有单独的作用域
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 一个文件即是一个模块
- 模块加载的顺序，按照其在代码中出现的顺序。
- 通过module.exports导出成员
- 通过require函数载入模块

### ES Modules

可以通过给script添加type = module的属性，就可以以ES Module的标准执行其中的JS代码

```
<script type='module'>console.log('this is adobe')</script>
跟普通JS的区别是
1. 自动使用严格模式，从而省略use strict
2. 每个ES Module都是运行在单独的私有作用域中
<script type='module'>
var test = 111
console.log(test) // 111
</script>
<script type='module'>
console.log(test) // 报错
</script>
3. ESM 是通过 CORS 的方式请求外部JS模块
4. ESM的script标签会在网页渲染完成后再执行内部的js代码，不同模块的执行顺序跟引入顺序可能不一样
```

### 浏览器端遵循ES Modules规范，node环境下遵循CommonJS规范

### webpack mode属性

值：production、development、none

webpack中所有值都可以没有，但是mode的值是必须的，如果不填，默认会是production，同时会像你抛出一条警告

- none

设置该值时，webpack4将取消所有预设值，做最原始的打包，不做额外的处理，需要从无到有进行配置

- development

webpack --mode developement

开发模式，代表需要对开发友好，会加快打包速度，还增加调试的方便性，没有进行压缩和混淆，做了以下插件做的事情

```
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- plugins: [
-   new webpack.NamedModulesPlugin(), // 用于设置模块姓名，使每个模块拥有独一无二的key
-   new webpack.NamedChunksPlugin(), // 给配置的每个chunks命名
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

- production

webpack --mode production

生产模式，对代码进行了优化，所预设的插件如下

```
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */), // 混淆和压缩
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(), // 由 webpack 直接处理的 ES6 模块
-    new webpack.NoEmitOnErrorsPlugin() // 用于防止程序报错，就算有错误也得继续编译
-  ]
}
```

### IE8兼容性识别标识X-UA-Compatible

X-UA-Compatible 是针对 IE8 版本的一个特殊文件头标记，用于为 IE8 指定不同的页面渲染模式

```
<meta http-equiv="X-UA-Compatible" content="IE=5" />
```

像是使用了 Windows Internet Explorer 7 的 Quirks 模式，这与 Windows Internet Explorer 5 显示内容的方式很相似。

```
<meta http-equiv="X-UA-Compatible" content="IE=7" />
```

无论页面是否包含 <!DOCTYPE> 指令，均使用 Windows Internet Explorer 7 的标准渲染模式。

```
<meta http-equiv="X-UA-Compatible" content="IE=8" />
```


开启 IE8 的标准渲染模式，但由于本身 X-UA-Compatible 文件头仅支持 IE8 以上版本，因此等同于冗余代码。

```
<meta http-equiv="X-UA-Compatible" content="edge" />
```

Edge 模式通知 Windows Internet Explorer 以最高级别的可用模式显示内容，这实际上破坏了“锁定”模式。即如果你有IE9的话说明你有IE789，那么就调用高版本的那个也就是IE9。

```
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
```

如果IE有安装Google Chrome Frame，那么就走安装的组件，如果没有就和<meta http-equiv="X-UA-Compatible" content="edge" />一样。

说明：针对IE 6，7，8等版本的浏览器插件Google Chrome Frame，可以让用户的浏览器外观依然是IE的菜单和界面，但用户在浏览网页时，实际上使用的是Google Chrome浏览器内核。

```
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
```

EmulateIE7 模式通知 Windows Internet Explorer 使用 <!DOCTYPE> 指令确定如何呈现内容。标准模式指令以Windows Internet Explorer 7 标准模式显示，而 Quirks 模式指令以 IE5 模式显示。与 IE7 模式不同，EmulateIE7 模式遵循 <!DOCTYPE> 指令。对于多数网站来说，它是首选的兼容性模式。

### webpack4零配置默认打包入口

src/index.js => dist/main.js

如需配置则新建webpack.config.js文件，该文件运行在node环境下，需以CommonJS方式去编写

### webpack entry属性

用于设置打包入口文件路径，其中相对路径的时候./不能省略

```
module.exports = {
  entry: './src/main.js'
}
```

### webpack output属性

设置打包后的路径和文件夹

```
const path = require('path')
module.exports = {
    output: {
    pathname: 'bundle.js', // 打包后输入的文件名
    path: path.join(__dirname, 'output'), // 必须绝对路径，借助node环境的path模块，设置打包的路径文件夹
    publicPath: 'dist/' // 用于告诉webpack打包后网站的根目录，默认是空字符串，这里的斜线不能省略，在打包后的主文件中为__webpack_require__.p变量的值
  }
}
```

webpack module属性

rules内每一个元素必须有两个属性，一个是test，一个是use

此外，除了安装了css-loader外，还需要装style-loader，因为css-loader打包后是将样式push到元素上，所以还需要style-loader来解析，如果use内配置了多个loader，那么执行顺序是从后往前

```
module.exports = {
    module: {
    rules: [
        {
        test: /.js$/,
        use: {
          loader: 'babel-loader', // 用于编译ES6的代码，由于babel-loader依赖babel的代码，所以安装时还要加装@babel/core、@babel/preset-env
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
        {
        test: /.css$/, // 是一个正则表达式，用于打包过程中匹配到的文件路径
        use: ['css-loader', 'style-loader'] // 用于匹配到的文件所需要用到的loader
      },
      {
        test: /.png$/,
        use: 'file-loader' // 不止可以使用名称，也可以使用路径
      },
      {
        test: /.png$/,
        use: { // 如果是用url-loader，就会转为base64展示，小文件用url-loader以减少请求次数
            loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB，小于10KB才会用该loader打包，超过的会用file-loader去打包，使用该方式时，必须安装file-loader
          }
        } 
      },
      {
        test: /.html$/,
        use: {
            loader: 'html-loader',
          options: {
            attrs: ['img:src', 'a:href'], // 让html-loader能解析多个标签属性上的图片等，这是老版本的写法
            attributes: { // 这是新版本写法
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                },
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src',
                  // filter: (tag, attribute, attributes): boolean => {}
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

### webpack加载器分类

编译转换类：将资源模块转换为js可用的代码

文件操作类：将资源模块拷贝到输出的目录，同时将文件的访问路径向外导出

代码检查类：统一代码风格



### webpack常用插件

- clean-webpack-plugin：清除dist目录遗留的不需要的文件

```
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  plugin: [
    new CleanWebpackPlugin()
  ]
}
```

- html-webpack-plugin：输出index.html到dist目录，不需要去调外面的

```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // publicPath: 'dist/' 删除改配置后，打包后的index.html路径才正确
  },
  plugin: [
    new HtmlWebpackPlugin({
        title: 'webpack sample', // html标题
      meta: { // 设置meta标签
        viewport: 'width=device-width'
      },
      template: './src/index.html' // 模板文件 <% htmlWebpackPlugin.options.title %>
    }),
    // 用于生成额外的html文件
    new HtmlWebpackPlugin({
        filename: 'about.html'
    }),
  ]
}
```

- copy-webpack-plugin：静态文件复制

```
const CopyWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugin: [
    new CopyWebpackPlugin([
        'public' // 说明打包时将public目录的所有文件复制到dist
    ])
  ]
}
```

### sourcemap的作用和使用方法 

Source Map解决了源代码与运行代码不一致所产生的问题，方便进行调试

方便在浏览器中调试打包前的源代码

- sourcemap各种模式的术语

eval- 是否使用eval执行代码模块

cheap- Source map是否包含行信息

module-是否能够得到Loader处理之前的源代码

inline- SourceMap  不是物理文件，而是以URL形式嵌入到代码中

hidden- 看不到SourceMap文件，但确实是生成了该文件

nosources- 没有源代码，但是有行列信息。为了在生产模式下保护源代码不被暴露

### webpack HMR热更新

是指程序运行过程中，单独替换被更新的代码，其他代码和程序运行状态不受影响

运行webpack-dev-server --hot启动热更新，也可以通过配置文件开启.

HMR并不是对所有文件都可以直接使用，js文件需要手动书写模块热替换规则

### webpack其他设置

- DefinePlugin

创建一个全局变量，如下代码，所有文件的js里都能拿到变量process.env.VUE_APP_BASE_URL

```
const webpack = require('webpack')

plugins: [
  new webpack.DefinePlugin({
    VUE_APP_BASE_URL: JSON.stringify('http://api.example.com/') // 也可以是'"http://api.example.com/"'
  })
]
```

- optimization

```
optimization: {
  usedExports: true, // 可以删除代码中未引用的代码，生产模式下自动开启。开发模式需做手动配置
  minimize: true, // 压缩JS代码
  concatenateModules: true, // 可以让代码体积更小，bundle中函数声明更少
  sideEffects: true, // 开启后没有用到的模块不会被打包，即副作用
  minimizer: [ // css压缩，生产模式下自动压缩，开发模式要配置
    new TerseWebpackPlugin(), // 指定了minimizer说明要自定义压缩器，所以要把JS的压缩器指明，否则无法压缩
    new OptimizeCssAssetWebpackPlugin()
  ]
}
```

可以在package.json中设置忽略掉有副作用的代码

```
"sizeEffects": [
  "./src/utils.js",
  "./src/less/main.less"
]
```



### webpack代码分割

代码不分割的话，目前webpack打包后的bundle文件会很大，造成程序启动慢。并不是所有的模块在启动的时候都是必须加载的。其次，也不能分的太小，会造成请求次数过多

目前的webpack分包方式有两种：

- 多入口打包

即多页应用程序

```
entry: {
  index: './src/index.js',
  cart: './src/cart.js'
},
output: {
  filename: '[name].bundle.js'
},
// 每个打包入口形成一个独立的chunk
plugins: [
    new HtmlWebpackPlugin({
      title: '1',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: '2',
      template: './src/cart.html',
      filename: 'cart.html',
      chunks: ['cart']
    })
  ],
// 提取公共模块：
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

- 动态导入

```
import(/* webpackChunkName: 'posts' */'./post/posts').then({default: posts}) => {
  mainElement.appendChild(posts())
}
```

### Hash文件名

```
output: {
  filename: '[name]-[hash].bundle.js'
  filename: '[name]-[chunkhash].bundle.js'
  filename: '[name]-[contenthash:8].bundle.js' // 8是长度
},
```

### ESlint配置文件

```
module.exports = {
  env: {
    // 运行的环境，决定了有哪些默认全局变量
    browser: true,
    es2020: true
  },
  // eslint 继承的公共配置
  extends: [
    'standard' // Airbnb、Google
  ],
  // 设置语法解析器，控制是否允许使用某个版本的语法
  parserOptions: {
    ecmaVersion: 11
  },
  // 控制某个校验规则的开启和关闭
  rules: {
    'no-alert': 'error'
  },
  // 添加自定义的全局变量
  globals: {
    "$": 'readonly', 
  }
}

// 也可以直接写在代码的注释里
const str = "${name} is coder" // eslint-disable-line no-template-curly-in-string
console.log(str)

// 同样也可以通过eslint-loader跟webpack结合，这就需要使用.eslintrc.js配置文件
```

### ESlint和Git Hooks

在已有了eslint的Git项目中，安装husky，实现在Git commit的时候，进行lint，也就是平时所说的提交钩子

package.json设置

```
{
  "devDependencies": {
    "husky": "^4.2.5"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn test"
    }
  },
  "lint-staged": { // 这样可以对代码进行格式化
    "*.js": [
      "eslint",
      "git add"
    ]
  }
}
```