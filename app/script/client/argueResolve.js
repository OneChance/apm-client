/*争议处理表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {
            name: '提交处理',
            color: 'danger',
            event: commit
        },
    ],
}

export default oper

function commit(form) {
    ClientCall.commitArgueResolve(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
