import fs from "fs";
import crypto from "crypto";

const FLAG_STRING = "// QI-AUTO-EXPORT";

/**
 * This module can check files if is the same before and after written,
 * so that it can reduce the frequency of disk written, and also solved the issue of `rollup` endlessly rebuild.
 */
export default class Writeable {
    constructor() {
        this.cacheMap = {};
    }

    loadCacheFromFile(targetPath) {
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