<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.projectName" placeholder="工程项目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="batchAudit(1)">批量审核通过</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="batchAudit(0)">批量打回</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="'editform'"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'project'"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import ClientCall from "../script/client/clientCall"
import Config from "../script/config";
import Audit from "../script/server/audit";
import ProjectAudit from "../script/client/projectOper"

import {Notification} from "element-ui";

export default {
    name: "AuditProject",
    created: function () {

    },
    mounted() {
        this.list()
        ProjectAudit.comp = this
        this.formOpers = ProjectAudit.buttons
    },
    data: function () {
        return {
            dialogVisible: false,
            query: {
                projectName: '',
            },
            formOpers: [],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkBoxChange: this.checkBoxChange,
                checkable: true,
                cols: [
                    {prop: 'itemCode', label: '项目立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目名称', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位名称', width: '220'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '审核', placement: 'top'},
                        event: this.editRow,
                    },
                ],
            },
            listChecks: [],
            formId: -1,
        }
    },
    methods: {
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
        queryList: function () {
            this.list(this.query)
        },
        toPage: function (val) {
            this.list({page: val})
        },
        list(config) {
            let data = {...Config.page}
            for (let prop in config) {
                data[prop] = config[prop]
            }
            data['status'] = Config.stepCode.submissionCommit
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
        operSuccess() {
            this.dialogVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.list({page: 1})
        }
    },
    components: {TableComponent, SubmissionForm}
}
</script>

<style scoped>

</style>