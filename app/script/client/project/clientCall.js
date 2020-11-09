/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Audit from "../../server/audit";

export default {
    //保存送审
    saveSubmission: function (data) {
        return Audit.saveSubmission(data)
    },
    getSubmissions: function (data) {
        return Audit.getSubmissions(data)
    },
    getSubmission: function (data) {
        return Audit.getSubmission(data)
    },
    deleteSubmission: function (data) {
        return Audit.deleteSubmission(data)
    },
    //审计立项
    audit(approve, form) {
        return Audit.saveAuditProject({
            target: 'submission',
            type: approve,
            targetId: form.targetId,
            content: form.content,
            auditNo: form.auditNo
        })
    },
    //批量审计立项
    batchAudit(approve, checks) {
        return Audit.saveAuditProjects({
            type: approve,
            targetIds: checks,
            content: '',
        })
    },
    //批量分配
    batchAlloc(form, checks, approve, auditType) {
        let data = {
            type: approve,
            targetIds: checks,
        }
        if (form) {
            data.assignedId = form.target
            data.auditType = form.auditType
            if (form.auditType === '外审') {
                data.assignedLinkId = form.link
            }
        }
        return Audit.allocMissions(data)
    },
    //批量审核分配
    batchAllocApprove(comment, checks, approve) {
        return Audit.allocApprove({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    //提交勘察准备
    commitSurveyPrepare(form) {
        return Audit.commitSurveyPrepare(form)
    },
    //现场勘察
    commitSurvey: function (form) {
        return Audit.commitSurvey(form)
    },
    //争议处理
    commitArgue: function (form) {
        return Audit.commitArgue(form)
    },
    //提交争议处理结果
    commitArgueResolve: function (form) {
        return Audit.commitArgueResolve(form)
    },
    //初审
    commitAuditFirst: function (form) {
        return Audit.commitAuditFirst(form)
    },
    //复审
    commitAuditSecond: function (form) {
        return Audit.commitAuditSecond(form)
    },
    batchArc(comment, checks, approve) {
        return Audit.arc({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    batchBackToComplete(comment, checks, approve) {
        return Audit.arcToComplete({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    batchBackToAuditSecond(comment, checks, approve) {
        return Audit.completeToAuditSecond({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    }
}