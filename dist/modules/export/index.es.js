import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const FLAG_STRING = "// QI-AUTO-EXPORT";
/**
 * This module can check files if is the same before and after written,
 * so that it can reduce the frequency of disk written, and also solved the issue of `rollup` endlessly rebuild.
 */

class Writeable {
  constructor() {
    this.cacheMap = {};
  }

  loadCacheFromFile(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    let data = fs.readFileSync(targetPath).toString();
    let hash = crypto.createHash("md5");
    hash.update(data);
    let result = hash.digest("hex");
    this.cacheMap[targetPath] = result;
  }

  check(data, targetPath) {
    if (!data || !targetPath) {
      return false;
    }

    if (data.slice(0, 17) != FLAG_STRING) {
      return false;
    }

    let hash = crypto.createHash("md5");
    let cache = this.cacheMap[targetPath];
    hash.update(data);
    let result = hash.digest("hex");

    if (!cache || cache != result) {
      this.cacheMap[targetPath] = result;
      return true;
    } else {
      this.cacheMap[targetPath] = result;
      return false;
    }
  }

  cleanCache() {
    this.cacheMap = {};
  }

}

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

const FLAG_STRING$1 = "// QI-AUTO-EXPORT";

class Exporter {
  // _import = null;
  // _export = null;
  // _options = null;
  // _throttle = {};
  constructor(options) {
    this._writeable = new Writeable();
    this._directorys = [];
    this._fsWacherMap = {};
    this._throttle = {};
    this._eventHandler = new utils.eventHandler();
    this._options = Object.assign({}, options);

    if (this._options.type == "esm") {
      this._import = function (name, path) {
        return `import ${name} from "${path}";`;
      };
    } else {
      this._import = function (name, path) {
        return `const ${name} = require("${path}");`;
      };
    }

    this._export = function (name, object) {
      if (name == object || object === undefined) {
        return `${name},`;
      } else {
        return `${name}:${object},`;
      }
    };
  }

  addDirectorys(dirs) {
    if (Array.isArray(dirs)) {
      this._cleanDirectorys(dirs);
    } else if (typeof dirs == "string") {
      this._cleanDirectorys([dirs]);
    }
  }

  once() {
    for (let i in this._directorys) {
      let p = this._directorys[i];

      this._writeFiles(path.resolve(p, this._options.name), this._generate(p));
    }
  }

  watch() {
    for (let i in this._directorys) {
      let p = this._directorys[i];

      this._writeFiles(path.resolve(p, this._options.name), this._generate(p));

      let watcher = fs.watch(p, {
        recursive: true
      });
      watcher.addListener("change", (() => {
        return (type, filename) => {
          if (filename == this._options.name) {
            return;
          }

          this._writeFiles(path.resolve(p, this._options.name), this._generate(p));
        };
      })());

      if (!this._fsWacherMap[p]) {
        this._fsWacherMap[p] = watcher;
      }
    }
  }

  stop() {
    for (let i in this._fsWacherMap) {
      this._fsWacherMap[i].close();

      this._fsWacherMap[i] = null;
      delete this._fsWacherMap[i];
    }
  }

  addEventListener(event, callback) {
    this._eventHandler.register(event, callback);
  }

  removeEventListener(event, callback) {
    this._eventHandler.unregister(event, callback);
  }

  _cleanDirectorys(files) {
    for (let i in files) {
      let p = files[i];

      if (!fs.statSync(p).isDirectory()) {
        p = path.dirname(p);
      }

      if (this._directorys.indexOf(p) == -1) {
        this._directorys.push(p);
      }
    }

    this._directorys.sort((a, b) => {
      return b.length - a.length;
    });
  }

  _readFlag(filepath) {
    return new Promise((resolve, reject) => {
      let stream = fs.createReadStream(filepath, {
        start: 0,
        end: 16
      });
      stream.on("data", data => {
        resolve(data.toString());
        stream.close();
      });
      stream.on("error", err => {
        reject(err);
      });
      stream.read(16);
    });
  }

  async _generate(dir) {
    let entryFilePath = path.resolve(dir, this._options.name);

    if (fs.existsSync(entryFilePath)) {
      let flag = await this._readFlag(entryFilePath);

      if (flag != FLAG_STRING$1) {
        return null;
      } else {
        this._writeable.loadCacheFromFile(entryFilePath);
      }
    }

    let files = fs.readdirSync(dir, {
      withFileTypes: true
    });
    let result = {
      imports: [],
      exports: []
    };

    for (let i in files) {
      let f = files[i];

      if (f.name == this._options.name) {
        continue;
      }

      let extname = path.extname(f.name);
      let basename = path.basename(f.name, extname);

      if (f.isDirectory()) {
        if (fs.existsSync(path.resolve(dir, f.name, this._options.name))) {
          result.imports.push({
            importName: basename,
            importPath: "./" + f.name + "/" + this._options.name
          });
          result.exports.push({
            exportName: basename,
            moduleName: basename
          });
        }
      } else {
        result.imports.push({
          importName: basename,
          importPath: "./" + f.name
        });
        result.exports.push({
          exportName: basename,
          moduleName: basename
        });
      }
    }

    return result;
  }

  async _writeFiles(filepath, content) {
    if (this._throttle[filepath]) {
      clearTimeout(this._throttle[filepath]);
    }

    if (!content) {
      return false;
    }

    let c = await content;

    if (!c || !c.imports.length || !c.exports.length) {
      return false;
    }

    let context = {
      directory: path.dirname(filepath),
      imports: c.imports,
      exports: c.exports
    };
    let result = "";
    let importStrings = "";
    let exportStrings = "";

    if (this._options.type == "esm") {
      exportStrings += "export default {\n";
    } else {
      exportStrings += "module.exports = {\n";
    }

    for (let i in c.imports) {
      importStrings += this._import(c.imports[i].importName, c.imports[i].importPath) + "\n";
      exportStrings += "    " + this._export(c.exports[i].exportName, c.exports[i].moduleName) + "\n";
    }

    exportStrings += "}";
    result += FLAG_STRING$1 + "\n";

    if (this._options.overwriteImport == undefined) {
      result += importStrings + "\n";
    } else {
      result += utils.extractData(this._options.overwriteImport, context) + "\n";
    }

    if (this._options.inject) {
      result += utils.extractData(this._options.inject, context) + "\n";
    }

    if (this._options.overwriteExport == undefined) {
      result += exportStrings;
    } else {
      result += utils.extractData(this._options.overwriteExport, content);
    }

    this._throttle[filepath] = setTimeout(() => {
      if (this._writeable.check(result.toString(), filepath)) {
        fs.writeFileSync(filepath, result.toString());
      }

      delete this._throttle[filepath];

      if (Object.keys(this._throttle).length == 0) {
        this._eventHandler.dispatch("done");
      }
    }, 10);
  }

}

/**
 * @param { String } options.name - Default is "index.js"
 * @param { String } options.type - "cjs" | "esm"
 * @param { String } options.inject - Content that you want to inject between `import` and `export`
 */

function index (options) {
  let opts = Object.assign({}, options);
  opts.name = opts.name || "index.js";
  opts.type = opts.type || "esm";
  let exporter = new Exporter(opts);
  exporter.addDirectorys(this.filtered.length ? this.filtered : this.files);
  return exporter;
}

export default index;
