/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Audit from "../server/audit";
import Workitem from "../server/workitem"
import Net from "../server/net";

export default {
    //保存送审
    saveSubmission: function (data) {
        return Audit.saveSubmission(data)
    },
    //审计立项
    audit(approve, comment, formId) {
        return Audit.saveAuditProject({
            target: 'submission',
            type: approve,
            targetId: formId,
            content: comment,
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
    //获得待办
    getWillDo(data) {
        return Workitem.getWillDo(data)
    },
    //批量分配
    batchAlloc(form, checks, approve) {
        let data = {
            type: approve,
            targetIds: checks,
        }
        if (form) {
            data.assignedId = form.target
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
    }
}
