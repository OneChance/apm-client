/*初审表单操作*/
import ClientCall from "./clientCall";
import FormValidator from "./formValidator";

const oper = {
    comp: {},
    buttons: [
        {name: '提交', color: 'success', event: commit},
    ],
    rules: {
        submissionPrice: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
        ],
        firstAuditPrice: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
        ],
    },
}

export default oper

function commit(form) {
    console.log(form)
    ClientCall.commitAuditFirst(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
