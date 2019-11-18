const originalConsole = {
    log: console.log,
    info: console.info,
    error: console.error,
};

function enable() {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.error = originalConsole.error;
}

function disable() {
    let empty = () => {}
    console.log = empty;
    console.info = empty;
    console.error = empty;
}


export default {
    original: originalConsole,
    enable,
    disable
}