<template>
    <audit-component v-bind:step="'project'"
                     v-bind:opers="opers"
                     v-bind:formOpers="formOpers"
                     v-bind:customTableConfig="customTableConfig"></audit-component>
</template>

<script>

import AuditComponent from "./AuditComponent";
import Audit from "../script/server/audit";
import ClientCall from "../script/client/clientCall"

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
        auditAgree(comp, comment, formId) {
            this.audit(1, comp, comment, formId)
        },
        auditReject(comp, comment, formId) {
            this.audit(0, comp, comment, formId)
        },
        audit(approve, comp, comment, formId) {
            ClientCall.audit(approve, comp, comment, formId)
        },
        batchAuditAgree(checks, comp) {
            this.batchAudit(1, checks, comp)
        },
        batchAuditReject(checks, comp) {
            this.batchAudit(0, checks, comp)
        },
        batchAudit(approve, checks, comp) {
            ClientCall.batchAudit(approve, checks, comp)
        },
    },
    components: {AuditComponent}
}
</script>

<style scoped>

</style>