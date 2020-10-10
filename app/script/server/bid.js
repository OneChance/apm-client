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
    //初审
    commitAuditFirst: function (data) {
        return Net.jsonPost('/submission/audit/first/approve/', data);
    },
    //复审
    commitAuditSecond: function (data) {
        return Net.jsonPost('/submission/audit/second/approve/', data);
    },
    //从完成退回复审
    completeToAuditSecond(data) {
        return Net.post('/submission/complete/approves/', data);
    },
    //从完成到归档
    arc(data) {
        console.log(data)
        return Net.post('/submission/complete/approves/', data);
    },
    //归档退回完成
    arcToComplete(data) {
        return Net.post('/submission/filed/approves/', data);
    }
}
