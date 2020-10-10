/*送审打回表单操作，重新提交送审单*/
import ClientCall from "./clientCall";
import Config from "../../config"

const oper = {
    comp: {},
    buttons: [
        {name: '重新提交', color: 'warning', event: recommit},
    ],
}

export default oper

function recommit(data) {
    //设置状态为10
    data.status = Config.stepCode.auditProject
    ClientCall.saveSubmission(data).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
