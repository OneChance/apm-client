<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query"
                              v-bind:tableConfigObject="tableConfig"
                              v-bind:needExport="true"
                              v-bind:stepCode="stepCode">
            </submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="'editform'"
                         v-bind:formOpers="formOpers"
                         v-bind:stepCode="stepCode"
                         v-bind:step="'argueHandle'"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import Argue from '../../script/client/project/argue'
import Config from "../../script/config";
import TableComponent from "../TableComponent";
import SubmissionForm from "./SubmissionForm";
import FormValidator from '../../script/client/formValidator'
import SubmissionQuery from "./SubmissionQuery";

export default {
    name: "ArgueHandle",
    mounted: function () {
        Argue.comp = this
    },
    data: function () {
        return {
            stepCode: Config.stepCode.argueHandle,
            dialogVisible: false,
            formOpers: Argue.buttons,
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {prop: 'auditNo', label: '审计编号', width: '100'},
                    {prop: 'contractNo', label: '合同编码'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '110'},
                    {prop: 'assigned.thirdparty.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: 80},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editRow,
                    },
                ]
            },
            rules: {
                submissionPrice: [
                    {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
                ],
                firstAuditPrice: [
                    {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        editRow: function (row) {
            this.dialogVisible = false
            this.dialogVisible = true
            this.formId = row.id
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
    components: {
        TableComponent,
        SubmissionForm, SubmissionQuery
    }
}
</script>

<style scoped>

</style>