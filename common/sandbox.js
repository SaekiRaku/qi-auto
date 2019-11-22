import fs from "fs";
import path from "path";

import glob from "glob";
import uuid from "uuid/v4";

import commonPath from "./path.js";

var SandboxMap = {}

function files(targetPath) {
    var f = glob.sync("**/*", {
        cwd: targetPath,
        nosort: true,
        absolute: true
    });
    f.sort((a, b) => {
        return b.length - a.length;
    });
    return f;
}

export default class Sandbox {

    _id;
    path;

    constructor() {
        this._id = uuid();
        this.path = path.resolve(commonPath.TEMP, this._id);
        fs.mkdirSync(this.path);
        SandboxMap[this._id] = this;
    }

    resolvedPath(name) {
        if (name[0] == "/") {
            name = name.slice(1);
        }
        return path.resolve(this.path, name);
    }

    writeFileSync(filename, data) {
        fs.writeFileSync(this.resolvedPath(filename), data);
    }

    readFileSync(filename) {
        return fs.readFileSync(this.resolvedPath(filename));
    }

    unlinkSync(filename) {
        fs.unlinkSync(this.resolvedPath(filename));
    }

    existsSync(filename) {
        return fs.existsSync(this.resolvedPath(filename));
    }

    mkdirSync(dirname) {
        fs.mkdirSync(this.resolvedPath(dirname));
    }

    destroy() {
        files(this.path).forEach((val) => {
            if (fs.statSync(val).isDirectory()) {
                fs.rmdirSync(val);
            } else {
                fs.unlinkSync(val);
            }
        });
        fs.rmdirSync(this.path);
        delete SandboxMap[this._id];
    }
}