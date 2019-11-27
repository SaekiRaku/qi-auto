export default function (inputModule) {
    var resultModule;

    if (typeof inputModule == "string") {
        if (inputModule.indexOf("qi-auto-") != -1) {
            inputModule = inputModule.slice(8, inputModule.length);
        }
        if (["webpack-entry", "export"].indexOf(inputModule) != -1) {
            resultModule = require(`${__dirname}/modules/${inputModule}`);
        } else {
            resultModule = require(`qi-auto-${inputModule}`);
        }
    } else if (typeof inputModule == "function") {
        resultModule = inputModule;
    }
    if (resultModule.default) {
        resultModule = resultModule.default;
    }
    return resultModule
}