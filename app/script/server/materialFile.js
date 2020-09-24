import Net from './net.js'

export default {
    saveMaterialType: function (data) {
        return Net.post('/material/addOrUpdate/', data);
    },
    getMaterialTypes: function () {
        return Net.get('/material/list/');
    },
    deleteMaterialTypes: function (data) {
        return Net.post('/material/delete/', data);
    },
    saveMaterialGroup: function (data) {
        return Net.jsonPost('/material/group/addOrUpdate/', data);
    },
    getMaterialGroups: function () {
        return Net.get('/material/group/list/');
    },
    getMaterialGroup: function (data) {
        return Net.get('/material/group/get/', data);
    },
    deleteMaterialGroup: function (data) {
        return Net.post('/material/group/delete/', data);
    }
}
