/*分配任务操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '同意审计结果', color: 'success', event: agree},
        {name: '不同意审计结果', color: 'danger', event: reject}
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
    ClientCall.takeAdvice({
        type: approve,
        targetId: formId,
        workitemId: workitemId,
        comment: comment
    }).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
