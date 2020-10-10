/*复审表单操作*/
import ClientCall from "./clientCall";
import FormValidator from "../formValidator";

const oper = {
    comp: {},
    buttons: [
        {name: '提交', color: 'success', event: commit},
    ],
    rules: {
        secondAuditPrice: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
        ],
    },
}

export default oper

function commit(form) {
    ClientCall.commitAuditSecond(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
