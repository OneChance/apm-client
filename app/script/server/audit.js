import Net from './net.js'

export default {
    //送审表
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
    //审计立项
    saveAuditProject: function (data) {
        return Net.jsonPost('/submission/project/approve/', data);
    },
    saveAuditProjects: function (data) {
        return Net.post('/submission/project/approves/', data);
    },
    //分配
    allocMissions: function (data) {
        return Net.post('/submission/distribution/approves/', data);
    },
    //分配审核
    allocApprove: function (data) {
        return Net.post('/submission/assigned/approves/', data);
    },
    //分配审核
    commitSurveyPrepare: function (data) {
        return Net.post('/submission/assigned/approves/', data);
    },
}
