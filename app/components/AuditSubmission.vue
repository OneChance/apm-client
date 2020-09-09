<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query"
                              v-bind:tableConfigObject="tableConfig"
                              v-bind:stepCode="stepCode"
                              v-bind:buttons="buttons">
            </submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formRules="rules"
                         v-bind:formRules2="rules2"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'submission'"
                         v-bind:stepCode="stepCode"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import Audit from "../script/server/audit";
import Config from "../script/config";
import FormValidator from "../script/client/formValidator";
import SubmissionQuery from "./SubmissionQuery";

export default {
    name: "AuditSubmission",
    created: function () {

    },
    mounted() {

    },
    watch: {},
    data: function () {
        return {
            stepCode: Config.stepCode.submissionSave,
            dialogVisible: false,
            from: '',
            formId: -1,
            formOpers: [
                {name: '保存', color: 'primary', event: this.saveSubmission},
                {name: '提交', color: 'success', event: this.commitSubmission}
            ],
            buttons: [
                {name: '新增', color: 'success', event: this.add},
            ],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '150'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editRow,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.deleteRow,
                        check: true
                    }
                ]
            },
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
                    {required: true, message: '请填写施工单位报审金额', trigger: 'blur'}
                ],
                constructionUnitProjectMan: [
                    {required: true, message: '请选择施工单位项目负责人', trigger: 'blur'}
                ],
                constructionUnitTel: [
                    {required: true, message: '请填写施工单位联系电话', trigger: 'blur'}
                ],
                inspectUnitApplyFee: [
                    {required: true, message: '请填写监理单位报审金额', trigger: 'blur'}
                ],
                inspectUnitProjectMan: [
                    {required: true, message: '请填写监理单位项目负责人', trigger: 'blur'}
                ],
                inspectUnitTel: [
                    {required: true, message: '请填写监理单位联系电话', trigger: 'blur'}
                ],
                buildUnitApplyFee: [
                    {required: true, message: '请填写建设单位报审金额', trigger: 'blur'}
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
    },
    methods: {
        add: function () {
            //子组件关闭后visible值不能回传,所以在父组件里重置下,触发变化
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'addform'
        },
        editRow: function (row) {
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        deleteRow: function (row) {
            Audit.deleteSubmission({id: row.id}).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.$refs.query.list({page: 1})
            })
        },
        saveSubmission: function (form) {
            this.commitForm(-10, form)
        },
        commitSubmission: function (form) {
            this.commitForm(10, form)
        },
        commitForm(code, form) {
            //设置状态
            form.status = code
            Audit.saveSubmission(form).then(result => {
                if (result) {
                    this.operSuccess()
                }
            })
        },
        operSuccess() {
            this.dialogVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.$refs.query.list({page: 1})
        },
        toPage: function (val) {
            this.$refs.query.list({page: val})
        },
    },
    components: {TableComponent, SubmissionForm, SubmissionQuery}
}
</script>

<style scoped>

</style>