import Net from './net.js'

export default {
    getWillDo: function (data) {
        return Net.get('/workitem/undo/', data);
    },
    getDone: function (data) {
        //return Net.get('/workitem/approved/
        return new Promise((resolve => {
            resolve({list: {content: []}})
        }))
    },
    getMyWork: function (data) {
        //return Net.get('/workitem/approved/audit/', data);
        return new Promise((resolve => {
            resolve({list: {content: []}})
        }))
    },
    getMyCreate: function (data) {
        // return Net.get('/workitem/applyed/', data);
        return new Promise((resolve => {
            resolve({list: {content: []}})
        }))
    },
}
