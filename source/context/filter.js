export default function (list, filter) {
    if (typeof list == "string") {
        if (!list || !filter || !(filter instanceof RegExp)) {
            return list.toString();
        }
        return filter.test(list);
    } else if (Array.isArray(list)) {
        if (!list.length || !filter || !(filter instanceof RegExp)) {
            return list.slice(0, list.length - 1);
        }
        var result = [];

        list.forEach((l) => {
            filter.test(l) && result.push(l);
        });

        return result;
    }
    return list;
}