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
                <el-form-item prop="assignedId">
                    <el-select v-model="query.assignedId" filterable placeholder="中介机构" style="width: 200px;">
                        <el-option
                            v-for="inter in inters"
                            :key="inter.value"
                            :label="inter.label"
                            :value="inter.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="auditType">
                    <el-select v-model="query.auditType" filterable placeholder="审计方式" style="width: 110px;">
                        <el-option
                            v-for="aType in auditTypes"
                            :key="aType.value"
                            :label="aType.label"
                            :value="aType.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-input v-model="query.submissionPrice" placeholder="送审金额" style="width: 120px;"></el-input>
                <el-input v-model="query.secondAuditPrice" placeholder="审定金额" style="width: 120px;"></el-input>
                <el-input v-model="query.auditFee" placeholder="审计费用" style="width: 120px;"></el-input>
                <el-button type="primary" @click="queryList">查询</el-button>

                <!--
                <el-button @click="$refs['query'].resetFields()">重置</el-button>
                -->

            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formRules="rules"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'auditArc'"
                         v-bind:formId="formId">
        </submission-form>
        <el-dialog title="附件清单"
                   class="files-down"
                   :visible.sync="fileListVisible"
                   :close-on-click-modal="false">
            <template>
                <el-table
                    border
                    ref="multipleTable"
                    :data="downFiles"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="附件类型">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="文件">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fileListVisible = false">取 消</el-button>
                <el-button type="primary" @click="downloadFiles()">下载</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import Audit from "../script/server/audit";
import Config from "../script/config";
import Common from '../script/common'
import ConstructionUnit from "../script/server/constructionUnit";
import User from "../script/server/user";
import Env from "../script/server/env"

export default {
    name: "ListAll",
    created: function () {

    },
    mounted() {
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
    watch: {},
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
                assignedId: '',
                auditType: '',
                submissionPrice: '',
                secondAuditPrice: '',
                auditFee: '',
            },
            units: [],
            inters: [],
            auditTypes: [
                {value: '内审', label: '内审'},
                {value: '外审', label: '外审'},
            ],
            statusList: [
                {value: 0, label: '所有'},
                {value: -10, label: '送审保存'},
                {value: -20, label: '送审打回'},
                {value: -30, label: '争议处理'},
                {value: 10, label: '审计立项'},
                {value: 20, label: '审计分配'},
                {value: 30, label: '分配审核'},
                {value: 40, label: '勘察准备'},
                {value: 50, label: '现场勘察'},
                {value: 60, label: '争议处理'},
                {value: 70, label: '初审'},
                {value: 80, label: '复审'},
                {value: 90, label: '完成'},
            ],
            dialogVisible: false,
            fileListVisible: false,
            from: '',
            formId: -1,
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {prop: 'status', label: '审计状态', width: '150'},
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '220'},
                    {prop: 'assigned.thirdPartyName', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                    {prop: 'submissionPrice', label: '送审金额', width: '150', sortable: true},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '150', sortable: true},
                    {prop: 'auditFee', label: '审计费用', width: '150'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.editRow,
                    },
                    {
                        class: 'fa fa-file-text-o  click-fa primary-fa',
                        tip: {content: '附件清单', placement: 'top'},
                        event: this.fileList,
                    }
                ],
                operWidth: 100,
            },
            downFiles: [],
            filesToDownload: [],
        }
    },
    methods: {
        editRow: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        fileList: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.fileListVisible = true

            Audit.getSubmission({
                id: row.id
            }).then(result => {
                this.downFiles = []
                result.submission.details.forEach(fileType => this.addToFileList(fileType))
                result.submission.surveyFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.argueFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.auditFirstFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.auditSecondFiles.forEach(fileType => this.addToFileList(fileType))
            })
        },
        addToFileList(fileType) {
            fileType.mFiles.forEach(file => {
                this.downFiles.push({
                    type: fileType.mName,
                    name: file.name,
                    url: Env.baseURL + file.url
                })
            })
        },
        handleSelectionChange(val) {
            this.filesToDownload = val;
        },
        download: function (name, href) {
            let a = document.createElement("a"), //创建a标签
                e = document.createEvent("MouseEvents"); //创建鼠标事件对象
            e.initEvent("click", false, false); //初始化事件对象
            a.href = href; //设置下载地址
            a.target = "_blank"
            a.download = name; //设置下载文件名
            a.dispatchEvent(e); //给指定的元素，执行事件click事件
        },
        downloadFiles: function () {
            this.filesToDownload.forEach(file => {
                this.download(file.name, file.url)
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
            if (!data['status']) {
                data['status'] = 0
            }
            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                res.list.content.forEach(d => {
                    d.status = this.statusList.filter(s => s.value === d.status)[0].label
                })
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