# Qi Auto Webpack Entry

> Other languages / 其他语言:  
> [中文](./README.zh_CN.md)  

这是一个 `@qiqi1996/qi-auto` 的内置模块。

## 安装

你不需要安装它，因为其已经内置在 `@qiqi1996/qi-auto` 中。

## 使用方法

假设你的项目有如下的目录结构：

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

每个目录下的 `index.js` 文件都是 `webpack` 的 `entrypoint`，而且你很有可能还需要前置 `@babel/polyfill` 来兼容 IE 或其他老旧浏览器。通常情况下，你不得不写一个类似下面的配置对象：

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

每当你的项目产生一个新页面时你都要向这个对象里添加一条配置。这是一个很烦人的工作。

现在我们看一看 `qi-auto` 是怎么做的：

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
    // 命名任务
    // Named a task
        directory: __dirname + "/src",
        // 需要遍历文件的目录
        // The directory that need traversing 
        filter: /\index.js$/,
        // 过滤文件
        // Filter files
        module: "webpack-entry",
        // 选择一个模块来处理这些文件
        // webpack-entry 是一个内置模块
        // Choose a module to handle with these files
        // webpack-entry is a built-in module with qi-auto
        options: {
            // 为 webpack-entry 设置
            name: "[folder]"
            // 使用文件所在的目录名作为 webpack entry 的键名
            prechunks: ["@babel/polyfill"]
            // 入口点前置引用 @babel/polyfill
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
    // result.WebpackEntry 和之前手写的配置完全一样。并且这个是完全自动生成的。
}
```

## 文档

### options.name

**> String | Function(filepath)**

webpack entry 的键名，下面的字符串会根据它们的描述动态替换：

* [folder] - 文件所在的目录名
* [name] - 文件名
* [ext] - 文件后缀名

例如："qi-[folder]" 应用到 `about/index.js` 上时，会得到 ”qi-about“。

如果提供了一个函数，则会将每个文件的绝对路径传入调用。

### options.prechunks

**> Array | Function(filepath)**

在 entry point 之前连接的数组内容，通常用于 `@babel/polyfill`。

如果提供了一个函数，则会将每个文件的绝对路径传入调用，请返回一个数组。

### options.afterchunks

**> Array | Function(filepath)**

在 entry point 之后连接的数组内容。

如果提供了一个函数，则会将每个文件的绝对路径传入调用，请返回一个数组。