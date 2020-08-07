import Audit from "../server/audit";

export default {
    //审计立项
    audit(approve, comp, comment, formId) {
        Audit.saveAuditProject({
            target: 'submission',
            type: approve,
            targetId: formId,
            content: comment,
        }).then(result => {
            if (result) {
                comp.operSuccess(comp)
            }
        })
    },
    //批量审计立项
    batchAudit(approve, checks, comp) {
        Audit.saveAuditProjects({
            type: approve,
            targetIds: checks.map(form => form.id),
            content: '',
        }).then(result => {
            if (result) {
                comp.operSuccess(comp)
            }
        })
    },
}
