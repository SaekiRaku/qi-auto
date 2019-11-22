import path from "path";
import common from "../common";

import strip from "@rollup/plugin-strip";
import babel from 'rollup-plugin-babel';

const plugins = [
    strip(),
    babel({
        babelrc: false,
        "presets": [
            ["@babel/preset-env", {
                targets: {
                    node: "12.13.0"
                }
            }]
        ],
        "plugins": [["@babel/plugin-proposal-class-properties", { "loose": true }]]
    })
]

export default {
    "qi-auto": {
        input: {
            input: path.resolve(common.path.SOURCE, "index.js"),
            plugins
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
            plugins
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
            plugins
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
            }
        ]
    }
}