<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.workitemName" placeholder="待办名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="batchOper(1)">批量审核通过</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="batchOper(0)">批量打回</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="forms.submission.visible" v-bind:from="'editform'"
                         v-bind:formOpers="forms.submission.formOpers"
                         v-bind:step="forms.submission.step" v-bind:formId="formId">
        </submission-form>
        <alloc-form v-bind:visible="forms.alloc.visible" v-bind:commitCallback="allocCallback">
        </alloc-form>
    </div>
</template>

<script>
import TableComponent from "./TableComponent";
import SubmissionForm from "./SubmissionForm";
import AllocForm from "./AllocForm";
import Common from '../script/common'
import ClientCall from "../script/client/clientCall"
import Config from "../script/config";
import {
    Notification
} from "element-ui";
import ProjectAudit from "../script/client/projectOper"
import AllocApprove from "../script/client/allocApproveOper"
import RejectedOper from "../script/client/rejectedOper"
import SurveyPrepare from "../script/client/surveyPrepare.js"
import Survey from "../script/client/survey.js"
import Argue from "../script/client/argue.js"
import AuditFirst from "../script/client/auditFirst.js"
import AuditSecond from "../script/client/auditSecond.js"

export default {
    name: "WillDo",
    created: function () {

    },
    mounted() {
        this.list()
    },
    data: function () {
        return {
            query: {
                workitemName: '',
            },
            forms: {
                alloc: {
                    visible: false
                },
                submission: {
                    visible: false,
                    formOpers: [],
                    step: '',
                }
            },
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkBoxChange: this.checkBoxChange,
                checkable: true,
                cols: [{
                    prop: 'stageStr',
                    label: '待办名称',
                    width: '150'
                },
                    {
                        prop: 'creator.name',
                        label: '送审人',
                        width: '150'
                    },
                    {
                        prop: 'creator.createTime',
                        label: '送审时间',
                        width: '250'
                    },
                ],
                oper: [{
                    class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
                    tip: {
                        content: '查看',
                        placement: 'top'
                    },
                    event: this.editRow,
                },],
            },
            listChecks: [],
            formId: -1,
        }
    },
    methods: {
        allocCallback(form) {
            ClientCall.batchAlloc(form, this.listChecks.map(form => form.targetId), 1).then(result => {
                this.operSuccess()
            })
        },
        checkBoxChange(val) {
            this.listChecks = val
        },
        batchOper(approve) { //待办的批量处理
            if (this.listChecks.length === 0) {
                Notification.error({
                    title: '操作失败!',
                    message: '请先选择行！',
                    duration: 3000
                })
            } else {
                let stageSet = new Set()
                this.listChecks.forEach(c => {
                    stageSet.add(c.stage)
                })
                if (stageSet.size > 1) {
                    Notification.error({
                        title: '操作失败!',
                        message: '选中的待办处于不同阶段,无法批量处理！',
                        duration: 3000
                    })
                } else {
                    let stage = this.listChecks[0].stage
                    if (stage === 'project') { //批量审核立项
                        ClientCall.batchAudit(approve, this.listChecks.map(form => form.targetId)).then(result => {
                            if (result) {
                                this.operSuccess()
                            }
                        })
                    } else if (stage === 'distribution') { //批量分配
                        if (approve === 1) {
                            this.forms.submission.visible = false
                            this.forms.alloc.visible = false
                            this.forms.alloc.visible = true
                        } else {
                            ClientCall.batchAlloc(null, this.listChecks.map(form => form.targetId), 0).then(result => {
                                this.operSuccess()
                            })
                        }
                    } else if (stage === 'check') { //批量审核分配
                        ClientCall.batchAllocApprove('', this.listChecks.map(form => form.targetId), approve).then(result => {
                            this.operSuccess()
                        })
                    } else if (['reject', 'survey_prepare', 'survey_scene', 'argue', 'audit_first', 'audit_second'].indexOf(stage) !== -1) {
                        Notification.error({
                            title: '操作失败!',
                            message: '当前阶段不可批量操作！',
                            duration: 3000
                        })
                    }
                }
            }
        },
        editRow: function (row) { //待办的单据处理
            //根据待办类型生成form
            this.forms.alloc.visible = false
            this.forms.submission.visible = false
            this.forms.submission.visible = true
            let step = row.stage

            if (row.stage === 'check') {
                step = 'assigned'
            } else if (row.stage === 'survey_prepare') {
                step = 'surveyPrepare'
            } else if (row.stage === 'survey_scene') {
                step = 'survey'
            } else if (row.stage === 'argue') {
                step = 'argueHandle'
            } else if (row.stage === 'audit_first') {
                step = 'auditFirst'
            } else if (row.stage === 'audit_second') {
                step = 'auditSecond'
            }

            this.forms.submission.step = step

            if (step === 'project') {
                ProjectAudit.comp = this //设置当前组件,用于回调刷新列表方法
                this.forms.submission.formOpers = ProjectAudit.buttons
            } else if (step === 'assigned') {
                AllocApprove.comp = this
                this.forms.submission.formOpers = AllocApprove.buttons
            } else if (step === 'reject') {
                RejectedOper.comp = this
                this.forms.submission.formOpers = RejectedOper.buttons
            } else if (step === 'surveyPrepare') {
                SurveyPrepare.comp = this
                this.forms.submission.formOpers = SurveyPrepare.buttons
            } else if (step === 'survey') {
                Survey.comp = this
                this.forms.submission.formOpers = Survey.buttons
            } else if (step === 'argueHandle') {
                Argue.comp = this
                this.forms.submission.formOpers = Argue.buttons
            } else if (step === 'auditFirst') {
                AuditFirst.comp = this
                this.forms.submission.formOpers = AuditFirst.buttons
            } else if (step === 'auditSecond') {
                AuditSecond.comp = this
                this.forms.submission.formOpers = AuditSecond.buttons
            } else {
                this.forms.submission.formOpers = []
            }
            this.formId = row.targetId
        },
        queryList: function () {
            this.list(this.query)
        },
        toPage: function (val) {
            this.list({
                page: val
            })
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            ClientCall.getWillDo(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
        operSuccess() {
            this.forms.submission.visible = false
            this.forms.alloc.visible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.list({
                page: 1
            })
        }
    },
    components: {
        TableComponent,
        SubmissionForm,
        AllocForm
    }
}
</script>

<style scoped>

</style>
