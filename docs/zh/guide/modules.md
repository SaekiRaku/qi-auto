# 模块

## 内置模块

此页面仅显示内置模块的列表，请访问 [模块](../modules) 页面以获取详细文档。

* **webpack-entry** - 为 webpack 的 entry 属性生成配置 [文档→](../modules/webpack-entry.md)
* **export** - 自动生成模块的引入和导出文件 [文档→](../modules/export.md)

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

### 返回结果

您可以返回任何类型的结果，只需告诉用户结果是什么以及下一步应该如何继续即可。