# 快速上手

## 安装

```
npm i --save-dev @qiqi1996/qi-auto
```

## 简单示例

> 该示例使用了内置模块 `webpack-entry`，您可以在[这里](../modules/webpack-entry.md)找到其文档。

让我们快速了解一下如何为多页应用程序生成 `webpack entry` 的配置吧。

假设您有一个目录结构如下的项目：

```
./src
├── about.js
├── download.js
├── index.js
└── ...(也许有 100 多个文件)
```

每个 js 文件都是webpack的 `entry point`。通常，您必须编写如下配置：

```javascript
module.exports = {
    entry: {
        about: "path/to/about.js",
        download: "path/to/download.js",
        index: "path/to/index.js",
        ...
    }
}
```

即使您的应用没有数百个页面，每当您的项目需要新增一个页面时，添加 `entry points` 仍然是一项蛋疼的工作。

现在，我们看一看 `qi-auto` 是怎么处理的：

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
    // 提供一个任务命名
        directory: __dirname + "/src",
        // 提供需要遍历的目录
        filter: /\.js$/,
        // 过滤文件
        module: "webpack-entry",
        // 选择一个模块来处理这些文件
        // `webpack-entry` 是一个内置模块，因此您无需安装它
        options: {
            // 该模块可配置的对象
            name: "[name]"
            // 使用文件名作为 webpack entry point 的键名
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
}
```

`result.WebpackEntry` 与您之前手工编写的 `webpack` 配置相同，并且这是完全自动生成的。

## 复杂示例

> 该示例使用了内置模块 `webpack-entry`，您可以在[这里](../modules/webpack-entry.md)找到其文档。

在大多数情况下，如果所有模块都位于同一文件夹中，会使项目很难维护。因此，让我们稍微整理一下目录结构。

```
./src
├── about
│   ├── a.js
│   ├── b.js
│   └── index.js
└── index
│   ├── c.js
│   └── index.js
│
└── and so many...
```

文件夹中的每个 `index.js` 文件都是 webpack 的 entry point，很可能您还需要为每个 entry point 使用 polyfill（例如：`@babel / polyfill`）以与 IE 及其他旧版浏览器兼容。通常，您必须编写如下的配置对象：

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

现在，我们看一看 `qi-auto` 是怎么处理的：

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
        directory: __dirname + "/src",
        filter: /\index.js$/,
        module: "webpack-entry",
        options: {
            name: "[folder]"
            // 使用目录名作为 webpack entry point 的键名
            prechunks: ["@babel/polyfill"]
            // 将 "@babel/polyfill" 插入到 entry point 之前
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
    // result.WebpackEntry 与您之前手工编写的 `webpack` 配置相同，并且这是完全自动生成的。
}
```