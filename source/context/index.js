import path from "path";
import glob from "glob";
import filter from "./filter";

var commonContext = {
    filter
}

export default function (task) {
    var files = glob.sync("**", {
        cwd: path.resolve(task.directory),
        absolute: true
    });
    if (!files.length) {
        return Object.assign(commonContext, {
            files: [],
            filtered: []
        })
    }
    var filtered = filter(files, task.filter);

    return Object.assign(commonContext, {
        files,
        filtered
    })
}