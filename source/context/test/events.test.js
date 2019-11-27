import assert from "assert";
import Events from "../events.js";

describe("QiAuto/Context/Events", function () {
    it("should call the callback correctly when events were dispatched", function (done) {
        let id = setImmediate(() => {
            done(assert.ok(false, "Event was not dispatched"));
        });
        let events = new Events();
        events.register("default", function (arg) {
            clearImmediate(id);
            if (arg == 123) {
                done(assert.ok(true));
            } else {
                done(assert.ok(false, "Callback was not called correctly"));
            }
        });
        events.dispatch("default", 123);
    });
});