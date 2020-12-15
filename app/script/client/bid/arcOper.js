/*争议处理表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {
            name: '打回完成',
            color: 'danger',
            event: back
        },
        {
            name: '结束',
            color: 'success',
            event: end
        },
    ],
}

export default oper

function back(comment, formId, workitemId) {
    commitOper(0, comment, formId, workitemId)
}

function end(comment, formId, workitemId) {
    commitOper(1, comment, formId, workitemId)
}

function commitOper(approve, comment, formId, workitemId) {
    ClientCall.batchBackToComplete(comment, [
        {
            targetId: formId,
            workitemId: workitemId,
            comment: comment
        }
    ], approve).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}


