# export

## 概述

自动生成模块的引入和导出文件

## 示例

假设您开发了一个库/模块，并且其目录结构如下：

```
./src
├── utils
│   ├── a.js
│   ├── b.js
│   ├── c.js
│   └── ...js
└── main
│   ├── a.js
│   ├── b.js
│   ├── c.js
│   └── ...js
│
└── and so many...
```

每个文件夹或js文件都是整个库/模块的一部分。通常，您必须在每个文件夹中放入 `入口文件（index.js）` 并导入和导出每个代码拆分的部分。以使其他人可以导入您的库/模块。幸运的是，`qi-auto-export` 可以自动完成这项工作：

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "AutoExport": {
        directory: __dirname + "/src",
        module: "export",
        options: {
            type: "esm",
            // 使用 ES6 模块语法生成代码（import and export default）
            // 或使用“ cjs”表示CommonJS语法（require and module.exports）
        }
    }
}

qiauto(config)["AutoExport"].watch();
// 这将检查文件是否更改，并自动重新生成。
```

最后，将在每个文件夹中生成 `入口文件（index.js）`。它们可能看起来像这样：

```javascript {1,15}
// ./src/utils/index.js
// QI-AUTO-EXPORT
import a from "./a.js";
import b from "./a.js";
import c from "./a.js";
...

export default {
    a,
    b,
    c,
    ...
}

// ./src/index.js
// QI-AUTO-EXPORT
import utils from "./utils/index.js";
import main from "./main/index.js";
...

export default {
    utils,
    main,
    ...
}
```

::: warning
`qi-auto-export` 不会覆盖第一行不是 "// QI-AUTO-EXPORT" 开头的文件。
:::

## 配置

### options.type

> 类型：String
> 可用值："esm" | "cjs"
> 默认值："esm"

指示应使用哪种语法生成。对于ES6模块语法，使用 `esm` 可以使用 `import` 和 `export default` 生成代码，对于CommonJS语法使用 `cjs` 可以使用 `require` 和 `module.exports` 生成代码。

### options.inject

> 可选的
> 类型：String | Function

该内容将在每个文件的 `import` 和 `export` 之间插入。

如果提供了一个函数，将传递一个参数并进行调用，该参数的结构如下所示：

```javascript
{
    directory: String,
    // 入口文件所在的目录路径
    imports: Array,
    // 所有被导入的数据
    // [ { importName: "...", importPath: "..." }, ... ]
    exports: Array
    // 所有被导出的数据
    // [ { exportName: "...", exportPath: "..." }, ... ]
}
```

请返回一个 `string` 类型。

### options.overwriteImport && options.overwriteExport

此内容将覆盖 `qi-auto-export` 的 `import` 或 `export` 的默认行为。

如果提供了一个函数，将传递一个参数并进行调用，其结构与 `options.inject` 段落中的结构相同。

## 返回值

您将获得一个具有以下属性的对象作为返回值。

### watch()

开始监测文件更改，并自动重新生成。

### stop()

停止监测。

### once()

仅生成一次 `入口文件（index.js）`。

### addDirectorys(dirs)

#### [Array] dirs - 要添加的目录数组

添加额外的需要自动生成 `入口文件（index.js）` 的目录。

### addEventListener(eventName, callback) && removeEventListener(eventName, callback)

#### [String] eventName - 事件名
#### [Array] callback - 回调函数

以下是 `eventName` 的允许值:

* done - 所有 `入口文件` 均已写入完毕。