var USING_LANGUAGE = "en";

function makeTranslation(translation) {
    return function (...args) {
        let result = translation[USING_LANGUAGE] || translation["en"];
        return result.replace(/[^\\]\?{1}/g, function (match) {
            return " " + args.shift();
        })
    }
}

function setLanguage(language) {
    USING_LANGUAGE = language;
}

export {
    USING_LANGUAGE,
    makeTranslation,
    setLanguage
}