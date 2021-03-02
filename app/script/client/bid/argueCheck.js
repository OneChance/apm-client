/*争议处理表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {
            name: '继续处理',
            color: 'danger',
            event: argueNext
        },
        {
            name: '处理完成',
            color: 'success',
            event: argueComplete
        },
    ],
}

export default oper

function argueNext(form) {
    form.type = 0
    commit(form)
}

function argueComplete(form) {
    form.type = 1
    commit(form)
}

function commit(form) {
    ClientCall.commitArgueCheck(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
