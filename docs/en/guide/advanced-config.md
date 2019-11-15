# Advanced Config

`qi-auto` doesn't have complicated config by now, if our functions don't suit your need. Please tell us at [GitHub Issues](https://github.com/SaekiRaku/qi-auto/issues).

## directory

An absolute path to a folder that you want to traversing, all the files' path inside that folder will pass to `modules`.

## filter

Filter is a RegExp object, it will remove the path from `directory` if it doesn't match the filter.

## module

Choose a module to handle with all files from `directory`.

## options

This is used for modules, please see their documentation,