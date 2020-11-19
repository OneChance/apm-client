import Net from './net.js'

export default {
    saveUser: function (data) {
        return Net.jsonPost('/user/addOrUpdate/', data);
    },
    getUsers: function (data) {
        return Net.qsGet('/user/list/', data);
    },
    getInsideUsers: function (data) {
        data.states = ['NORMAL']
        data.types = ['INSIDE', 'OUTSIDE']
        return Net.qsGet('/user/list/', data);
    },
    getIntermediaryUsers: function (data) {
        return Net.get('/user/list/thirdparty/', data);
    },
    getUser: function (data) {
        return Net.get('/user/get/', data);
    },
    updateState: function (data) {
        return Net.post('/user/updateState/', data);
    }
}
