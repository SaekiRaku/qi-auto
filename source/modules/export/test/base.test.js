import fs from "fs";
import assert from "assert";
import Base from "../base.js";
import "@babel/polyfill";

function exportOnce(fs, options) {
    fs.mkdirSync("moduleA");
    fs.mkdirSync("moduleB");
    fs.writeFileSync("moduleA/a.js", "");
    fs.writeFileSync("moduleA/b.js", "");
    fs.writeFileSync("moduleA/c.js", "");
    fs.writeFileSync("moduleA/index.js", "WON'T BE OVERWRITED");
    fs.writeFileSync("moduleB/aaa.js", "");
    fs.writeFileSync("moduleB/bbb.js", "");
    fs.writeFileSync("moduleB/ccc.js", "");

    let auto = new qiauto({
        "export": {
            module: require("../index.js").default,
            directory: fs.path,
            options
        }
    });

    return new Promise((resolve, reject) => {
        auto["export"].addEventListener("done", () => {
            resolve();
        });
        auto["export"].once()
    })
}

describe("Built-in module of Export", function () {

    describe("base", function () {
        describe("options.name", function () {

            it("should generate 'index.js' as the entry file as default.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/
                });
                let result = assert.equal(sandbox.existsSync("moduleB/index.js"), true);
                sandbox.destroy();
                return result;
            });

            it("should generate 'index.jsx' as the entry file when options.name is provided it.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    name: "index.jsx",
                    filter: /(moduleA,moduleB)/
                })
                let result = assert.equal(sandbox.existsSync("moduleB/index.jsx"), true);
                sandbox.destroy();
                return result;
            });

        })

        describe("options.type", function () {
            it("should generate ES6 syntax if options.type is provided 'esm'", function () {
                let base = new Base({
                    type: "esm"
                })
                return assert.equal(base._import("name", "./path.js"), "import name from \"./path.js\";");
            });

            it("should generate CommonJS syntax if options.type is provided 'cjs'", function () {
                let base = new Base({
                    type: "cjs"
                })
                return assert.equal(base._import("name", "./path.js"), "const name = require(\"./path.js\");");
            });
        })

        describe("options.inject", function () {

            it("should inject the content from function into the entry file.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/,
                    inject: function (data) {
                        if (/(moduleB)$/.test(data.directory)) {
                            return "console.log('inject');\n";
                        }
                    }
                });
                let result = assert.equal(sandbox.readFileSync("moduleB/index.js").toString(), `// QI-AUTO-EXPORT\nimport aaa from "./aaa.js";\nimport bbb from "./bbb.js";\nimport ccc from "./ccc.js";\n\nconsole.log('inject');\n\nexport default {\n    aaa,\n    bbb,\n    ccc,\n}`);
                sandbox.destroy();
                return result;
            });

            it("should inject the content string into the entry file.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/,
                    inject: "console.log('inject');\n"
                });
                let result = assert.equal(sandbox.readFileSync("moduleB/index.js").toString(), `// QI-AUTO-EXPORT\nimport aaa from "./aaa.js";\nimport bbb from "./bbb.js";\nimport ccc from "./ccc.js";\n\nconsole.log('inject');\n\nexport default {\n    aaa,\n    bbb,\n    ccc,\n}`);
                sandbox.destroy();
                return result;
            });

        })

        describe("options.overwrite", function () {

            it("should provide related data correctly", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/,
                    overwriteImport: function () {
                        return "";
                    },
                    overwriteExport: function () {
                        return "";
                    }
                });
                let result = assert.equal(sandbox.readFileSync("moduleB/index.js").toString(), "// QI-AUTO-EXPORT\n\n");
                sandbox.destroy();
                return result;
            });

            it("should overwrite the import and export with the content from function to the entry file.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/,
                    overwriteImport: function () {
                        return "";
                    },
                    overwriteExport: function () {
                        return "";
                    }
                });
                let result = assert.equal(sandbox.readFileSync("moduleB/index.js").toString(), "// QI-AUTO-EXPORT\n\n");
                sandbox.destroy();
                return result;
            });

            it("should overwrite the import and export with the content string to the entry file.", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/,
                    overwriteImport: "",
                    overwriteExport: ""
                });
                let result = assert.equal(sandbox.readFileSync("moduleB/index.js").toString(), "// QI-AUTO-EXPORT\n\n");
                sandbox.destroy();
                return result;
            });

        })

        describe("feature", function () {

            it("should not overwrite entry file without starting with FLAG_STRING", async function () {
                const sandbox = new common.sandbox();
                await exportOnce(sandbox, {
                    filter: /(moduleA,moduleB)/
                });
                let result = assert.equal(sandbox.readFileSync("moduleA/index.js"), "WON'T BE OVERWRITED");
                sandbox.destroy();
                return result;
            });

            it.skip("should not rewrite the entry file if it's same before and after write.", function (done) {
                const sandbox = new common.sandbox();

                var watcher;

                sandbox.mkdirSync("moduleC");
                sandbox.writeFileSync("moduleC/a.js", "");
                sandbox.writeFileSync("moduleC/index.js", `// QI-AUTO-EXPORT\nimport a from "./a.js";\n\nexport default {\n    a,\n}`);

                var timeoutID = setTimeout(() => {
                    watcher.close();
                    sandbox.destroy();
                    done(assert.ok(true));
                }, 1000);

                watcher = fs.watch(sandbox.resolvedPath("moduleC/index.js"), (type, filename) => {
                    common.console.enable();
                    clearTimeout(timeoutID);
                    watcher.close();
                    sandbox.destroy();
                    done(assert.ok(false, "Entry file was overwrited"));
                });

                exportOnce(sandbox, {
                    filter: /(moduleC)/,
                });
            });

        })

    })
})