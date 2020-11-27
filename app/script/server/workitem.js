import Net from './net.js'

export default {
    getWillDo: function (data) {
        return Net.get('/workitem/undo/', data);
    },
    getDone: function (data) {
        return Net.get('/workitem/approve/', data);
    },
    getMyWork: function (data) {
        return Net.get('/workitem/approve/audit/', data);
    },
    getMyCreate: function (data) {
        return Net.get('/workitem/apply/', data);
    },
    getWorkitemReach: function (data) {
        return Net.get('/workitem/reach/', data);
    },
}
