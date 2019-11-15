import fs from "fs";
import path from "path";

export default function (options) {
    var entry = {}

    const name = (() => {
        if (!options.name) {
            options.name = "[folder]";
        }
        if (typeof options.name == "function") {
            return options.name
        }
        if (typeof options.name == "string") {
            return function (filepath, name) {
                if (name.indexOf("[folder]") != -1 && !fs.statSync(filepath).isDirectory()) {
                    name = name.replace(/\[folder\]/g, path.basename(path.resolve(filepath, "../")));
                }
                if (name.indexOf("[name]") != -1) {
                    name = name.replace(/\[name\]/g, path.basename(filepath, path.extname(filepath)));
                }
                if (name.indexOf("[ext]") != -1) {
                    name = name.replace(/\[ext\]/g, path.extname(filepath));
                }
                return name;
            }
        }
    })();

    function validateArray(arr) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (typeof arr == "string") {
            return [arr];
        } else {
            return [];
        }
    }

    const prechunks = (() => {
        return (filepath) => {
            if (typeof options.prechunks == "function") {
                return validateArray(options.prechunks.call(this, filepath));
            } else {
                return validateArray(options.prechunks);
            }
        }
    })();
    const afterchunks = (() => {
        return (filepath) => {
            if (typeof options.afterchunks == "function") {
                return validateArray(options.afterchunks.call(this, filepath));
            } else {
                return validateArray(options.afterchunks);
            }
        }
    })();

    for (var i in this.filtered) {
        let filepath = this.filtered[i];
        if (filepath == "length") {
            continue;
        }

        let single = filepath;
        let pre = prechunks(filepath);
        let after = afterchunks(filepath);
        if (pre.length || after.length) {
            single = pre.concat(filepath, after);
        }
        entry[name(filepath, options.name)] = single;
    }

    return entry;
}