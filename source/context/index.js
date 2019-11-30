import path from "path";

import glob from "glob";

import utils from "../utils/index.js";
import filter from "./filter";
import Events from "./events.js";
import i18N from "../i18N/index.js";

class Context {

    _original;

    directory;
    files = [];
    filtered = [];

    filter = filter;
    events = new Events;

    constructor(task) {
        if (!task.directory) {
            throw new Error(i18N["Must provide directory for task of ?"](task.name));
        }
        const DIRECTORY = utils.extractData(task.directory);
        if (typeof DIRECTORY !== "string") {
            throw new Error(i18N["Wrong type of directory of task of ?"](task.name));
        }

        this._original = task;
        this.directory = task.directory;

        this.files = glob.sync("**", {
            cwd: path.resolve(DIRECTORY),
            absolute: true
        });

        if (!this.files.length) {
            return this;
        }

        if (task.filter) {
            this.filtered = filter(this.files, task.filter);
        }

        task.callback && this.events.register("default", task.callback);

        return this;
    }
}

export default Context;