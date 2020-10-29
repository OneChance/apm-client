import Net from './net.js'

export default {
    getWillDo: function (data) {
        return Net.get('/workitem/list/', data);
    },
    getDone: function (data) {
        return Net.get('/workitem/approved/', data);
    },
}
