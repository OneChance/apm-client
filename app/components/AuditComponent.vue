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
                <el-form-item v-for="oper in opers" :key="oper.name">
                    <el-button :type="oper.color" @click="batchOper(oper.event)">{{ oper.name }}</el-button>
                </el-form-item>
                <i class="fa fa-plus-circle fa-2x right-fa primary-fa" aria-hidden="true" v-if="step==='submission'"
                   @click="add"></i>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formOpers="formOpers"
                         v-bind:step="step"
                         v-bind:operSuccess="operSuccess"
                         v-bind:parentComp="this"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>


import {Notification} from 'element-ui';
import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import Audit from "../script/server/audit";
import Config from "../script/config"

export default {
    name: "AuditComponent",
    props: ['step', 'opers', 'formOpers', 'customTableConfig', 'formRules', 'cols'],
    data: function () {
        return {
            dialogVisible: false,
            reset: false,
            query: {
                projectName: '',
            },
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkBoxChange: this.checkBoxChange,
                checkable: false,
                cols: [
                    {prop: 'itemCode', label: '项目立项代码', width: '150'},
                    {prop: 'auditNo', label: '审计编号', width: '150'},
                    {prop: 'projectName', label: '工程项目名称', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位名称', width: '220'},
                ],
                oper: []
            },
            listChecks: [],
            formId: -1,
        }
    },
    created: function () {

    },
    mounted() {
        this.list()
        //初始化表格属性
        for (let prop in this.customTableConfig) {
            this.tableConfig[prop] = this.customTableConfig[prop]
        }
        //因为需要调用的方法在当前组件中,所以父组件只能传递字符串,根据字符串判定需要调用当前组件上的哪一个方法
        for (let oper of this.tableConfig.oper) {
            if (oper.event === 'edit') {
                oper.event = this.editRow
            } else if (oper.event === 'delete') {
                oper.event = this.deleteRow
            }
        }
        //初始化表单验证规则
        this.rules = this.formRules
        //初始化表格字段
        if (this.cols) {
            this.tableConfig.cols = this.cols
        }
    },
    methods: {
        batchOper: function (event) {
            if (this.listChecks.length === 0) {
                Notification.error({
                    title: '操作失败!',
                    message: '请先选择行！',
                    duration: 3000
                })
            } else {
                event(this.listChecks, this)
            }
        },
        queryList: function () {
            this.list(this.query)
        },
        add: function () {
            //子组件关闭后visible值不能回传,所以在父组件里重置下,触发变化
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'addform'
        },
        editRow: function (row) {
            let comp = this
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
        toPage: function (val) {
            this.list({page: val})
        },
        list(config) {
            let data = {...Config.page}

            for (let prop in config) {
                data[prop] = config[prop]
            }
            //根据审计阶段,设置状态过滤条件
            switch (this.step) {
                case 'submission':
                    data['status'] = Config.stepCode.submissionSave
                    break
                case 'project':
                    data['status'] = Config.stepCode.submissionCommit
                    break
                case 'missionAlloc':
                    data['status'] = Config.stepCode.auditProject
                    break
            }

            this.tableConfig.currentPage = data.page
            Audit.getSubmissions(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
        checkBoxChange(val) {
            this.listChecks = val
        },
        operSuccess(comp) {
            comp.dialogVisible = false
            comp.$message({
                message: '操作成功',
                type: 'success'
            });
            comp.list({page: 1})
        }
    },
    components: {TableComponent, SubmissionForm}
}
</script>

<style scoped>

</style>