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
    }
}
