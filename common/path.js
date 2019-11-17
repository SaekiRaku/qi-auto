import path from "path";

const ROOT = path.resolve(__dirname, "../");
const PLAYGROUND = path.resolve(ROOT, "playground");
const TEMP = path.resolve(ROOT, "temp");
const SOURCE = path.resolve(ROOT, "source");
const DIST = path.resolve(ROOT, "dist");

export default {
    ROOT,
    PLAYGROUND,
    TEMP,
    SOURCE,
    DIST
}