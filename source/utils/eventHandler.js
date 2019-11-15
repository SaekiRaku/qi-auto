export default class EventHandler {
    constructor() {
        this.eventList = {}
    }

    register(eventName, callback) {
        if (!this.eventList[eventName]) {
            this.eventList[eventName] = [];
        }
        this.eventList[eventName].push(callback);
    }

    unregister(eventName, callback) {
        for (let i in this.eventList[eventName]) {
            if (this.eventList[eventName][i] === callback) {
                this.eventList[eventName].splice(i, 1);
                break;
            }
        }
    }

    dispatch(eventName, ...args) {
        for (let i in this.eventList[eventName]) {
            this.eventList[eventName][i].apply({}, args);
        }
    }
}