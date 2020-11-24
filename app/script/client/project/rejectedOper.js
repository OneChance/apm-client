/*送审打回表单操作，重新提交送审单*/
import ClientCall from "./clientCall";
import Config from "../../config"
import FormValidator from "../formValidator";

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
        constructionUnit: [
            {required: true, message: '请输入施工单位名称', trigger: 'blur'},
        ],
        isBid: [
            {required: true, message: '请选择是否招投标', trigger: 'blur'},
        ],
        contractMoney: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
        ],
        startDate: [
            {required: true, message: '请选择开工时间', trigger: 'blur'}
        ],
        endDate: [
            {required: true, message: '请选择竣工时间', trigger: 'blur'}
        ],
        constructionUnitApplyFee: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'}
        ],
        constructionUnitProjectMan: [
            {required: true, message: '请选择施工单位项目负责人', trigger: 'blur'}
        ],
        constructionUnitTel: [
            {required: true, message: '请填写施工单位联系电话', trigger: 'blur'}
        ],
        buildUnitApplyFee: [
            {required: true, validator: FormValidator.priceValidator, trigger: 'blur'}
        ],
        inspectUnitApplyFee: [
            {validator: FormValidator.priceValidatorNoRequire, trigger: 'blur'}
        ],
        buildUnitProjectMan: [
            {required: true, message: '请填写建设单位项目负责人', trigger: 'blur'}
        ],
        buildUnitTel: [
            {required: true, message: '请填写建设单位联系电话', trigger: 'blur'}
        ],
        materialGroup: [
            {required: true, message: '请选择资料清单组', trigger: 'blur'},
        ],
        payType: [
            {required: true, message: '请选择结算方式', trigger: 'blur'},
        ],
        payCondition: [
            {required: true, message: '请选择付款情况', trigger: 'blur'},
        ],
    },
    rules2: {
        payTypeOther: [
            {required: true, message: '请输入具体结算方式', trigger: 'blur'},
        ],
        payConditionOther: [
            {required: true, message: '请输入具体付款情况', trigger: 'blur'},
        ],
    }
}

export default oper

function recommit(data) {
    ClientCall.restartSubmission(data).then(result => {
        if (result) {
            oper.comp.operSuccess()
        }
    })
}
