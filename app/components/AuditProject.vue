<template>
    <audit-component v-bind:step="'project'"
                     v-bind:opers="opers"
                     v-bind:formOpers="formOpers"
                     v-bind:customTableConfig="customTableConfig"></audit-component>
</template>

<script>

import AuditComponent from "./AuditComponent";
import Audit from "../script/server/audit";

export default {
    name: "AuditProject",
    created: function () {

    },
    mounted() {
    },
    data: function () {
        return {
            opers: [
                {name: '批量审核同意', color: 'success', event: this.batchAuditAgree},
                {name: '批量审核打回', color: 'danger', event: this.batchAuditReject}
            ],
            formOpers: [
                {name: '审核', color: 'success', event: this.auditAgree},
                {name: '打回修改', color: 'danger', event: this.auditReject}
            ],
            customTableConfig: {
                checkable: true,
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '审核', placement: 'top'},
                        event: 'edit',
                    },
                ]
            }
        }
    },
    methods: {
        auditAgree(operSuccess, comp, comment, formId) {
            this.audit(1, operSuccess, comp, comment, formId)
        },
        auditReject(operSuccess, comp, comment, formId) {
            this.audit(0, operSuccess, comp, comment, formId)
        },
        audit(approve, operSuccess, comp, comment, formId) {
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
        batchAuditAgree(checks, operSuccess, comp) {
            this.batchAudit(1, checks, operSuccess, comp)
        },
        batchAuditReject(checks, operSuccess, comp) {
            this.batchAudit(0, checks, operSuccess, comp)
        },
        batchAudit(approve, checks, operSuccess, comp) {
            Audit.saveAuditProjects({
                type: approve,
                targetIds: checks.map(form => form.id),
                content: '',
            }).then(result => {
                if (result) {
                    operSuccess(comp)
                }
            })
        },
    },
    components: {AuditComponent}
}
</script>

<style scoped>

</style>