## 项目环境配置

### 0. 项目目录说明：

```wiki
|-- Tecent-Front-End-G1
    |-- .babelrc
    |-- .gitignore
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- webpack.config.js
    |-- docs
    |-- public
    |-- scripts
    |-- src
```

项目根目录下创建三个主要文件夹：

- `public`：用于存放项目的静态资源
- `scripts` ：用于存放 webpack 的配置文件
- `src` ：用于存放项目的代码文件



为了区分开 webpack的开发和生产环境，因此需要两套配置文件，这两套配置有很多地方是共通的，为了代码优雅，可以使用第三方包 `webpack-merge` 来将公共配置分别导入两套文件，因此需要在 `scripts` 目录下创建三个文件：

- `webpack.common.js`：用于编写公共配置
- `webpack.dev.js`：用于编写开发环境配置
- `webpack.prod.js`：用于编写生产环境配置
- `PATH.js`：目录变量









### 1. 安装webpack、webpack-cli

下载基本 webpack 配置所需第三方包：

> webpack：用于编译 JavaScript 模块
>
> webpack-cli：用于在命令行中运行 webpack
>
> webpack-dev-serve：可以在本地起一个 http 服务
>
> webpack-merge：用于合并webpack公共配置
>
> html-webpack-plugin：用于打包html文件

```json
// package.json
"devDependencies": {
  "html-webpack-plugin": "^5.5.0",
  "webpack": "^5.64.2",
  "webpack-cli": "^4.9.1",
  "webpack-dev-server": "^4.5.0",
  "webpack-merge": "^5.8.0"
},
```



添加html模板文件和webpack入口文件

![envconf1](D:\garfield\study\junior\Tecent-Front-End\3\Tencent-Front-End-G1\docs\assets\envconf1.png)



配置common模块：

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { PROJECT_PATH } = require('./PATH')

module.exports = {
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.js')
  },
  plugins: [
  	new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
    }),
  ]
}
```

配置dev模块：

```js
const {merge} = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const { PROJECT_PATH, SERVER_HOST, SERVER_PORT } = require('./PATH');

module.exports = merge(common, {
  mode: 'development',
  devtool:'cheap-module-source-map',
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    compress: true,               
    open: true,                   
    hot: true,         
  },
})
```

配置prod模块：

```js
const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')
const { PROJECT_PATH } = require('./PATH')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(PROJECT_PATH, './dist')
  },
})
```



### 2. 配置css

**css相关**

> style-loader：将 js 文件中引入的 css 代码插入到 html 模板文件，使网页可以正常展示样式
>
> mini-css-extract-plugin：和 style-loader 功能一样，只是打包后会单独生成 css 文件而非直接写在 html 文件中，用于生产环境，开发环境不需要另外生成文件使用 style-loader 即可
>
> css-loader：令 js 可以通过 import 或者 require 等命令导入 css 代码

```sh
npm install style-loader -D
npm install mini-css-extract-plugin -D
npm install css-loader -D
```

配置开发环境

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },
  ],
},
```

配置生产环境

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
  ],
}, 
plugins: [new MiniCssExtractPlugin()],
```



**兼容相关**

> postcss-loader：配合插件去转换css
>
> postcss-preset-env：将最新的 css 语法转换为目标环境的浏览器能够理解的语法

```sh
npm install postcss-loader -D
npm install postcss-preset-env -D
```

开发一般在chrome上开发，不会有太多的兼容问题，因此只需要在生产环境中配置即可。

```js
// webpack.prod.js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              [
                'postcss-preset-env',
              ],
            ],
          },
        },
      }],
    },
  ],
},
target: 'browserslist',
```

```json
// package.json
"browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
]
```

**预处理器less**

> `less`：为 less-loader 提供依赖
>
> `less-loader`：将 less 代码转换为 css 代码

```sh
npm install less -D
npm install less-loader -D
```

```js
// 将test中的 .css 改成 .less 即可
module: {
  rules: [
    {
      test: /\.less$/i,
      use: ['style-loader', 'css-loader', 'less-loader',
      ],
    },
  ],
},
```





### 3. 配置babel

> babel-loader：用于处理 ES6+ 语法，将其编译为浏览器可以执行的 js
>
> @babel/core：babel 所需依赖
>
> @babel/preset-env：是一组ES6转译的plugins，会根据设置的目标浏览器环境（browserslist），选择该环境不支持的新特性进行转译，这样就减少了不必要转译，增快打包速度
>
> @babel/plugin-transform-runtime：提供 ES6+ 的 api，如 es6 新的数组方法等
>
> @babel/runtime-corejs3：相当于 @babel/polyfill 的功能

```sh
npm install babel-loader -D
npm install @babel/core -D
npm install @babel/preset-env -D
npm install @babel/plugin-transform-runtime -D
npm install @babel/runtime-corejs3 -D
```

编辑.babelrc

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```

