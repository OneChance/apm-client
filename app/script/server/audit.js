import Net from './net.js'

export default {
    saveSubmission: function (data) {
        return Net.jsonPost('/submission/addOrUpdate/', data);
    },
    getSubmissions: function (data) {
        return Net.get('/submission/list/', data)
    },
    getSubmission: function (data) {
        return Net.get('/submission/get/', data)
    },
    deleteSubmission: function (data) {
        return Net.post('/submission/delete/', data);
    },
    saveAuditProject: function (data) {
        return Net.jsonPost('/submission/project/approve/', data);
    },
    saveAuditProjects: function (data) {
        return Net.post('/submission/project/approves/', data);
    }
}