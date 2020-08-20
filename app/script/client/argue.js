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
    commit(form, 0)
}

function argueResolve(form) {
    commit(form, 1)
}

function commit(form, status) {
    ClientCall.commitArgue(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
