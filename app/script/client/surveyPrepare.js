/*勘察准备表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {}, //基本是列表所在控件,加载时候赋值,用于操作完毕后调用其上方法
    buttons: [
        {name: '提交', color: 'success', event: commitSurveyPrepare},
    ],
}

export default oper

function commitSurveyPrepare(form) {
    console.log(form)
    ClientCall.commitSurveyPrepare(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
