<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="query.status" filterable placeholder="审计状态" style="width: 110px;">
                        <el-option
                            v-for="status in statusList"
                            :key="status.value"
                            :label="status.label"
                            :value="status.value">
                        </el-option>
                    </el-select>
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
                    <el-select v-model="query.assignName" filterable placeholder="中介机构" style="width: 200px;">
                        <el-option
                            v-for="inter in inters"
                            :key="inter.value"
                            :label="inter.label"
                            :value="inter.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="query.auditType" filterable placeholder="审计方式" style="width: 110px;">
                        <el-option
                            v-for="aType in auditTypes"
                            :key="aType.value"
                            :label="aType.label"
                            :value="aType.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="query.submissionPrice" placeholder="送审金额" style="width: 120px;"></el-input>
                    <el-input v-model="query.secondAuditPrice" placeholder="审定金额" style="width: 120px;"></el-input>
                    <el-input v-model="query.auditFee" placeholder="审计费用" style="width: 120px;"></el-input>
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
import Common from '../script/common'
import AuditFirst from "../script/client/auditFirst";
import User from "../script/server/user";
import ConstructionUnit from "../script/server/constructionUnit";

export default {
    name: "AuditSecond",
    mounted: function () {
        AuditSecond.comp = this
        this.list()
        User.getUsers({
            page: 1,
            pageSize: 999999,
            thirdParty: true
        }).then(res => {
            this.inters = []
            res.list.content.forEach(user => {
                this.inters.push({
                    value: user.id,
                    label: user.thirdPartyName
                })
            })
        })
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
        })
    },
    data: function () {
        return {
            query: {
                projectName: '',
                status: '',
                itemCode: '',
                auditNo: '',
                contractNo: '',
                constructionUnit: '',
                contractMoney: '',
                assignName: '',
                auditType: '',
                submissionPrice: '',
                secondAuditPrice: '',
                auditFee: '',
            },
            units: [],
            inters: [],
            auditTypes: [
                {value: 'in', label: '内审'},
                {value: 'out', label: '外审'},
            ],
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
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '220'},
                    {prop: 'assigned.thirdPartyName', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                    {prop: 'submissionPrice', label: '送审金额', width: '150'},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '150'},
                    {prop: 'auditFee', label: '审计费用', width: '150'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editRow,
                    },
                ]
            },
            rules: AuditSecond.rules
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
            let data = Common.copyObject(Config.page)
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