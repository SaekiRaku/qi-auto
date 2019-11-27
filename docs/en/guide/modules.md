# Modules

## Official Modules

This page only shows the official modules list, please visit each modules homepage for their details documents.

* **qi-auto-webpack-entry <Badge text="Built-in"/>** - Generate config for webpack entry property. [Doc→](../modules/webpack-entry.md)
* **qi-auto-export <Badge text="Built-in"/>** - Generate code for import and export modules. [Doc→](../modules/export.md)
* **qi-auto-rollup** - Automatically generate config for rollup. [Doc→](https://github.com/SaekiRaku/qi-auto-rollup)

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

#### this.events <Badge text="NEW" />

> Add at v1.2.0

* Type: Object

This object contains 2 functions, `register` and `dispatch`. Pass the event name (string type) and a callback function to `register` and call to register the event. To use these callbacks, pass the event name and any parameters you need to `dispatch` and call it.

### Dispatch Events

Most of the time, users want to know the progress of your module when it's processing. You should inform them by using `this.events.dispatch()`.

When users have pass `callback` to the task config, `qi-auto` will register those callback with the event name of `default`. So you can inform people when things went wrong or everything is fine by calling `this.events.dispatch("default", args)`. The structure of `args` are defined by you, make sure it will be described clearly in your document. 

### Return Result

You can return any type of result, just tell user what is those and how to do next.