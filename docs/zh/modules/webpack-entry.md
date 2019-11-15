# webpack-entry

## 概述

为 webpack 的 entry 属性生成配置。

## 示例

假设您有一个多页应用程序，其目录结构如下所示：

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

文件夹内的每个 index.js 都表示一个 webpack 的 entry point，并且您想使用文件夹名作为页面的名称（或 webpack 的 entry point 键名）。另外，您还想在每个 entry point 之前添加一个 polyfill 库。然后您可以像这样配置 `qi-auto-webpack-entry`：

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
        directory: __dirname + "/src",
        filter: /\index.js$/,
        module: "webpack-entry",
        options: {
            name: "[folder]"
            // 将文件所在位置的文件夹名作为 webpack entry 的键名
            prechunks: ["@babel/polyfill"]
            // 在 entry points 之前添加 @babel/polyfill 库
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
}
```

最后，result.WebpackEntry 将如下所示：

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

## 配置

### options.name

> String | Function(filepath)

webpack entry 的键名，一些特殊字符串将根据下面的描述动态替换。

* [folder] - 文件所在的文件夹的名称。
* [name] - 文件名称
* [ext] - 文件后缀名

例如：如果将 `qi-[folder]` 应用于 `about/index.js` 文件，则会返回 `qi-about`。

如果提供了函数，则将把每个文件的绝对路径传入该函数。

### options.prechunks

> Array | Function(filepath)

这个数组将在每个 entry point 之前 `concat()`，通常用于 `@babel/polyfill`。

如果提供了函数，则将把每个文件的绝对路径传入该函数，请返回一个“数组”。

### options.afterchunks

> Array | Function(filepath)

这个数组将在每个 entry point 之后 `concat()`。

如果提供了函数，则将把每个文件的绝对路径传入该函数，请返回一个“数组”。

## 返回值

返回一个可以直接传递到 webpack entry 的对象。