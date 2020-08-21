<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model='query' ref='query' class="demo-form-inline">
                <el-form-item prop="status">
                    <el-select v-model="query.status" filterable placeholder="审计状态" style="width: 110px;">
                        <el-option
                            v-for="status in statusList"
                            :key="status.value"
                            :label="status.label"
                            :value="status.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="itemCode">
                    <el-input v-model="query.itemCode" placeholder="立项代码" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item prop="auditNo">
                    <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item prop="contractNo">
                    <el-input v-model="query.contractNo" placeholder="合同编码" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item prop="projectName">
                    <el-input v-model="query.projectName" placeholder="工程项目" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item prop="constructionUnit">
                    <el-select v-model="query.constructionUnit" filterable placeholder="施工单位" style="width: 220px;">
                        <el-option
                            v-for="unit in units"
                            :key="unit.value"
                            :label="unit.label"
                            :value="unit.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="contractMoney">
                    <el-input v-model="query.contractMoney" placeholder="中标/合同金额" style="width: 120px;"></el-input>
                </el-form-item>

                <el-button type="primary" @click="queryList">查询</el-button>
                <el-button @click="$refs['query'].resetFields()">重置</el-button>
                <el-button type="success" @click="batchAlloc(1)">分配</el-button>
                <el-button type="danger" @click="batchAlloc(0)">打回</el-button>

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
                    v-bind:commitCallback="commitCallback">
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
import ClientCall from "../script/client/clientCall";
import Common from '../script/common'
import ConstructionUnit from "../script/server/constructionUnit";

export default {
    name: "MissionAlloc",
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
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '150'},
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
            ClientCall.batchAlloc(form, this.listChecks.map(form => form.id), 1).then(result => {
                this.operSuccess()
            })
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
                    this.submissionFormVisible = false
                    this.allocFormVisible = false
                    this.allocFormVisible = true
                } else {
                    ClientCall.batchAlloc(null, this.listChecks.map(form => form.id), 0).then(result => {
                        this.operSuccess()
                    })
                }
            }
        },
        editRow: function (row) {
            this.allocFormVisible = false
            this.submissionFormVisible = false
            this.submissionFormVisible = true
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
            data['status'] = Config.stepCode.alloced
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