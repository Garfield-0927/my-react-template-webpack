## 代码规范 lint 配置



### 1. ESlint

安装依赖

```sh
npm i -D eslint babel-eslint eslint-loader eslint-plugin-jsx-control-statements
npm i -D eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin
```



编辑.eslintrc

```js
{
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true,
    "jsx-control-statements/jsx-control-statements": true // 能够在jsx中使用if，需要配合另外的babel插件使用
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended" // 需要另外配合babel插件使用
  ],
  "settings": {
    "react": {
      "version": "detect" // 自动读取已安装的react版本
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "jsx-control-statements"
  ]
}
```

编辑webpack.common.js

```js
module: {
  rules: [
    // 把这个配置放在所有loader之前
    {
      enforce: 'pre',
      test: /\.tsx?$/,
      exclude: /node_modules/,
      include: [APP_PATH],
      loader: 'eslint-loader',
      options: {
        emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
        emitError: true, // 这个配置需要打开，才能在控制台输出error信息
        fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
      }
    }
  ]
}
```



### 2. prettier

```sh
npm i -D prettier eslint-plugin-prettier eslint-config-prettier
```

配置.prettierrc

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false, 
  "singleQuote": true,
  "semi": true,
  "trailingComma": "none", 
  "bracketSpacing": true
}
```

修改.eslintrc

```json
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "jsx-control-statements", "prettier"]
```



### 3. lint staged 和 husky

```sh
npm i -D lint-staged
npm install husky -D
```

修改package.json

```json
"scripts": {
  "dev": "webpack-dev-server --config ./scripts/webpack.dev.js",
  "build": "webpack --config ./scripts/webpack.prod.js",
  "prepare": "husky install",
  "lint-staged": "lint-staged --allow-empty"
},
```

run :

```sh
npm run prepare
npx husky add .husky/pre-commit "npm run lint-staged"
```



### 4. style lint

