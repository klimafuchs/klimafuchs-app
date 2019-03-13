import {actions} from "./actions/Actions";
import {FileSystem} from 'expo'
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';

const cacheDir = `${FileSystem.cacheDirectory}klimafuchs-image-cache/`;

const getLoading = (state) => state.imageCache.loading;

const fetch = function* ({payload}) {
    const loading = yield select(getLoading);
    if (loading.includes(payload.uri)) return;
    const outFile = `${cacheDir}${payload.fileName}`
    const localFile = yield FileSystem.getInfoAsync(outFile);
    if (localFile.exists) {
        yield put(actions.images.success({
            uri: payload.uri,
            local: localFile.uri
        }))
        return;
    }
    yield put(actions.images.download(payload.uri, outFile));
    const downloaded = yield FileSystem.downloadAsync(payload.uri, output);
    yield put(actions.images.success({
        uri: payload.uri,
        local: downloaded.uri
    }));
};

const fetchSaga = function* () {
    yield takeEvery(actions.images.fetch.type, fetch);
};

const init = function* () {
    const folderInfo = yield FileSystem.getInfoAsync(cacheDir);
    if (folderInfo.exists) return;
    yield FileSystem.makeDirectoryAsync(folder);
};

const initSaga = function* () {
    yield takeLatest(actions.images.start.type, init)
}

export default [fetchSaga, initSaga]
