/*现场勘察表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {},
    buttons: [
        {name: '提交', color: 'success', event: commitSurvey},
    ],
}

export default oper

function commitSurvey(form) {
    console.log(form)
    /*ClientCall.commitSurveyPrepare(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })*/
}
