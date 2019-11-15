# Quick Start

## Installation

```
npm i --save-dev @qiqi1996/qi-auto
```

## Simple Example

> This example has used a built-in module `webpack-entry`, you can find it's documentation at [here](../modules/webpack-entry.md)

Let's have a quick look on how to generate a `webpack`'s `entry` config of multipage application.

Assume you have a project that directory structure is like below:

```
./src
├── about.js
├── download.js
├── index.js
└── ...(maybe more than 100 files)
```

Each js file is an `entry point` for webpack. Normally, you have to write a config object like this:

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

Even if your application doesn't have hundreds of pages, it's still an annoying job to add `entry point` whenever your project gets another new page.

Now, let's see how `qi-auto` deal with it:

```javascript
const qiauto = require("@qiqi1996/qi-auto");

const config = {
    "WebpackEntry": {
    // Named a task
        directory: __dirname + "/src",
        // The directory that need traversing 
        filter: /\.js$/,
        // Filter files
        module: "webpack-entry",
        // Choose a module to handle with these files
        // webpack-entry is a built-in module, so you don't need to install it
        options: {
            // Options for webpack-entry
            name: "[name]"
            // Use file's name as webpack `entry`'s key
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
}
```

`result.WebpackEntry` is as same as the config that you write by hand before. And this is totally automatic generated.

## Complicated Example
> This example has used a built-in module `webpack-entry`, you can find it's documentation at [here](../modules/webpack-entry.md)

Most of the time, it's very difficult to maintain the project if all modules are inside the same folder. So let's organize our `entry points` by putting them and their relation modules inside a named folder.

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

Each `index.js` file inside the folder is an `entry point` for webpack, and most likely you'll need a polyfill for each `entry point` (such as `@babel/polyfill`) to be compatible with IE or other elder browsers. Normally, you have to write a config object like this:

```javascript
module.exports = {
    entry: {
        about: ["@babel/polyfill", "path/to/about/index.js"],
        index: ["@babel/polyfill", "path/to/index/index.js"],
        ...
    }
}
```

Now, let's see how `qi-auto-webpack-entry` deal with it:

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
            // Need @babel/polyfill before entry points
        }
    }
}

const result = qiauto(config);

module.exports = {
    entry: result.WebpackEntry
    // result.WebpackEntry is as same as the config that you write by hand before. And this is totally automatic generated.
}
```