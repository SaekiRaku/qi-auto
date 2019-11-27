# webpack-entry

## Summary

Generate the config of webpack entry for muti-page application.

This is a built-in module, so you don't need to install it. But it will move to a independent npm package in the future.

## Example

Assume you have a muti-page application which directory structure is like this:

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

Each index.js inside the folder represent an `entry point` of `webpack`, and you want to use folder's name as page's name(or webpack's entry points name). Also, you'd like to add a polyfill library before each entry points. Then you may config `qi-auto-webpack-entry` like this:

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
        directory: __dirname + "/src",
        filter: /\index.js$/,
        module: "webpack-entry",
        options: {
            name: "[folder]"
            // Use folder name where file's located as webpack `entry`'s key
            prechunks: ["@babel/polyfill"]
            // Add @babel/polyfill before entry points
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
}
```

At last, result.WebpackEntry will be like this:

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

## Options

### options.name

> String | Function(filepath)

The key for webpack's `entry`. Strings below will dynamically replace as whatever as their description.

* [folder] - folder's name where files located.  
* [name] - file's name.  
* [ext] - file's extension name.  

for example: if "qi-[folder]" apply to `about/index.js`, will get "qi-about" as returned.

if a function was provided, it'll be called with each file's absolute path input.

### options.prechunks

> Array | Function(filepath)

This array will `concat()` before each entry points, normally used for `@babel/polyfill`.

if a function was provided, it'll be called with each file's absolute path input, plese return an `Array`.

### options.afterchunks

> Array | Function(filepath)

This array will `concat()` after each entry points.

if a function was provided, it'll be called with each file's absolute path input, plese return an `Array`.

## Returns

Return a object that can pass to webpack entry directly.