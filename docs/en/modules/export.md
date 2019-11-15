# export

## Summary

Generate import and export code.

## Example

Assume you developed a library/module which has a directory structure like this:

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

Each folder or js file is a part of your whole library/module. Normally, you had to write `entry file (index.js)` inside each folder to `import` and `export` every little part so that others can import your library/module. Fortunately, `qi-auto-export` can do that automatic:

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "AutoExport": {
        directory: __dirname + "/src",
        module: "export",
        options: {
            type: "esm",
            // Use ES6 Module syntax to generate code (import and export default)
            // Or "cjs" for CommonJS syntax (require and module.exports)
        }
    }
}

qiauto(config)["AutoExport"].watch();
// This will inspect for files change, and auto regenerate.
```

At last, `entry file (index.js)` will be generated inside each folder. And they may look like this:

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
`qi-auto-export` will not overwrite files without "// QI-AUTO-EXPORT" at first line.
:::

## Options

### options.type

> Type: String
> Available: "esm" | "cjs"
> Default: "esm"

Indicate what syntax should be used for generating. Use `esm` for ES6 Module syntax to generate code with `import` and `export default` or use "cjs" for CommonJS syntax to generate code with `require` and `module.exports`.

### options.inject

> Optional
> Type: String | Function

This content will inject between `import` and `export` of each file.

If a function was provided, it will be called with one argument pass in which structure is like this:

```javascript
{
    directory: String,
    // The directory of entry file.
    imports: Array,
    // All imports data
    // [ { importName: "...", importPath: "..." }, ... ]
    exports: Array
    // All exports data
    // [ { exportName: "...", exportPath: "..." }, ... ]
}
```

Please return the type of `string`.

### options.overwriteImport && options.overwriteExport

This content will overwrite the `import` or `export` of `qi-auto-export`'s default behaviour.

If a function was provided, it will be called with one argument pass in which structure is the same as before in the paragraphs of `options.inject`.

## Returns

You will get an object with the property of below as returned.

### watch()

Start to inspect files changes, and auto regenerate.

### stop()

Stop inspect.

### once()

Only generate once of `entry file (index.js)`.

### addDirectorys(dirs)

#### [Array] dirs - the array of directorys

Add extra directories that you want to make it auto-generate `entry file (index.js)`.

### addEventListener(eventName, callback) && removeEventListener(eventName, callback)

#### [String] eventName - The event name.
#### [Array] callback - The callback function.

Here is the list of available values of `eventName`:

* done - All entry files were writen.