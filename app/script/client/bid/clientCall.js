/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Bid from "../../server/bid";

export default {
    //保存
    saveSubmission: function (data) {
        return Bid.saveSubmission(data)
    },
    startSubmission: function (data) {
        return Bid.startSubmission(data)
    },
    restartSubmission: function (data) {
        return Bid.restartSubmission(data)
    },
    //删除
    deleteSubmission: function (data) {
        return Bid.deleteSubmission(data)
    },
    getSubmissions: function (data) {
        return Bid.getSubmissions(data)
    },
    exportSubmissions: function (data) {
        return Bid.exportSubmissions(data)
    },
    getSubmission: function (data) {
        return Bid.getSubmission(data)
    },
    //审计立项
    audit(approve, form) {
        return Bid.saveAuditProject({
            target: 'bid',
            type: approve,
            targetId: form.targetId,
            workitemId: form.workitemId,
            content: form.content,
            auditNo: form.auditNo
        })
    },
    //批量审计立项
    batchAudit(approve, checks) {
        checks.forEach(check => {
            check.type = approve
            check.content = ''
        })
        return Bid.saveAuditProjects(checks)
    },
    //批量分配
    batchAlloc(form, checks, approve, auditType) {
        checks.forEach(check => {
            check.type = approve
            check.content = ''
            if (approve === 1) {
                check.assignedId = form.leader
                check.auditType = form.auditType
                if (form.auditType === '外审') {
                    check.thirdpartyId = form.intermediary
                }
            }
        })
        return Bid.allocMissions(checks)
    },
    //分配组员
    allocMember(form) {
        return Bid.allocMember(form)
    },
    //批量审核分配
    batchAllocApprove(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Bid.allocApprove(checks)
    },
    //争议处理
    commitArgue: function (form) {
        return Bid.commitArgue(form)
    },
    //争议处理审计处审核
    commitArgueCheck: function (form) {
        return Bid.commitArgueCheck(form)
    },
    //提交争议处理结果
    commitArgueResolve: function (form) {
        return Bid.commitArgueResolve(form)
    },
    //初审
    commitAuditFirst: function (form) {
        return Bid.commitAuditFirst(form)
    },
    //复审
    commitAuditSecond: function (form) {
        return Bid.commitAuditSecond(form)
    },
    //争议处理
    takeAdvice: function (form) {
        return Bid.takeAdvice(form)
    },
    batchArc(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Bid.arc(checks)
    },
    //批量处理归档阶段的送审表,同意到结束,不同意回到完成
    batchBackToComplete(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Bid.arcToComplete(checks)
    },
    batchBackToAuditSecond(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Bid.completeToAuditSecond(checks)
    },
    getNoteForm(data) {
        return Bid.getNoteForm(data)
    },
    saveNoteForm(data) {
        return Bid.saveNoteForm(data)
    }
}
