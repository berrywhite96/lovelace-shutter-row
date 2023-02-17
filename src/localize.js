import * as en from "./localization/en.json";
import * as de from "./localization/de.json";

const DEFAULT_LANG = "en";

/**
 * Returns custom localizations
 * @param {string} lang
 * @returns Array
 */
function getLang(lang) {
    switch (lang) {
        case "en":
            return en;
        case "de":
            return de;

        default:
            return en;
    }
}

/**
 * Customized localization
 * @param {hass} hass
 * @param {string} keys
 * @returns string
 */
export function customLocalize(hass, keys) {
    let deepLookup = (keys, data) => {
        let curKey = keys.pop();
        if (!curKey in data) return false;
        if (keys.length == 0) return data[curKey];
        return deepLookup(keys, data[curKey]);
    };
    let lang = hass.locale.language ?? DEFAULT_LANG;

    return deepLookup(keys.split(".").reverse(), getLang(lang));
}
