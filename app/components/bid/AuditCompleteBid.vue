<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query"
                       v-bind:tableConfigObject="tableConfig"
                       v-bind:buttons="buttons"
                       v-bind:stepCode="stepCode"
                       v-bind:checkedList="listChecks">
            </bid-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <bid-form v-bind:visible="dialogVisible"
                  v-bind:from="'editform'"
                  v-bind:step="'auditArc'"
                  v-bind:stepCode="stepCode"
                  v-bind:formId="formId">
        </bid-form>
        <note-form v-bind:visible="noteFormVisible" v-bind:formId="formId"></note-form>
    </div>
</template>

<script>
import NoteForm from './NoteForm'
import Config from "../../script/config";
import TableComponent from "../TableComponent";
import BidForm from "./BidForm";
import BidQuery from "./BidQuery";
import ClientCall from "../../script/client/bid/clientCall";

export default {
    name: "AuditCompleteBid",
    mounted: function () {

    },
    data: function () {
        return {
            stepCode: Config.stepCodeBid.auditComplete,
            dialogVisible: false,
            noteFormVisible: false,
            buttons: [
                {name: '归档', color: 'success', event: this.batchArc},
                {name: '退回', color: 'danger', event: this.batchBackToAuditSecond},
            ],
            listChecks: [],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkBoxChange: this.checkBoxChange,
                checkable: true,
                operWidth: 100,
                cols: [
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'assigned.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                    {prop: 'submissionPrice', label: '送审金额', width: '150'},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '150'},
                ],
                oper: [
                    {
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
                ],
            },
        }
    },
    methods: {
        checkBoxChange(val) {
            this.listChecks = val
        },
        batchArc: function () {
            ClientCall.batchArc('', this.listChecks.map(form => form.id), 1).then(() => {
                this.operSuccess()
            })
        },
        batchBackToAuditSecond: function () {
            ClientCall.batchBackToAuditSecond('', this.listChecks.map(form => form.id), 0).then(() => {
                this.operSuccess()
            })
        },
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
        NoteForm,
        TableComponent,
        BidForm, BidQuery
    }
}
</script>

<style scoped>

</style>
