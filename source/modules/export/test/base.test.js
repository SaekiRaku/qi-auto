import fs from "fs";
import assert from "assert";
import Base from "../base.js";
import "@babel/polyfill";

async function exportOnce(options) {
    let auto = new qiauto({
        "export": {
            module: require("../index.js").default,
            directory: common.path.TEMP,
            options
        }
    });

    return await new Promise((resolve, reject) => {
        auto["export"].addEventListener("done", () => {
            resolve();
        });
        auto["export"].once()
    })
}

describe("Built-in module of Export", function () {

    before(function () {
        common.clean.temp();
        fs.mkdirSync(common.path.TEMP + "/moduleA");
        fs.mkdirSync(common.path.TEMP + "/moduleB");
        fs.mkdirSync(common.path.TEMP + "/moduleC");
        fs.writeFileSync(common.path.TEMP + "/moduleA/a.js", "");
        fs.writeFileSync(common.path.TEMP + "/moduleA/b.js", "");
        fs.writeFileSync(common.path.TEMP + "/moduleA/c.js", "");
        fs.writeFileSync(common.path.TEMP + "/moduleA/index.js", "WON'T BE OVERWRITED");
        fs.writeFileSync(common.path.TEMP + "/moduleB/aaa.js", "");
        fs.writeFileSync(common.path.TEMP + "/moduleB/bbb.js", "");
        fs.writeFileSync(common.path.TEMP + "/moduleB/ccc.js", "");
    });

    after(function () {
        common.clean.temp();
    });

    describe("base", function () {
        describe("options.name", function () {

            it("should generate 'index.js' as the entry file as default.", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/
                });
                return assert.equal(fs.existsSync(common.path.TEMP + "/moduleB/index.js"), true);
            });

            it("should generate 'index.jsx' as the entry file when options.name is provided it.", async function () {
                await exportOnce({
                    name: "index.jsx",
                    filter: /(moduleA,moduleB)/
                })
                return assert.equal(fs.existsSync(common.path.TEMP + "/moduleB/index.jsx"), true);
            });

        })

        describe("options.type", function () {
            it("should generate ES6 syntax if options.type is provided 'esm'", function () {
                let base = new Base({
                    type: "esm"
                })
                assert.equal(base._import("name", "./path.js"), "import name from \"./path.js\";");
            });

            it("should generate CommonJS syntax if options.type is provided 'cjs'", function () {
                let base = new Base({
                    type: "cjs"
                })
                assert.equal(base._import("name", "./path.js"), "const name = require(\"./path.js\");");
            });
        })

        describe("options.inject", function () {

            it("should inject the content from function into the entry file.", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/,
                    inject: function (data) {
                        if (/(moduleB)$/.test(data.directory)) {
                            return "console.log('inject');\n";
                        }
                    }
                });
                return assert.equal(fs.readFileSync(common.path.TEMP + "/moduleB/index.js").toString(), `// QI-AUTO-EXPORT\nimport aaa from "./aaa.js";\nimport bbb from "./bbb.js";\nimport ccc from "./ccc.js";\n\nconsole.log('inject');\n\nexport default {\n    aaa,\n    bbb,\n    ccc,\n}`);
            });

            it("should inject the content string into the entry file.", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/,
                    inject: "console.log('inject');\n"
                });
                return assert.equal(fs.readFileSync(common.path.TEMP + "/moduleB/index.js").toString(), `// QI-AUTO-EXPORT\nimport aaa from "./aaa.js";\nimport bbb from "./bbb.js";\nimport ccc from "./ccc.js";\n\nconsole.log('inject');\n\nexport default {\n    aaa,\n    bbb,\n    ccc,\n}`);
            });

        })

        describe("options.overwrite", function () {

            it("should overwrite the import and export with the content from function to the entry file.", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/,
                    overwriteImport: function () {
                        return "";
                    },
                    overwriteExport: function () {
                        return "";
                    }
                });
                return assert.equal(fs.readFileSync(common.path.TEMP + "/moduleB/index.js").toString(), "// QI-AUTO-EXPORT\n\n");
            });

            it("should overwrite the import and export with the content string to the entry file.", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/,
                    overwriteImport: "",
                    overwriteExport: ""
                });
                return assert.equal(fs.readFileSync(common.path.TEMP + "/moduleB/index.js").toString(), "// QI-AUTO-EXPORT\n\n");
            });

        })

        describe.skip("feature", function () {
            // This test case may cause bugs when running with others due to the async process. We will fix it later, for now just skip it.

            it("should not overwrite entry file without starting with FLAG_STRING", async function () {
                await exportOnce({
                    filter: /(moduleA,moduleB)/
                });
                return assert.equal(fs.readFileSync(common.path.TEMP + "/moduleA/index.js"), "WON'T BE OVERWRITED");
            });

            it("should not rewrite the entry file if it's same before and after write.", function (done) {
                var watcher;;

                fs.writeFileSync(common.path.TEMP + "/moduleC/a.js", "");
                fs.writeFileSync(common.path.TEMP + "/moduleC/index.js", `// QI-AUTO-EXPORT\nimport a from "./a.js";\n\nexport default {\n    a,\n}`);

                var timeoutID = setTimeout(() => {
                    watcher.close();
                    done(assert.ok(true));
                }, 1000);

                exportOnce({
                    filter: /(moduleC)/,
                });

                watcher = fs.watch(common.path.TEMP + "/moduleC/index.js", (type, filename) => {
                    clearTimeout(timeoutID);
                    watcher.close();
                    done(assert.ok(false, "Entry file was overwrited"));
                });
            });

        })

    })
})