import Net from './net.js'

export default {
    signIn: function (data) {
        return Net.post('/login/', data);
    },
    getLoginUser: function () {
        return Net.get('/user/get/');
    },
    logOut: function () {
        return Net.get('/logout/');
    },
}
