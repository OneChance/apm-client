/*初审表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '分配组员', color: 'success', event: alloc},
        {name: '不同意', color: 'danger', event: reject, type: 'reject'},
    ],
    rules: {
        members: [
            {required: true, message: '请分配组员', trigger: 'blur'}
        ],
    },
}

export default oper

function alloc(form) {
    commit(form, 1)
}

function reject(form) {
    commit(form, 0)
}

function commit(form, approve) {
    form.type = approve
    ClientCall.allocMember(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
