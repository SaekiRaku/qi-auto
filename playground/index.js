import qiauto, { Localization } from "../source/index.js";

Localization("zh_CN");

var result = new qiauto(require(__dirname + "/auto-config.js"));

result.AutoExport.watch();