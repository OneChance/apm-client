/*勘察准备表单操作*/
import ClientCall from "./clientCall";

const oper = {
    comp: {}, //基本是列表所在控件,加载时候赋值,用于操作完毕后调用其上方法
    buttons: [
        {name: '提交', color: 'success', event: commitSurveyPrepare},
    ],
    rules: {
        prepareViewDate: [
            {required: true, message: '请选择约看现场时间', trigger: 'blur'}
        ],
        viewDate: [
            {required: true, message: '请选择现场查看时间', trigger: 'blur'}
        ],
        viewPeoples: [
            {required: true, message: '请填写现场查看人员', trigger: 'blur'},
        ],
    },
}

export default oper

function commitSurveyPrepare(form) {
    ClientCall.commitSurveyPrepare(form).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
