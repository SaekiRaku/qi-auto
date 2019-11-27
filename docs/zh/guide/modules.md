# 模块

## 官方模块

此页面仅显示官方模块的列表，请访问各个模块的主页以获取详细文档。

* **qi-auto-webpack-entry** - 为 webpack 的 entry 属性生成配置 [文档→](../modules/webpack-entry.md)
* **qi-auto-export** - 自动生成模块的引入和导出文件 [文档→](../modules/export.md)
* **qi-auto-rollup** - 为 Rollup 自动生成配置项 [文档→](https://github.com/SaekiRaku/qi-auto-rollup)

## 开发模块

### 基本结构

`qi-auto` 模块最基本的结构应该导出一个带有 options 参数的函数。

```javascript
// 使用 ES6（推荐）：

export default function(options){
    // ...
}

// 或者使用 CommonJS：

exports.default = function (options) {
    // ...
}
```

请注意，当您使用 CommonJS 时，**不要** 直接导出函数(`module.exports = function(){ ... }`)。因为 `qi-auto` 也许会使用一些方法名用作其他目的。

### 选项设置

函数参数的 `options` 与 `qi-auto` 配置对象的 `options` 相同。您应该通过文档告诉用户该模块需要什么。

```javascript
const config = {
    "WebpackEntry": {
        ...
        options: {
            ...
        }
    }
}
```

### 上下文环境

您可以从 `this` 上下文中获取所有信息或工具函数，以下是您可以使用的上下文列表：

#### this.directory

* Type: String

用户提供的根目录。

#### this.files

* 类型：Array

用户提供的目录内的所有文件。

#### this.filtered

* 类型：Array

匹配 `config.filter` 的所有文件。

#### this.filter(list, filter)

* 类型：Function
* 返回值：Array

该函数的行为与 `this.filtered` 的行为相同。`list` 表示文件数组，`filter` 是RegExp对象。

#### this.events <Badge text="新增" />

> v1.2.0 版本新增


* 类型：Object

该对象包含2个函数，分别是 `register` 和 `dispatch`。将事件名称（字符串类型）和回调函数传递给 `register` 并调用以注册事件。要使用这些回调，应将事件名称和你需要的任何参数传给 `dispatch` 并调用。

### 调度事件

大多数情况下，用户希望在处理模块时了解其进度。您应该使用 `this.events.dispatch()` 来告知用户。

当用户有 `callback` 传入任务配置时，`qi-auto` 将使用事件名称 `default` 来注册这些回调。因此，您可以通过调用 `this.events.dispatch("default", args)` 来通知人们何时出现问题或一切正常。`args` 的结构由您定义，请确保在您的文档中清楚地描述它。

### 返回结果

您可以返回任何类型的结果，只需告诉用户结果是什么以及下一步应该如何继续即可。