<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
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
                    <el-button type="success" @click="batchAudit(1)">批量审核通过</el-button>
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
import Common from '../script/common'

import {Notification} from "element-ui";
import ConstructionUnit from "../script/server/constructionUnit";

export default {
    name: "AuditProject",
    created: function () {

    },
    mounted() {
        ProjectAudit.comp = this
        this.formOpers = ProjectAudit.buttons
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
    data: function () {
        return {
            dialogVisible: false,
            query: {
                projectName: '',
                itemCode: '',
                auditNo: '',
                contractNo: '',
                constructionUnit: '',
                contractMoney: '',
            },
            units: [],
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
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '150'},
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
            data['status'] = Config.stepCode.auditProject
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                res.list.content.forEach(d => {
                    console.log(d.constructionUnit)
                    console.log(this.units)
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