import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '审核', color: 'success', event: auditAgree},
        {name: '打回修改', color: 'danger', event: auditReject}
    ],
}

export default oper

function auditAgree(comment, formId) {
    audit(1, comment, formId)
}

function auditReject(comment, formId) {
    audit(0, comment, formId)
}

function audit(approve, comment, formId) {
    ClientCall.audit(approve, comment, formId).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
