/*争议处理表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {
            name: '打回复审',
            color: 'danger',
            event: backToAuditSecond
        },
        {
            name: '归档',
            color: 'success',
            event: arc
        },
    ],
}

export default oper

function backToAuditSecond(form) {
    ClientCall.batchBackToAuditSecond(form.comment, [
        {
            targetId: form.targetId,
            workitemId: form.workitemId,
            comment: form.comment
        }
    ], 0).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}

function arc(form) {
    ClientCall.batchArc(form.comment, [
        {
            targetId: form.targetId,
            workitemId: form.workitemId,
            comment: form.comment,
            projectSum: form.projectSum
        }
    ], 1).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}


