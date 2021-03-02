/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Audit from "../../server/audit";
import fr from "element-ui/src/locale/lang/fr";

export default {
    //提交送审
    startSubmission: function (data) {
        return Audit.startSubmission(data)
    },
    //打回提交送审
    restartSubmission: function (data) {
        return Audit.restartSubmission(data)
    },
    //保存送审
    saveSubmission: function (data) {
        return Audit.saveSubmission(data)
    },
    getSubmissions: function (data) {
        return Audit.getSubmissions(data)
    },
    exportSubmissions: function (data) {
        return Audit.exportSubmissions(data)
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
            workitemId: form.workitemId,
            content: form.content,
            auditNo: form.auditNo
        })
    },
    //批量审计立项（不同意）
    batchAudit(approve, checks) {
        checks.forEach(check => {
            check.type = approve
            check.content = ''
        })
        return Audit.saveAuditProjects(checks)
    },
    //批量分配
    batchAlloc(form, checks, approve) {
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
        return Audit.allocMissions(checks)
    },
    //分配组员
    allocMember(form) {
        return Audit.allocMember(form)
    },
    //批量审核分配
    batchAllocApprove(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Audit.allocApprove(checks)
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
    //争议处理审计处审核
    commitArgueCheck: function (form) {
        return Audit.commitArgueCheck(form)
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
    //争议处理
    takeAdvice: function (form) {
        return Audit.takeAdvice(form)
    },
    batchArc(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Audit.arc(checks)
    },
    //批量处理归档阶段的送审表,同意到结束,不同意回到完成
    batchBackToComplete(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Audit.arcToComplete(checks)
    },
    batchBackToAuditSecond(comment, checks, approve) {
        checks.forEach(check => {
            check.type = approve
            check.comment = comment
        })
        return Audit.completeToAuditSecond(checks)
    },
    getNoteForm(data) {
        return Audit.getNoteForm(data)
    },
    saveNoteForm(data) {
        return Audit.saveNoteForm(data)
    }
}
