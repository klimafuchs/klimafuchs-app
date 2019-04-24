
import {dev, prod} from '../env';
import * as localization from '../localization/locale.gen'
let env = process.env.NODE_ENV !== "production" ? dev : prod;
let lang = env.LANG || "default";

/**
 * Resolves string names to translated string constants defined in locale.gen.json
 * The Locale file is generated with the script APP_ROOT/get-copy.sh which loads the
 * definitions from a google sheets document at the COPY_SHEET_URL url
 */
export class LocalizationProvider {

    /**
     * Resolves a given string name to a constant or a filled template
     * @param key name
     * @param values template values in ${} blocks
     * @returns {string|*} the string constant or the filled template
     */
    static get(key, values) {
        let template = localization[key];
        if(template) {
            if(template[lang]) {
                return this.makeTemplateString(template[lang], values)
            }
            else {
                let error = `MISSING string for ${lang} in ${key}!`;
                console.warn(error);
                return error;
            }
        } else {
            let error = `MISSING localization for ${key}!`;
            console.warn(error);
            return error;
        }
    }

    static makeTemplateString(string, values) {
        try {
            values = values || {};
            return new Function(...Object.keys(values), "return `"+string+"`;")(...Object.values(values));
        } catch (e) {
            console.warn(e.message);
            return string;

        }
    }
}

