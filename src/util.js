import env from './env';

export class Util {
    static ImageToUri(image) {
        const API_IMG_URL = __DEV__ ? env.dev.API_IMG_URL : env.prod.API_IMG_URL;

        if (image) {
            if (image.filename) {
                return `${env.dev.API_IMG_URL}${image.filename}`
            }
        }
    }
}