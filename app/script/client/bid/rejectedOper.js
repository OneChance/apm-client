/*送审打回表单操作，重新提交送审单*/
import ClientCall from "./clientCall";
import Config from "../../config"

const oper = {
    comp: {},
    buttons: [
        {name: '重新提交', color: 'warning', event: recommit},
    ],
    rules: {
        contractNo: [
            {required: true, message: '请输入合同编码', trigger: 'blur'},
        ],
        projectName: [
            {required: true, message: '请输入工程项目名称', trigger: 'blur'},
        ],
        startDate: [
            {required: true, message: '请选择预计开工时间', trigger: 'blur'}
        ],
        materialGroup: [
            {required: true, message: '请选择资料清单组', trigger: 'blur'},
        ],
    },
}

export default oper

function recommit(data) {
    //设置状态为10
    data.status = Config.stepCodeBid.project
    ClientCall.saveSubmission(data).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
