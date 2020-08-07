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
                    <el-button type="success" @click="batchAlloc">分配</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="submissionFormVisible"
                         v-bind:from="'editform'"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'alloc'"
                         v-bind:formId="formId">
        </submission-form>
        <alloc-form v-bind:visible="allocFormVisible"
                    v-bind:checks="checks"
                    v-bind:commitCallback="commitCallback"
                    v-bind:listComp="listComp">
        </alloc-form>
    </div>
</template>
<script>

import AllocForm from "./AllocForm"
import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import Config from "../script/config";
import Audit from "../script/server/audit";
import {Notification} from "element-ui";

export default {
    name: "MissionAlloc",
    created: function () {

    },
    mounted() {
        this.list()
    },
    data: function () {
        return {
            query: {
                projectName: '',
            },
            allocFormVisible: false,
            submissionFormVisible: false,
            opers: [
                {name: '分配', color: 'success', event: this.batchAlloc}
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
                    {prop: 'itemCode', label: '项目立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目名称', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位名称', width: '220'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
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
        },
        commitCallback(form) {
            console.log(form)
            this.operSuccess()
        },
        batchAlloc() {
            if (this.listChecks.length === 0) {
                Notification.error({
                    title: '操作失败!',
                    message: '请先选择行！',
                    duration: 3000
                })
            } else {
                this.allocFormVisible = false
                this.allocFormVisible = true
            }
        },
        editRow: function (row) {
            this.submissionFormVisible = false
            this.submissionFormVisible = true
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
            data['status'] = Config.stepCode.auditProject
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
        operSuccess() {
            this.allocFormVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.list({page: 1})
        }
    },
    components: {TableComponent, SubmissionForm, AllocForm}
}
</script>

<style scoped>

</style>