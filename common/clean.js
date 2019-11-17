import path from "./path";
import glob from "glob";
import fs from "fs";

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

function temp() {
    files(path.TEMP).forEach((val) => {
        if (fs.statSync(val).isDirectory()) {
            fs.rmdirSync(val);
        } else {
            fs.unlinkSync(val);
        }
    });
}

export default { temp }