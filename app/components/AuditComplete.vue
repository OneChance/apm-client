<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query" v-bind:tableConfigObject="tableConfig"
                              v-bind:stepCode="stepCode"></submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible" v-bind:from="'editform'" v-bind:step="'auditArc'"
                         v-bind:formId="formId">
        </submission-form>
        <audit-note-form v-bind:visible="noteFormVisible" v-bind:formId="formId"></audit-note-form>
    </div>
</template>

<script>
import AuditNoteForm from './AuditNoteForm'
import Config from "../script/config";
import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import SubmissionQuery from "./SubmissionQuery";

export default {
    name: "AuditComplete",
    mounted: function () {

    },
    data: function () {
        return {
            stepCode: Config.stepCode.auditComplete,
            dialogVisible: false,
            noteFormVisible: false,
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                operWidth: 100,
                cols: [
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '220'},
                    {prop: 'assigned.thirdPartyName', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                    {prop: 'submissionPrice', label: '送审金额', width: '150'},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '150'},
                    {prop: 'auditFee', label: '审计费用', width: '150'},
                ],
                oper: [{
                    class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                    tip: {
                        content: '查看',
                        placement: 'top'
                    },
                    event: this.editRow,
                },
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
                        tip: {
                            content: '生成通知单',
                            placement: 'top'
                        },
                        event: this.genNoteForm,
                    },
                ]
            },
        }
    },
    methods: {
        genNoteForm: function (row) {
            this.noteFormVisible = false
            this.dialogVisible = false
            this.noteFormVisible = true
            this.formId = row.id
        },
        editRow: function (row) {
            this.noteFormVisible = false
            this.dialogVisible = false
            this.dialogVisible = true
            this.formId = row.id
        },
        operSuccess() {
            this.dialogVisible = false
            this.noteFormVisible = false;
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
        AuditNoteForm,
        TableComponent,
        SubmissionForm,
        SubmissionQuery
    }
}
</script>

<style scoped>

</style>
