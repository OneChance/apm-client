import Net from './net.js'

export default {

    startSubmission: function (data) {
        return Net.jsonPost('/submission/start/', data);
    },
    restartSubmission: function (data) {
        return Net.jsonPost('/submission/restart/', data);
    },
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
        return Net.jsonPost('/submission/project/approves/', data);
    },
    //分配
    allocMissions: function (data) {
        return Net.jsonPost('/submission/distribution/approves/', data);
    },
    //分配组员
    allocMember: function (data) {
        return Net.jsonPost('/submission/memberl/approve/', data);
    },
    //分配审核
    allocApprove: function (data) {
        return Net.jsonPost('/submission/check/approves/', data);
    },
    //勘察准备
    commitSurveyPrepare: function (data) {
        return Net.jsonPost('/submission/survey/prepare/approve/', data);
    },
    //现场勘察
    commitSurvey: function (data) {
        return Net.jsonPost('/submission/survey/scene/approve/', data);
    },
    //争议处理
    commitArgue: function (data) {
        return Net.jsonPost('/submission/argue/approve/', data);
    },
    //争议处理审计处审核
    commitArgueCheck: function (data) {
        return Net.jsonPost('/submission/audit/dept/approve/', data);
    },
    //提交争议处理结果
    commitArgueResolve: function (data) {
        return Net.jsonPost('/submission/argue/reject/approve/', data);
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
        return Net.jsonPost('/submission/complete/approves/', data);
    },
    //从完成到归档
    arc(data) {
        return Net.jsonPost('/submission/complete/approves/', data);
    },
    //归档退回完成
    arcToComplete(data) {
        return Net.jsonPost('/submission/filed/approves/', data);
    },
    getNoteForm(data) {
        return new Promise(resolve => resolve(null))
    }
}
