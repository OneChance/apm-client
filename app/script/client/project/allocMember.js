/*初审表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '分配', color: 'success', event: commit},
    ],
    rules: {
        members: [
            {required: true, message: '请分配组员', trigger: 'blur'}
        ],
    },
}

export default oper

function commit(form) {
    ClientCall.commitAuditFirst(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
