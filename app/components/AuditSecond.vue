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
            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="'editform'"
                         v-bind:formRules="rules"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'auditSecond'"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import AuditSecond from '../script/client/auditSecond'
import Config from "../script/config";
import Audit from "../script/server/audit";
import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import FormValidator from '../script/client/formValidator'

export default {
    name: "AuditSecond",
    mounted: function () {
        AuditSecond.comp = this
        this.list()
    },
    data: function () {
        return {
            query: {
                projectName: '',
            },
            dialogVisible: false,
            formOpers: AuditSecond.buttons,
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {prop: 'itemCode', label: '项目立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目名称', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位名称', width: '220'},
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
                secondAuditPrice: [
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
            data['status'] = Config.stepCode.auditSecond
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
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
    components: {
        TableComponent,
        SubmissionForm
    }
}
</script>

<style scoped>

</style>