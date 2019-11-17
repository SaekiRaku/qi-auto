import fs from "fs";
import assert from "assert";
import Writeable from "../writeable.js";

const targetPath = common.path.TEMP + "/testFile.js"
const content = `// QI-AUTO-EXPORT
import a from "./a.js";
import b from "./b.js";

export default {
    a,
    b
}
`

describe("Built-in module of Export", function () {

    afterEach(function () {
        common.clean.temp();
    });

    describe("Writeable", function () {
        it("should return true if the file on the targetPath doesn't exist.", function () {
            const writeable = new Writeable();
            let result = writeable.check(content, targetPath);
            assert.equal(result, true);
        });

        it("should return false if a same file already exists on the targetPath.", function () {
            const writeable = new Writeable();
            fs.writeFileSync(targetPath, content);
            writeable.loadCacheFromFile(targetPath);
            let result = writeable.check(content, targetPath);
            assert.equal(result, false);
        });

        it("should return true if a different file exists on the targetPath.", function () {
            const writeable = new Writeable();
            fs.writeFileSync(targetPath, content + "\nexport {\n    a,\n    b\m}");
            writeable.loadCacheFromFile(targetPath);
            let result = writeable.check(content, targetPath);
            assert.equal(result, true);
        });
    })
})