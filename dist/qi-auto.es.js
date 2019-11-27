import path from 'path';
import glob from 'glob';

class EventHandler {
  constructor() {
    this.eventList = {};
  }

  register(eventName, callback) {
    if (!this.eventList[eventName]) {
      this.eventList[eventName] = [];
    }

    this.eventList[eventName].push(callback);
  }

  unregister(eventName, callback) {
    for (let i in this.eventList[eventName]) {
      if (this.eventList[eventName][i] === callback) {
        this.eventList[eventName].splice(i, 1);
        break;
      }
    }
  }

  dispatch(eventName, ...args) {
    for (let i in this.eventList[eventName]) {
      this.eventList[eventName][i].apply({}, args);
    }
  }

}

function extractData (data, args) {
  if (typeof data == "function") {
    return data(args);
  } else {
    return data;
  }
}

var utils = {
  eventHandler: EventHandler,
  extractData
};

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
    list.forEach(l => {
      filter.test(l) && result.push(l);
    });
    return result;
  }

  return list;
}

class Events {
  constructor() {
    this.callbacks = {
      default: []
    };
  }

  register(eventname, callbacks) {
    if (!this.callbacks[eventname]) {
      this.callbacks[eventname] = [];
    }

    if (typeof callbacks == "function") {
      this.callbacks[eventname].push(callbacks);
    } else if (Array.isArray(callbacks)) {
      this.callbacks[eventname] = this.callbacks[eventname].concat(callbacks);
    }
  }

  dispatch(eventname, args) {
    for (let i in this.callbacks[eventname]) {
      this.callbacks[eventname][i].call({}, args);
    }
  }

}

var USING_LANGUAGE = "en";

function makeTranslation(translation) {
  return function (...args) {
    let result = translation[USING_LANGUAGE] || translation["en"];
    return result.replace(/[^\\]\?{1}/g, function (match) {
      return " " + args.shift();
    });
  };
}

function setLanguage(language) {
  USING_LANGUAGE = language;
}

var errors = {
  "Wrong type of config for qi-auto, should be Object": makeTranslation({
    "en": "Wrong type of config for qi-auto, should be Object",
    "zh_CN": "qi-auto 的配置类型错误，应为Object"
  }),
  "Must provide directory for the task of ?": makeTranslation({
    "en": "Must provide directory for the task of ?",
    "zh_CN": "必须为任务 ? 提供 directory 参数"
  }),
  "Wrong type of directory of the task of ?": makeTranslation({
    "en": "Wrong type of directory of the task of ?",
    "zh_CN": "任务 ? 提供的 directory 参数类型错误"
  }),
  "Must provide plugin/module for the task of ?": makeTranslation({
    "en": "Must provide plugin/module for the task of ?",
    "zh_CN": "必须为任务 ? 提供 plugin/module 参数"
  })
};

var i18N = { ...errors
};

class Context {
  constructor(task) {
    this._original = void 0;
    this.directory = void 0;
    this.files = [];
    this.filtered = [];
    this.filter = filter;
    this.events = new Events();

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
      this.filtered = filter(files, task.filter);
    }

    task.callback && this.events.register("default", task.callback);
    return this;
  }

}

function resolveModules (inputModule) {
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

  return resultModule;
}

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

function index (inputConfig) {
  return new QiAuto(inputConfig);
}

export default index;
export { Localization };
