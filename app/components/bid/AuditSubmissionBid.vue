<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query"
                       v-bind:tableConfigObject="tableConfig"
                       v-bind:stepCode="stepCode"
                       v-bind:needExport="true"
                       v-bind:buttons="buttons">
            </bid-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <bid-form v-bind:visible="dialogVisible"
                  v-bind:from="from"
                  v-bind:formRules="rules"
                  v-bind:formOpers="formOpers"
                  v-bind:step="'bid'"
                  v-bind:stepCode="stepCode"
                  v-bind:formId="formId">
        </bid-form>
    </div>
</template>

<script>

import TableComponent from "../TableComponent";
import Config from "../../script/config";
import BidForm from "./BidForm";
import BidQuery from "./BidQuery";
import ClientCall from "../../script/client/bid/clientCall";
import RejectedOper from "../../script/client/bid/rejectedOper"   //使用同一个校验规则

export default {
    name: "AuditSubmissionBid",
    created: function () {

    },
    mounted() {

    },
    watch: {},
    data: function () {
        return {
            stepCode: Config.stepCodeBid.save,
            dialogVisible: false,
            from: '',
            formId: -1,
            formOpers: [
                {name: '保存', color: 'primary', event: this.saveBid},
                {name: '提交', color: 'success', event: this.commitBid}
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
                    {
                        prop: 'status',
                        label: '审计状态',
                        width: '120',
                        fixed: true,
                    },
                    {prop: 'itemCode', label: '立项代码'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
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
                ],
                oper2: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '查看', placement: 'right'},
                        event: this.viewRow,
                    },
                ],
            },
            rules: RejectedOper.rules,
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
            this.from = 'editform'
            this.formId = row.id
            this.stepCode = Config.stepCodeBid.save
            this.dialogVisible = false
            this.dialogVisible = true
        },
        viewRow: function (row) {
            this.formId = row.id
            this.from = 'editform'
            this.formOpers = []
            this.stepCode = 10000
            this.dialogVisible = false
            this.dialogVisible = true
        },
        deleteRow: function (row) {
            ClientCall.deleteSubmission({id: row.id}).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.$refs.query.list({page: 1})
            })
        },
        saveBid: function (form) {
            ClientCall.saveSubmission(form).then(result => {
                if (result) {
                    this.operSuccess()
                }
            })
        },
        commitBid: function (form) {
            ClientCall.startSubmission(form).then(result => {
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
    components: {TableComponent, BidForm, BidQuery}
}
</script>

<style scoped>

</style>