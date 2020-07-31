import Vue from 'vue'
import App from '../app.js'
import Env from './env.js'
import axios from 'axios'

const qs = require('qs');
import VueAxios from 'vue-axios'
import {Notification} from 'element-ui';

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

//附件请求
let axiosUpload = Vue.axios.create({
    baseURL: Env.baseURL,
    headers: {"Content-Type": "multipart/form-data"}
})

export default {
    get(api, data) {
        return request(api, 'get', data);
    },
    post(api, data) {
        return request(api, 'post', data);
    },
    axiosUpload(api, data) {
        return request(api, 'file', data);
    }
}


let request = function (api, type, data) {

    let axiosRequest;
    let fullURL = Env.baseURL + api;

    if (type === 'file') {
        axiosRequest = axiosUpload.post(api, data);
    } else if (type === 'get') {
        axiosRequest = Vue.axios.get(fullURL, {
            params: data,
        });
    } else {
        axiosRequest = Vue.axios.post(fullURL, null, {
            params: data,
            paramsSerializer: function (params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        });
    }

    return axiosRequest.then((response) => {
        return response.data;
    }).catch(function (e) {
        Notification.error({
            title: '错误',
            message: e.response.data.error_msg
        });
        if (res.error_code === 10000) {
            window.location.href = App.loginPage
        }
    })
};
