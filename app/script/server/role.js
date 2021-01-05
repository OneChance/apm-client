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
    },
    getRoleGroups: function (data) {
        return Net.get('/role/group/list/', data)
    },
    getRoleGroup: function (data) {
        return Net.get('/role/group/get/', data);
    },
    saveGroupRoles: function (data) {
        return Net.jsonPost('/role/group/addOrUpdate/', data);
    },
    deleteGroup(data) {
        return Net.post('/role/group/delete/', data);
    },
}