编辑webpack.common.js

```js
rules: [
  {
    test: /\.(tsx?|js)$/,
    loader: 'babel-loader',
    options: { cacheDirectory: true },
    exclude: /node_modules/,
  },
]
```

> cacheDirectory：babel-loader 在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积大冗余，同时也会减慢编译效率，所以开启该配置将这些公共文件缓存起来，下次编译就会加快很多
>
> exclude：第三方包不需要进行转译，排除后可加快打包速度



### 3. html-webpack-plugin

`html-webpack-plugin` 的作用是：当使用 `webpack`打包时，创建一个 `html` 文件，并把 `webpack` 打包后的静态文件自动插入到这个 `html` 文件当中。

```sh
npm install html-webpack-plugin --save-dev
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
plugins:[
  new HtmlWebpackPlugin()
],
```



### 4. react 配置

> react：react核心依赖
>
> react-dom：负责处理web端的dom的渲染
>
> @types/react ：react 类型声明文件，用于 tsx
>
> @types/react-dom：react-dom 类型声明文件，用于 tsx
>
> @babel/preset-react ：用于让 babel 可以转译 jsx 语法

```sh
npm install @types/react -D
npm install @types/react-dom -D
npm install @babel/preset-react -D
```

配置.babelrc

```json
"presets": [
  [
    "@babel/preset-env",
    {
      "modules": false
    }
  ],
  "@babel/preset-react"
],
```





### 5. TS配置

> `typescript`：支持 ts
>
> `@babel/preset-typescript`：处理ts文件，原理是去掉ts的类型声明，然后再用其他 babel 插件进行编译

```sh
npm install typescript -D
npm install @babel/preset-typescript -D
```

编辑.babelrc

```json
"presets": [
  [
    "@babel/preset-env",
    {
      "modules": false
    }
  ],
  "@babel/preset-react",
  "@babel/preset-typescript"
],
```

运行 `npx tsc --init` 生成tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  
  "include": ["./src"],
  "exclude": ["./node_modules"]
}
```



打包类型检查

目前 webpack 打包时不会有类型检查信息（为了编译速度，babel 编译 ts 时直接将类型去除，并不会对 ts 的类型做检查），即使类型不正确终端也会显示打包成功，有误导性，为此添加上打包类型检查，下载第三方包：

> fork-ts-checker-webpack-plugin：ts 类型检查，让终端可以显示类型错误



入口更改：

```js
entry: path.resolve(PROJECT_PATH, './src/index.tsx'),
```





### 6. 优化

配置别名

```js
// webpack.common.js
resolve: {
  alias: {
    '@': path.resolve(PROJECT_PATH, './src'),
    '@comp': path.resolve(PROJECT_PATH, './src/components'),
    '@utils': path.resolve(PROJECT_PATH, './src/utils'),
    '@view': path.resolve(PROJECT_PATH, './src/view'),
    '@router': path.resolve(PROJECT_PATH, './src/router'),
    '@store': path.resolve(PROJECT_PATH, './src/store'),
  }
},
    
// tscongif.json
"baseUrl": "./",                          // 根路径
"paths": {								  // 路径映射，与 baseUrl 关联
  "@*": ["src/*"],
  "@comp*": ["src/components/*"],
  "@utils*": ["src/utils/*"]
},
```

配置文件后缀名

```json
resolve: {
  extensions: ['.tsx', '.ts', '.js', '.json'],
}
```

