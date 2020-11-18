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

function agree(comment, formId) {
    commitOper(1, comment, formId)
}

function reject(comment, formId) {
    commitOper(0, comment, formId)
}

function commitOper(approve, comment, formId) {
    ClientCall.batchAllocApprove(comment, [formId], approve).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
