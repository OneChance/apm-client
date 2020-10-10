/*争议处理表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {
            name: '争议处理',
            color: 'danger',
            event: argueDeal
        },
        {
            name: '争议解决',
            color: 'success',
            event: argueResolve
        },
    ],
}

export default oper

function argueDeal(form) {
    form.type = 0
    commit(form)
}

function argueResolve(form) {
    form.type = 1
    commit(form)
}

function commit(form) {
    ClientCall.commitArgue(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
