import Net from './net.js'

export default {
    //送审表
    saveSubmission: function (data) {
        return Net.jsonPost('/bid/addOrUpdate/', data);
    },
    getSubmissions: function (data) {
        return Net.get('/bid/list/', data)
    },
    getSubmission: function (data) {
        return Net.get('/bid/get/', data)
    },
    deleteSubmission: function (data) {
        return Net.post('/bid/delete/', data);
    },
    //审计立项
    saveAuditProject: function (data) {
        return Net.jsonPost('/bid/project/approve/', data);
    },
    saveAuditProjects: function (data) {
        return Net.post('/bid/project/approves/', data);
    },
    //分配
    allocMissions: function (data) {
        return Net.post('/bid/distribution/approves/', data);
    },
    //分配审核
    allocApprove: function (data) {
        return Net.post('/bid/check/approves/', data);
    },
    //初审
    commitAuditFirst: function (data) {
        return Net.jsonPost('/bid/audit/first/approve/', data);
    },
    //复审
    commitAuditSecond: function (data) {
        return Net.jsonPost('/bid/audit/second/approve/', data);
    },
    //从完成退回复审
    completeToAuditSecond(data) {
        return Net.post('/bid/complete/approves/', data);
    },
    //从完成到归档
    arc(data) {
        return Net.post('/bid/complete/approves/', data);
    },
    //归档退回完成
    arcToComplete(data) {
        return Net.post('/bid/filed/approves/', data);
    }
}
