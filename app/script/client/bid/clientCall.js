/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Bid from "../../server/bid";
import User from "../../server/user"

export default {
    //保存
    saveSubmission: function (data) {
        return Bid.saveSubmission(data)
    },
    //删除
    deleteSubmission: function (data) {
        return Bid.deleteSubmission(data)
    },
    getSubmission: function (data) {
        return Bid.getSubmissions(data)
    },
    //审计立项
    audit(approve, form) {
        return Bid.saveAuditProject({
            target: 'bid',
            type: approve,
            targetId: form.targetId,
            content: form.content,
            auditNo: form.auditNo
        })
    },
    //批量审计立项
    batchAudit(approve, checks) {
        return Bid.saveAuditProjects({
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
        return Bid.allocMissions(data)
    },
    //批量审核分配
    batchAllocApprove(comment, checks, approve) {
        return Bid.allocApprove({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    //初审
    commitAuditFirst: function (form) {
        return Bid.commitAuditFirst(form)
    },
    //复审
    commitAuditSecond: function (form) {
        return Bid.commitAuditSecond(form)
    },
    getEmps() {
        let data = {
            page: 1,
            pageSize: 99999999,
            thirdParty: false
        }
        return User.getUsers(data)
    },
    batchArc(comment, checks, approve) {
        return Bid.arc({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    batchBackToComplete(comment, checks, approve) {
        return Bid.arcToComplete({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    },
    batchBackToAuditSecond(comment, checks, approve) {
        return Bid.completeToAuditSecond({
            type: approve,
            targetIds: checks,
            comment: comment,
        })
    }
}
