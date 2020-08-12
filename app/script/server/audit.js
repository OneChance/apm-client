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
        return Net.post('/submission/check/approves/', data);
    },
    //勘察准备
    commitSurveyPrepare: function (data) {
        return Net.post('/submission/survey/prepare/approve/', data);
    },
    //现场勘察
    commitSurvey: function (data) {
        return Net.jsonPost('/submission/survey/scene/approve/', data);
    },
    //争议处理
    commitArgue: function (data) {
        return Net.jsonPost('/submission/assigned/approves/', data);
    },
    //初审
    commitAuditFirst: function (data) {
        return Net.jsonPost('/submission/assigned/approves/', data);
    },
    //复审
    commitAuditSecond: function (data) {
        return Net.jsonPost('/submission/assigned/approves/', data);
    },
}
