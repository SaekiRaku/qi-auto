# Modules

## Built-in Modules

This page only shows the built-in modules list, please visit [Module](../modules) page for their details documentation.

* **webpack-entry** - Generate config for webpack entry property. [Doc→](../modules/webpack-entry.md)
* **export** - Generate code for import and export modules. [Doc→](../modules/export.md)

## Develop Modules

### Basic Sturcture

The most basic structure of a `qi-auto` module should export a function as default and with an `options` argument.

```javascript
// Use ES6（Recommend）

export default function(options){
    // ...
}

// Or use CommonJS:

exports.default = function (options) {
    // ...
}
```

Please noticed that **DO NOT** export the function directly when you are using CommonJS (`module.exports = function(){ ... }`). Cause `qi-auto` may use some symbol of exports for other purposes.

### Options

The `options` of function's argument is as same as the options from `qi-auto` config object. You should tell the user what you need for this module by documentation.

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

### Context

You can get all infomation or helper functions from `this` context. Here is the list of context that you can use.

#### this.directory

* Type: String

The root directory that provided by user.

#### this.files

* Type: Array

All files that inside the directory that provide by the user.

#### this.filtered

* Type: Array

All files of `this.files` that matched the `config.filter`.

#### this.filter(list, filter)

* Type: Function
* Return: Array

This function is doing the same as the behaviour of `this.filtered`. `list` means files array, and `filter` is a RegExp object.

### Return Result

You can return any type of result, just tell user what is those and how to do next.