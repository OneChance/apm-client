<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-input v-model="query.itemCode" placeholder="立项代码" style="width: 150px;"></el-input>
                <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;"></el-input>
                <el-input v-model="query.contractNo" placeholder="合同编码" style="width: 150px;"></el-input>
                <el-input v-model="query.projectName" placeholder="工程项目" style="width: 300px;"></el-input>
                <el-select v-model="query.constructionUnit" filterable placeholder="施工单位" style="width: 220px;">
                    <el-option
                        v-for="unit in units"
                        :key="unit.value"
                        :label="unit.label"
                        :value="unit.value">
                    </el-option>
                </el-select>
                <el-input v-model="query.contractMoney" placeholder="中标/合同金额" style="width: 120px;"></el-input>
                <el-button type="primary" @click="queryList">查询</el-button>
                <el-button type="success" @click="add">新增</el-button>
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
import FormValidator from "../script/client/formValidator";
import Common from '../script/common'
import ConstructionUnit from "../script/server/constructionUnit";

export default {
    name: "AuditSubmission",
    created: function () {

    },
    mounted() {
        ConstructionUnit.getConstructionUnits({
            page: 1,
            pageSize: 999999,
        }).then(res => {
            this.units = []
            res.list.content.forEach(user => {
                this.units.push({
                    value: user.id,
                    label: user.name
                })
            })
            this.list()
        })
    },
    watch: {},
    data: function () {
        return {
            query: {
                projectName: '',
                itemCode: '',
                auditNo: '',
                contractNo: '',
                constructionUnit: '',
                contractMoney: '',
            },
            units: [],
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
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '150'},
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
                    {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
                ],
                contractMoney: [
                    {required: true, validator: FormValidator.priceValidator, trigger: 'blur'},
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
            let data = {page: val}
            for (let op in this.query) {
                data[op] = this.query[op]
            }
            this.list(data)
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            data['status'] = Config.stepCode.submissionSave
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                res.list.content.forEach(d => {
                    let unit = this.units.filter(u => u.value + '' === d.constructionUnit + '')[0]
                    d.constructionUnit = unit ? unit.label : ''
                })
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