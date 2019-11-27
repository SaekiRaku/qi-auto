# Advanced Config

`qi-auto` doesn't have complicated config by now, if our functions don't suit your need. Please tell us at [GitHub Issues](https://github.com/SaekiRaku/qi-auto/issues).

## directory

> Type: String  
> Required  

An absolute path to a folder that you want to traversing, all the files' path inside that folder will pass to `modules`.

## filter

> Type: RegExp  
> Optional  

Filter is a RegExp object, it will remove the path from `directory` if it doesn't match the filter.

## module

> Type: String | Function  
> Required  

Choose a module to handle with all files from `directory`.

## options

> Type: Object  
> Optional  

This is used for modules, please read their documentation.

## callback <Badge text="NEW" />

> Type: Function | Array  
> Optional  
> Add at v1.2.0  

This is used for modules, please read their documentation. Normally, this callback will be called when module is done or get erros.
