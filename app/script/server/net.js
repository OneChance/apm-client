import Vue from 'vue'
import App from '../app.js'
import Env from './env.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {Notification} from 'element-ui';

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

export default {
    get(api) {
        return request(api, 'get');
    },
    post(api, data) {
        return request(api, 'post', data);
    }
}


let request = function (api, type, data) {

    let axiosRequest;
    let fullURL = Env.baseURL + api;

    if (type === 'get') {
        axiosRequest = Vue.axios.get(fullURL);
    } else {
        axiosRequest = Vue.axios.post(fullURL, null, {
            params: data
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
