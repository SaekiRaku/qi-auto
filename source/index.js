import path from "path";
import Context from "./context/index.js";

import resolveModules from "./resolveModuels.js";

import i18N, { setLanguage } from "./i18N/index.js";

const Localization = setLanguage;

class QiAuto {
    constructor(inputConfig) {
        if (typeof inputConfig !== "object") {
            throw new Error(i18N["Wrong type of config for qi-auto, should be Object"]());
        }

        var result = {};

        for (var key in inputConfig) {
            result[key] = null;
            var task = Object.assign({
                name: key
            }, inputConfig[key]);
            if (!task.module) {
                throw new Error(i18N["Must provide plugin/module for the task of ?"](key));
            }

            var module = resolveModules(task.module);

            result[key] = module.call(new Context(task), task.options);
        }

        return result;
    }
}


export default function (inputConfig) {
    return (new QiAuto(inputConfig))
}

export {
    Localization,
}