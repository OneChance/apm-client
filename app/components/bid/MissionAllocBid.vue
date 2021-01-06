<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query"
                       v-bind:tableConfigObject="tableConfig"
                       v-bind:stepCode="stepCode"
                       v-bind:needExport="true"
                       v-bind:buttons="buttons"
                       v-bind:checkedList="listChecks">
            </bid-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <bid-form v-bind:visible="bidFormVisible"
                  v-bind:from="'editform'"
                  v-bind:formOpers="formOpers"
                  v-bind:step="'alloc'"
                  v-bind:stepCode="stepCode"
                  v-bind:formId="formId">
        </bid-form>
        <alloc-form v-bind:visible="allocFormVisible"
                    v-bind:commitCallback="commitCallback">
        </alloc-form>
    </div>
</template>
<script>

import AllocForm from "../AllocForm"
import TableComponent from "../TableComponent";
import Config from "../../script/config";
import {Notification} from "element-ui";
import ClientCall from "../../script/client/bid/clientCall";
import BidForm from "./BidForm";
import BidQuery from "./BidQuery";

export default {
    name: "MissionAllocBid",
    created: function () {

    },
    mounted() {

    },
    data: function () {
        return {
            stepCode: Config.stepCodeBid.alloced,
            allocFormVisible: false,
            bidFormVisible: false,
            opers: [
                {name: '分配', color: 'success', event: this.batchAlloc}
            ],
            buttons: [
                /*{name: '分配', color: 'success', event: this.batchAllocAgree},
                {name: '打回', color: 'danger', event: this.batchAllocReject},*/
            ],
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
                ]
            },
            listChecks: [],
            listComp: {}
        }
    },
    methods: {
        checkBoxChange(val) {
            this.listChecks = val
            this.bidFormVisible = false
            this.allocFormVisible = false
        },
        commitCallback(form) {
            ClientCall.batchAlloc(form, this.listChecks.map(form => form.id), 1).then(() => {
                this.operSuccess()
            })
        },
        batchAllocAgree() {
            this.batchAlloc(1)
        },
        batchAllocReject() {
            this.batchAlloc(0)
        },
        batchAlloc(approve) {
            if (this.listChecks.length === 0) {
                Notification.error({
                    title: '操作失败!',
                    message: '请先选择行！',
                    duration: 3000
                })
            } else {
                if (approve === 1) {
                    this.bidFormVisible = false
                    this.allocFormVisible = false
                    this.allocFormVisible = true
                } else {
                    ClientCall.batchAlloc(null, this.listChecks.map(form => form.id), 0).then(() => {
                        this.operSuccess()
                    })
                }
            }
        },
        editRow: function (row) {
            this.allocFormVisible = false
            this.bidFormVisible = false
            this.bidFormVisible = true
            this.formId = row.id
        },
        operSuccess() {
            this.allocFormVisible = false
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
    components: {TableComponent, BidForm, AllocForm, BidQuery}
}
</script>

<style scoped>

</style>