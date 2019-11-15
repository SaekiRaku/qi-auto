# Qi Auto Webpack Entry

> Other languages / 其他语言:  
> [中文](./README.zh_CN.md)  

This is a built-in module for `@qiqi1996/qi-auto`.

## Installation

You don't need to install it, it's a built-in module for `@qiqi1996/qi-auto`.

## Usage

Assume you have a project that directory structure is like below:

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

Each `index.js` file inside the folder is an `entrypoint` for webpack, and most likely you'll need a polyfill for each `entrypoint` (such as `@babel/polyfill`) to be compatible with IE or other elder browsers. Normally, you have to write a config object like below:

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

Whenever your project have another new page you have to add a config to this object.

Now, let's see how `qi-auto-webpack-entry` deal with it:

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
    // Named a task
        directory: __dirname + "/src",
        // The directory that need traversing 
        filter: /\index.js$/,
        // Filter files
        module: "webpack-entry",
        // Choose a module to handle with these files
        // webpack-entry is a built-in module with qi-auto
        options: {
            // Options for webpack-entry
            name: "[folder]"
            // Use folder name where file's located as webpack `entry`'s key
            prechunks: ["@babel/polyfill"]
            // Need @babel/polyfill before entry point
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
    // result.WebpackEntry is as same as the config that you write by hand before. And this is totally automatic generated.
}
```

## Documation

### options.name

**> String | Function(filepath)**

The key for webpack's `entry`. Strings below will dynamically replace as whatever as their description.

* [folder] - folder's name where files located.  
* [name] - file's name.  
* [ext] - file's extension name.  

for example: if "qi-[folder]" apply to `about/index.js`, will get "qi-about" as returned.

if a function was provided, it'll be called with each file's absolute path input.

### options.prechunks

**> Array | Function(filepath)**

This array will `concat()` before each entry points, normally used for `@babel/polyfill`.

if a function was provided, it'll be called with each file's absolute path input, plese return an `Array`.

### options.afterchunks

**> Array | Function(filepath)**

This array will `concat()` after each entry points.

if a function was provided, it'll be called with each file's absolute path input, plese return an `Array`.