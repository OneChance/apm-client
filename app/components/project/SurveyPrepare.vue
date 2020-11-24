<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query" v-bind:tableConfigObject="tableConfig"
                              v-bind:stepCode="stepCode"></submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="'editform'"
                         v-bind:formRules="rules"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'surveyPrepare'"
                         v-bind:readable="true"
                         v-bind:stepCode="stepCode"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import TableComponent from "../TableComponent";
import SubmissionForm from "./SubmissionForm";
import Config from "../../script/config";
import SurveyPrepare from "../../script/client/project/surveyPrepare"
import SubmissionQuery from "./SubmissionQuery";

export default {
    name: "SurveyPrepare",
    created: function () {

    },
    mounted() {
        SurveyPrepare.comp = this
        //this.formOpers = SurveyPrepare.buttons
    },
    data: function () {
        return {
            stepCode: Config.stepCode.surveyPrepare,
            dialogVisible: false,
            formOpers: [],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '220'},
                    {prop: 'assigned.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.editRow,
                    },
                ],
            },
            listChecks: [],
            formId: -1,
            rules: SurveyPrepare.rules,
        }
    },
    methods: {
        editRow: function (row) {
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'editform'
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
    components: {TableComponent, SubmissionForm, SubmissionQuery}
}
</script>

<style scoped>

</style>