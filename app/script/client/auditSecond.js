/*复审表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '提交', color: 'success', event: commit},
    ],
}

export default oper

function commit(form) {
    console.log(form)
    ClientCall.commitAuditSecond(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
