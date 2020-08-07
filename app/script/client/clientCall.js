import Audit from "../server/audit";
import Workitem from "../server/workitem"

export default {
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
            targetIds: checks.map(form => form.id),
            content: '',
        })
    },
    //获得待办
    getWillDo(data) {
        return Workitem.getWillDo(data)
    }
}
