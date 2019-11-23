import Exporter from "./base.js";

/**
 * @param { String } options.name - Default is "index.js"
 * @param { String } options.type - "cjs" | "esm"
 * @param { String } options.inject - Content that you want to inject between `import` and `export`
 */

export default function (options) {
    let opts = Object.assign({}, options);
    opts.name = opts.name || "index.js";
    opts.type = opts.type || "esm";
    let exporter = new Exporter(opts);
    exporter.addDirectorys(this.directory);
    exporter.addDirectorys(this.filtered.length ? this.filtered : this.files);
    return exporter;
}