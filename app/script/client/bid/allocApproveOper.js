/*分配任务操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '同意', color: 'success', event: agree},
        {name: '不同意', color: 'danger', event: reject, type: 'reject'}
    ],
    rules: {
        nextStep: [
            {required: true, message: '请选择下一阶段', trigger: 'blur'}
        ],
    }
}

export default oper

function agree(formData) {
    commitOper(formData)
}

function reject(comment, formId, workitemId) {
    commitOper({
        type: 0,
        targetId: formId,
        workitemId: workitemId,
        comment: comment,
    })
}

function commitOper(formData) {
    ClientCall.allocApprove(formData).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
