import {dev, prod} from '../../env';

let env = process.env.NODE_ENV !== "production" ? dev : prod;

export const constraints = {
    teamName: {
        presence: {
            allowEmpty: false,
            message: '^Bitte gib deinem Team einen Namen'
        },
    },
    userName: {
        email: {
            message: '^Bitte gib eine Email ein'
        }
    },
    screenName: {
        presence: {
            allowEmpty: false,
            message: '^Bitte gib einen Namen ein'
        },
    },
    password: {
        length: {
            minimum: env.MIN_PASSWORD_LEN,
            message: `Bitte gib ein mindestens ${env.MIN_PASSWORD_LEN} Zeichen langes Passwort ein`
        },
    },

};