# 深入配置

`qi-auto` 目前没有非常复杂的配置，如果我们的功能无法满足您的需求，请在 [GitHub Issues](https://github.com/SaekiRaku/qi-auto/issues) 上告诉我们。

## directory

您要遍历的文件夹的绝对路径，该文件夹内的所有文件路径都将传递给 `module`。

## filter

Filter 是一个 RegExp 对象，如果文件路径没有匹配上该规则，它将从 `directory` 中被删除。

## module

选择一个模块来处理所有 `directory` 中的文件。

## options

这个配置是给模块使用的，请参考各个模块的文档。