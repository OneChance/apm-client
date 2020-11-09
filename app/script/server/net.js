import App from '../app.js'
import Env from './env.js'

const qs = require('qs');


export default {
    get(api, data) {
        return request(api, 'get', data);
    },
    jsonPost(api, data) {
        return request(api, 'json_post', data);
    },
    post(api, data) {
        return request(api, 'post', data);
    },
    axiosUpload(api, data, progress) {
        return request(api, 'file', data, progress);
    },
    download(url) {
        return request(url, 'download');
    }
}


let request = function (api, type, data, progress) {

    let axiosRequest;
    let fullURL = Env.baseURL + api;

    //获取token
    let token = localStorage.getItem('apm_token');
    if (!token) {
        token = App.vueG.$cookie.get('apm_token')
    }
    if (!token) {
        token = '';
    }

    if (type === 'download') {
        axiosRequest = App.vueG.axios.get(api, {
            headers: {'Authorization': 'Bearer ' + token},
            responseType: 'blob',
        });
    } else if (type === 'file') {
        axiosRequest = App.vueG.axios.create({
            baseURL: Env.baseURL,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + token
            },
            onUploadProgress: progress
        }).post(fullURL, data.file, {
            cancelToken: data.file.get('formFile').source.token
        });
    } else if (type === 'get') {
        axiosRequest = App.vueG.axios.get(fullURL, {
            headers: {'Authorization': 'Bearer ' + token},
            params: data,
        });
    } else if (type === 'json_post') {
        axiosRequest = App.vueG.axios.post(fullURL, data, {
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
        });
    } else {
        axiosRequest = App.vueG.axios.post(fullURL, null, {
            headers: {'Authorization': 'Bearer ' + token},
            params: data,
            paramsSerializer: function (params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        });
    }

    return axiosRequest.then((response) => {
        if (!response) {
            App.vueG.$notify.error({
                title: '错误',
                message: '服务器响应超时'
            });
            return new Promise((resolve, reject) => {
                reject()
            })
        }
        if (type === 'file') {
            response.data.info = data.info
        }
        return response.data;
    }).catch(function (e) {

        if (e.message && e.message === 'cancel-upload') {

        } else {
            let msg = '服务器异常'

            if (e.response && e.response.data.error_msg) {
                msg = e.response.data.error_msg
            }

            App.vueG.$notify.error({
                title: '错误',
                message: msg
            });

            if (e.response && e.response.data.error_code === 10000) {
                App.vueG.$router.push('/sign');
            }
        }

        return new Promise((resolve, reject) => {
            reject(data)
        })
    })
};
