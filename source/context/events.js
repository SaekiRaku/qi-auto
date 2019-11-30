class Events {
    constructor() {
        this.callbacks = {
            default:[]
        };
    }

    register(eventname, callbacks) {
        if (!this.callbacks[eventname]) {
            this.callbacks[eventname] = [];
        }
        if (typeof callbacks == "function") {
            this.callbacks[eventname].push(callbacks);
        } else if(Array.isArray(callbacks)){
            this.callbacks[eventname] = this.callbacks[eventname].concat(callbacks);
        }
    }

    dispatch(eventname, ...args) {
        for (let i in this.callbacks[eventname]) {
            this.callbacks[eventname][i].call({}, args);
        }
    }
}

export default Events;