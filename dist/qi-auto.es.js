import path from 'path';
import glob from 'glob';

function filter (list, filter) {
    if (typeof list == "string") {
        if (!list || !filter || !(filter instanceof RegExp)) {
            return list.toString();
        }
        return filter.test(list);
    } else if (Array.isArray(list)) {
        if (!list.length || !filter || !(filter instanceof RegExp)) {
            return list.slice(0, list.length - 1);
        }
        var result = [];

        list.forEach((l) => {
            filter.test(l) && result.push(l);
        });

        return result;
    }
    return list;
}

var commonContext = {
    filter
};

function context (task) {
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

function index (inputConfig) {
    var config;
    if (typeof inputConfig == "string") {
        // config = await import(inputConfig);
        config = require(inputConfig);
        if (config.default) {
            config = config.default;
        }
    } else if (typeof inputConfig == "object") {
        config = inputConfig;
    }

    var result = {};

    for (var key in config) {
        result[key] = "null";
        var task = Object.assign({}, config[key]);
        var module;
        if (!task.module) {
            console.warn(`Must provide 'module' for '${key}'`);
        }
        if (typeof task.module == "string") {
            if (task.module.indexOf("qi-auto-") != -1) {
                task.module = task.module.slice(8, task.module.length);
            }
            if (["webpack-entry", "export"].indexOf(task.module) != -1) {
                // module = await import(`./modules/${task.module}`);
                module = require(`${__dirname}/modules/${task.module}`);
            } else {
                // module = await import(`qi-auto-${task.module}`);
                module = require(`qi-auto-${task.module}`);
            }
        } else if (typeof task.module == "function") {
            module = task.module;
        }
        if (module.default) {
            module = module.default;
        }

        result[key] = module.call(context(task), task.options);
    }

    return result;
}

export default index;
