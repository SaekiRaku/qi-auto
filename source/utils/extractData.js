export default function (data, args) {
    if (typeof data == "function") {
        return data(args);
    } else {
        return data;
    }
}