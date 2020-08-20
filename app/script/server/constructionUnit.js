import Net from './net.js'

export default {
    saveConstructionUnit: function (data) {
        return Net.post('/construction/addOrUpdate/', data);
    },
    getConstructionUnits: function (data) {
        return Net.get('/construction/list/', data);
    },
    getConstructionUnit: function (data) {
        return Net.get('/construction/get/', data);
    },
    deleteConstructionUnit: function (data) {
        return Net.post('/construction/delete/', data);
    }
}
