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
                <i class="fa fa-plus-circle fa-2x right-fa primary-fa" aria-hidden="true"
                   @click="add"></i>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formRules="rules"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'submission'"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import {Notification} from "element-ui";
import Audit from "../script/server/audit";
import Config from "../script/config";

export default {
    name: "AuditSubmission",
    created: function () {

    },
    mounted() {
        this.list()
    },
    watch: {},
    data: function () {
        return {
            query: {
                projectName: '',
            },
            dialogVisible: false,
            from: '',
            formId: -1,
            formOpers: [
                {name: '保存', color: 'primary', event: this.saveSubmission},
                {name: '提交', color: 'success', event: this.commitSubmission}
            ],
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
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.deleteRow,
                        check: true
                    }
                ]
            },
            rules: {
                projectName: [
                    {required: true, message: '请输入工程项目名称', trigger: 'blur'},
                ],
                constructionUnit: [
                    {required: true, message: '请输入施工单位名称', trigger: 'blur'},
                ],
                budget: [
                    {required: true, message: '请填写预算', trigger: 'blur'},
                    {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                ],
                contractMoney: [
                    {required: true, message: '请填写中标或合同金额', trigger: 'blur'},
                    {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                ],
                startDate: [
                    {required: true, message: '请选择开工时间', trigger: 'blur'}
                ],
                endDate: [
                    {required: true, message: '请选择竣工时间', trigger: 'blur'}
                ],
                materialGroup: [
                    {required: true, message: '请选择资料清单组', trigger: 'blur'},
                ],
            },
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
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        deleteRow: function (row) {
            let comp = this
            Audit.deleteSubmission({id: row.id}).then(result => {
                comp.$message({
                    message: '删除成功',
                    type: 'success'
                });
                comp.list({page: 1})
            })
        },
        saveSubmission: function (form) {
            this.commitForm(-10, form)
        },
        commitSubmission: function (form) {
            this.commitForm(10, form)
        },
        commitForm(code, form) {
            //验证附件上传情况
            for (let type of form.details) {
                if (type.mRequired) {
                    if ((!type.mFiles || type.mFiles.length === 0) && (!type.mNote || type.mNote.match(/^[ ]*$/))) {
                        Notification.error({
                            title: '提交失败!',
                            message: type.mName + '必须上传附件或填写备注！',
                            duration: 5000
                        })
                        return
                    }
                }
            }
            //附件列表转换为serverId字符串
            for (let types of form.details) {
                let ids = ''
                for (let file of types.mFiles) {
                    ids = ids + ',' + file.id
                }
                types.mFileIds = ids.substr(1)
            }
            //设置状态
            form.status = code
            Audit.saveSubmission(form).then(result => {
                if (result) {
                    this.operSuccess()
                }
            })
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
            data['status'] = Config.stepCode.submissionSave
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