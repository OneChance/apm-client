import Net from './net.js'

export default {
    saveUser: function (data) {
        return Net.jsonPost('/user/addOrUpdate/', data);
    },
    getUsers: function (data) {
        return Net.get('/user/list/', data);
    },
    getUser: function (data) {
        return Net.get('/user/get/', data);
    },
    updateState: function (data) {
        return Net.post('/user/updateState/', data);
    }
}
