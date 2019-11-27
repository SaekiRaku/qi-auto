import assert from "assert";
import Writeable from "../writeable.js";

describe("Offical module of Export", function () {

    const sandbox = new common.sandbox();

    after(function () {
        sandbox.destroy();
    });

    const targetPath = sandbox.resolvedPath("testFile.js");
    const content = 
        `// QI-AUTO-EXPORT
        import a from "./a.js";
        import b from "./b.js";

        export default {
            a,
            b
        }`

    describe("Writeable", function () {
        it("should return true if the file on the targetPath doesn't exist.", function () {
            const writeable = new Writeable();
            let result = writeable.check(content, targetPath);
            assert.equal(result, true);
        });

        it("should return false if a same file already exists on the targetPath.", function () {
            const writeable = new Writeable();
            sandbox.writeFileSync("testFile.js", content);
            writeable.loadCacheFromFile(targetPath);
            let result = writeable.check(content, targetPath);
            assert.equal(result, false);
        });

        it("should return true if a different file exists on the targetPath.", function () {
            const writeable = new Writeable();
            sandbox.writeFileSync("testFile.js", content + "\nexport {\n    a,\n    b\m}");
            writeable.loadCacheFromFile(targetPath);
            let result = writeable.check(content, targetPath);
            assert.equal(result, true);
        });
    })
})