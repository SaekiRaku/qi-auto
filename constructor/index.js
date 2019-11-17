import path from "path";
import {
    rollup
} from "rollup/dist/rollup.es";
import common from "../common";
import CONFIG from "./config.js";

export default {
    develop() {
        import(path.resolve(common.path.PLAYGROUND, "index.js"));
    },
    async build() {
        for (let key in CONFIG) {
            console.log(`> Building ${key}...`);
            let config = CONFIG[key];
            let bundle = await rollup(config.input).catch((e) => {
                console.error(e);
            });
            for (let i in config.output) {
                let output = config.output[i];
                await bundle.write(output).catch((e) => {
                    console.error(e);
                });
            }
        }

        console.info("> Done");
    }
}