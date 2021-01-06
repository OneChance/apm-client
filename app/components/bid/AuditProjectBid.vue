<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query"
                       v-bind:tableConfigObject="tableConfig"
                       v-bind:stepCode="stepCode"
                       v-bind:buttons="buttons"
                       v-bind:needExport="true"
                       v-bind:checkedList="listChecks">
            </bid-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <bid-form v-bind:visible="dialogVisible"
                  v-bind:from="'editform'"
                  v-bind:formOpers="formOpers"
                  v-bind:formRules="formRules"
                  v-bind:step="'project'"
                  v-bind:readonly="true"
                  v-bind:stepCode="stepCode"
                  v-bind:formId="formId">
        </bid-form>
    </div>
</template>

<script>

import TableComponent from "../TableComponent";
import BidForm from "./BidForm";
import ClientCall from "../../script/client/bid/clientCall"
import Config from "../../script/config";
import ProjectAudit from "../../script/client/bid/projectOper"
import BidQuery from "./BidQuery";
import {Notification} from "element-ui";

export default {
    name: "AuditProjectBid",
    created: function () {

    },
    mounted() {
        ProjectAudit.comp = this
        /*this.formOpers = ProjectAudit.buttons
        this.formRules = ProjectAudit.rules*/
    },
    data: function () {
        return {
            stepCode: Config.stepCodeBid.project,
            dialogVisible: false,
            buttons: [
                //{name: '批量审核通过', color: 'success', event: this.batchAuditAgree},
                /*{name: '批量打回', color: 'danger', event: this.batchAuditReject},*/
            ],
            formOpers: [],
            formRules: [],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkBoxChange: this.checkBoxChange,
                checkable: true,
                cols: [
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目'},
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
        }
    },
    methods: {
        batchAuditAgree() {
            this.batchAudit(1)
        },
        batchAuditReject() {
            this.batchAudit(0)
        },
        checkBoxChange(val) {
            this.listChecks = val
        },
        batchAudit(approve) {
            if (this.listChecks.length === 0) {
                Notification.error({
                    title: '操作失败!',
                    message: '请先选择行！',
                    duration: 3000
                })
            } else {
                ClientCall.batchAudit(approve, this.listChecks.map(form => form.id)).then(result => {
                    if (result) {
                        this.operSuccess()
                    }
                })
            }
        },
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
    components: {TableComponent, BidForm, BidQuery}
}
</script>

<style scoped>

</style>