/*审计立项表单按钮和方法,独立出来用于传递给submission表单*/
import ClientCall from "./clientCall";

const oper = {
    comp: {}, //基本是列表所在控件,加载时候赋值,用于操作完毕后调用其上方法
    buttons: [
        {name: '审核', color: 'success', event: auditAgree},
        {name: '打回修改', color: 'danger', event: auditReject}
    ],
}

export default oper

function auditAgree(comment, formId) {
    audit(1, comment, formId)
}

function auditReject(comment, formId) {
    audit(0, comment, formId)
}

function audit(approve, comment, formId) {
    ClientCall.audit(approve, comment, formId).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
