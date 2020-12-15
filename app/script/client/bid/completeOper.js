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

function backToAuditSecond(comment, formId, workitemId) {
    ClientCall.batchBackToAuditSecond(comment, [
        {
            targetId: formId,
            workitemId: workitemId,
            comment: comment
        }
    ], 0).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}

function arc(comment, formId, workitemId) {
    ClientCall.batchArc(comment, [
        {
            targetId: formId,
            workitemId: workitemId,
            comment: comment
        }
    ], 1).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}


