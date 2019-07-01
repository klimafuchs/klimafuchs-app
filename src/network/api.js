import axios from 'axios'

const verbose = false;
var appContext = null;

const baseUrl = "https://klimafuchs.org/app-dev/"// works on android emulator ONLY!!

function doPostAuthorized(url, token, data, onSuccess, onError) {
    axios.post(baseUrl + url,data,{
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
    }}).then((res) => {
        if (verbose) console.log(res);
        onSuccess(res);
    }).catch((err) => {
        if (verbose) console.log("POST to " + url + "\n Payload: " + JSON.stringify({
            headers: {
                "Authorization": "Bearer " + token
            }, data: data
        }), err)
        if (err.response.status >= 400 && err.response.status < 500) {
        }
        onError(err)

    })
}

function doPost(url, data, onSuccess, onError) {
    axios.post(baseUrl + url,data).then((res) => {
        if (verbose) console.log(res);
        onSuccess(res);
    }).catch((err) => {
        if (verbose) console.log("POST to " + url + "\n Payload: " + JSON.stringify(data), err)
        onError(err)
    })
}

function doGetWithParams( url, token = "" , data, onSuccess, onError ) {
    axios.get(baseUrl + url, {
        headers: {
            "Authorization": "Bearer " + token
        },
        params: data
    }).then((res) => {
        if (verbose) console.log(res);
        onSuccess(res);
    }).catch((err) => {
        if (verbose) console.log("GET to " + url, err)
        if (err.response.status >= 400 && err.response.status < 500) {
        }
        onError(err)
    })
}

function doGet( url, token = "", onSuccess, onError ) {
    axios.get(baseUrl + url, {
        headers: {
            "Authorization": "Bearer " + token
        },
    }).then((res) => {
        if (verbose) console.log(res);
        onSuccess(res);
    }).catch((err) => {
        if (verbose) console.log("GET to " + url, err)
        if (err.response.status >= 400 && err.response.status < 500) {
        }
        onError(err)
    })
}

export default {
    checkTokenValid(token, onSuccess, onError) {
        doGetWithParams('api/checkLogin', token, {}, onSuccess, onError);
    },
    checkEmailExists(email, onSuccess, onError) {
        doGetWithParams('api/checkEmail',"", {username: email}, onSuccess, onError);
    },
    login(email, password, onSuccess, onError) {
        let userdata = {
            username: email,
            password: password
        };
        doPost('api/login', userdata, onSuccess, onError);
    },
    register(userdata, onSuccess, onError) {
        doPost('api/register', userdata, onSuccess, onError);
    },

    requestPasswordReset(email, onSuccess, onError) {
        axios.get("/api/resetPassword", {
            params: {username: email}
        }).then((res) => {
            if (verbose) console.log(res);
            onSuccess(res);
        }).catch((err) => {
            onError(err)
        })
    },


};