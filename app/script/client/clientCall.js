/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

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
    },
    //批量分配
    batchAlloc(form, checks) {
        console.log(checks)
    }
}
