/*现场勘察表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '提交', color: 'success', event: commitSurvey},
    ],
    rules: {
        viewPeoplesAuditUnit: [
            {required: true, message: '请选择审核单位现场查看人员', trigger: 'blur'}
        ],
        viewPeoplesBuildUnit: [
            {required: true, message: '请选择建设单位现场查看人员', trigger: 'blur'}
        ],
        viewPeoplesConstructUnit: [
            {required: true, message: '请选择施工单位现场查看人员', trigger: 'blur'}
        ],
        viewPeoplesEntrustUnit: [
            {required: true, message: '请填写委托单位现场查看人员', trigger: 'blur'}
        ],
    },
}

export default oper

function commitSurvey(form) {
    ClientCall.commitSurvey(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
