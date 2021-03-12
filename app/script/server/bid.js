import Net from './net.js'

export default {
    //保存送审表
    saveSubmission: function (data) {
        return Net.jsonPost('/bid/addOrUpdate/', data);
    },
    startSubmission: function (data) {
        return Net.jsonPost('/bid/start/', data);
    },
    restartSubmission: function (data) {
        return Net.jsonPost('/bid/restart/', data);
    },
    getSubmissions: function (data) {
        return Net.qsGet('/bid/list/', data)
    },
    exportSubmissions: function (data) {
        return Net.exportData('/bid/export/', data)
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
        return Net.jsonPost('/bid/project/approves/', data);
    },
    //分配
    allocMissions: function (data) {
        return Net.jsonPost('/bid/distribution/approves/', data);
    },
    //分配组员
    allocMember: function (data) {
        return Net.jsonPost('/bid/memberl/approve/', data);
    },
    //分配审核
    allocApprove: function (data) {
        return Net.jsonPost('/bid/check/approves/', data);
    },
    //争议处理
    commitArgue: function (data) {
        return Net.jsonPost('/bid/argue/approve/', data);
    },
    //争议处理审计处审核
    commitArgueCheck: function (data) {
        return Net.jsonPost('/bid/audit/dept/approve/', data);
    },
    //提交争议处理结果
    commitArgueResolve: function (data) {
        return Net.jsonPost('/bid/argue/reject/approve/', data);
    },
    //初审
    commitAuditFirst: function (data) {
        return Net.jsonPost('/bid/audit/first/approve/', data);
    },
    //复审
    commitAuditSecond: function (data) {
        return Net.jsonPost('/bid/audit/second/approve/', data);
    },
    //征求意见
    takeAdvice: function (data) {
        return Net.jsonPost('/bid/takeAdvice/', data);
    },
    //从完成退回复审
    completeToAuditSecond(data) {
        return Net.jsonPost('/bid/complete/approves/', data);
    },
    //从完成到归档
    arc(data) {
        return Net.jsonPost('/bid/complete/approves/', data);
    },
    //归档退回完成
    arcToComplete(data) {
        return Net.jsonPost('/bid/filed/approves/', data);
    },
    getNoteForm(data) {
        return Net.get('/bid/noty/get/', data);
    },
    saveNoteForm(data) {
        return Net.jsonPost('/bid/noty/addOrUpdate/', data);
    }
}
