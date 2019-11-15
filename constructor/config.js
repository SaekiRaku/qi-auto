import path from "path";
import common from "../common";

export default {
    "qi-auto": {
        input: {
            input: path.resolve(common.path.SOURCE, "index.js"),
        },
        output: [{
                name: "qiAuto",
                format: "cjs",
                file: path.resolve(common.path.DIST, "qi-auto.js")
            },
            {
                name: "qiAuto",
                format: "esm",
                file: path.resolve(common.path.DIST, "qi-auto.es.js")
            }
        ]
    },
    "module-webpack-entry": {
        input: {
            input: path.resolve(common.path.SOURCE, "modules/webpack-entry/index.js"),
        },
        output: [{
            name: "webpackEntry",
            format: "cjs",
            file: path.resolve(common.path.DIST, "modules/webpack-entry/index.js")
        }, {
            name: "webpackEntry",
            format: "esm",
            file: path.resolve(common.path.DIST, "modules/webpack-entry/index.es.js")
        }]
    },
    "module-export": {
        input: {
            input: path.resolve(common.path.SOURCE, "modules/export/index.js"),
        },
        output: [{
            name: "export",
            format: "cjs",
            file: path.resolve(common.path.DIST, "modules/export/index.js")
        },
        {
            name: "export",
            format: "esm",
            file: path.resolve(common.path.DIST, "modules/export/index.es.js")
        }]
    }
}