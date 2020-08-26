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
        prepareViewDate2: [
            {required: true, message: '请选择约看现场时间(初审)', trigger: 'blur'}
        ],
        viewDate2: [
            {required: true, message: '请选择现场查看时间(初审)', trigger: 'blur'}
        ],
        viewPeoplesAuditUnit2: [
            {required: true, message: '请选择审核单位现场查看人员(初审)', trigger: 'blur'}
        ],
        viewPeoplesBuildUnit2: [
            {required: true, message: '请选择建设单位现场查看人员(初审)', trigger: 'blur'}
        ],
        viewPeoplesConstructUnit2: [
            {required: true, message: '请选择施工单位现场查看人员(初审)', trigger: 'blur'}
        ],
        viewPeoplesEntrustUnitIds2: [
            {required: true, message: '请填写委托单位现场查看人员(初审)', trigger: 'blur'}
        ],
    },
}

export default oper

function commit(form) {
    ClientCall.commitAuditFirst(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
