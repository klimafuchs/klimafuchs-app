
import {dev, prod} from '../env';
import * as localization from '../localization/locale.gen'
let env = process.env.NODE_ENV !== "production" ? dev : prod;
let lang = env.lang || "default";

export class LocalizationProvider {

    static get(key, values) {
        let template = localization[key];
        if(template) {
            if(template[lang]) {
                if(!values) return template[lang];
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
        console.log(values)
        return new Function(...Object.keys(values), "return `"+string+"`;")(...Object.values(values));
    }
}

