/*审计立项表单操作*/
import ClientCall from "./clientCall";
import FormValidator from "../formValidator";

const oper = {
    comp: {}, //基本是列表所在控件,加载时候赋值,用于操作完毕后调用其上方法
    buttons: [
        {name: '同意', color: 'success', event: auditAgree},
        {name: '不同意', color: 'danger', event: auditReject, type: 'reject'}
    ],
    rules: {

    },
}

export default oper

function auditAgree(form) {
    audit(1, form)
}

function auditReject(form) {
    audit(0, form)
}

function audit(approve, form) {
    ClientCall.audit(approve, form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
