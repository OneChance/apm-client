import Net from './net.js'

export default {
    getRoles: function (data) {
        return Net.get('/role/list/', data);
    },
    getRole: function (data) {
        return Net.get('/role/get/', data);
    },
    saveRoleUsers: function (data) {
        return Net.jsonPost('/role/addOrUpdate/', data);
    }
}
