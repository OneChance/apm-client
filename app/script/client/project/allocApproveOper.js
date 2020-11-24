/*分配任务操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '同意', color: 'success', event: agree},
        {name: '不同意', color: 'danger', event: reject}
    ],
}

export default oper

function agree(comment, formId, workitemId) {
    commitOper(1, comment, formId, workitemId)
}

function reject(comment, formId, workitemId) {
    commitOper(0, comment, formId, workitemId)
}

function commitOper(approve, comment, formId, workitemId) {
    ClientCall.batchAllocApprove(comment, [
        {
            type: approve,
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
