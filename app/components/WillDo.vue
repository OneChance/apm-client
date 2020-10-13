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
                    <el-button type="success" @click="batchOper(1)">批量处理</el-button>
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
                         v-bind:formRules="forms.submission.rules"
                         v-bind:formRules2="forms.submission.rules2"
                         v-bind:stepCode="forms.submission.stepCode"
                         v-bind:step="forms.submission.step" v-bind:formId="formId">
        </submission-form>
        <alloc-form v-bind:visible="forms.alloc.visible" v-bind:commitCallback="allocCallback">
        </alloc-form>
        <bid-form v-bind:visible="forms.bid.visible"
                  v-bind:from="'editform'"
                  v-bind:formOpers="forms.bid.formOpers"
                  v-bind:formRules="forms.bid.rules"
                  v-bind:stepCode="forms.bid.stepCode"
                  v-bind:step="forms.bid.step" v-bind:formId="formId">
        </bid-form>
    </div>
</template>

<script>
import TableComponent from "./TableComponent";
import SubmissionForm from "./project/SubmissionForm";
import AllocForm from "./AllocForm";
import Common from '../script/common'
import ClientCallProject from "../script/client/project/clientCall"
import ClientCallBid from "../script/client/bid/clientCall"
import ClientCall from "../script/client/clientCall"
import Config from "../script/config";
import {
    Notification
} from "element-ui";
import ProjectAuditProject from "../script/client/project/projectOper"
import AllocApproveProject from "../script/client/project/allocApproveOper"
import RejectedOperProject from "../script/client/project/rejectedOper"
import SurveyPrepare from "../script/client/project/surveyPrepare.js"
import Survey from "../script/client/project/survey.js"
import Argue from "../script/client/project/argue.js"
import AuditFirstProject from "../script/client/project/auditFirst.js"
import AuditSecondProject from "../script/client/project/auditSecond.js"
import ArgueResolve from "../script/client/project/argueResolve"

import BidForm from "./bid/BidForm";
import ProjectAuditBid from "../script/client/bid/projectOper"
import AllocApproveBid from "../script/client/bid/allocApproveOper"
import RejectedOperBid from "../script/client/bid/rejectedOper"
import AuditFirstBid from "../script/client/bid/auditFirst.js"
import AuditSecondBid from "../script/client/bid/auditSecond.js"

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
                    stepCode: '',
                    rules: [],
                    rules2: [],
                },
                bid: {
                    visible: false,
                    formOpers: [],
                    step: '',
                    stepCode: '',
                    rules: [],
                    rules2: [],
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
                cols: [
                    {
                        prop: 'targetStr',
                        label: '送审类型',
                        width: '150',
                    },
                    {
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
                        prop: 'createTime',
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
            clientCall: {'submission': ClientCallProject, 'bid': ClientCallBid},
            projectAudit: {'submission': ProjectAuditProject, 'bid': ProjectAuditBid},    //不同类型的送审表调用各自的立项审计脚本
            allocApprove: {'submission': AllocApproveProject, 'bid': AllocApproveBid},
            rejectedOper: {'submission': RejectedOperProject, 'bid': RejectedOperBid},
            auditFirst: {'submission': AuditFirstProject, 'bid': AuditFirstBid},
            auditSecond: {'submission': AuditSecondProject, 'bid': AuditSecondBid},
            stepCode: {'submission': Config.stepCode, 'bid': Config.stepCodeBid},
            currentType: '',
        }
    },
    methods: {
        allocCallback(form) {
            let type = this.listChecks[0].target
            this.clientCall[type].batchAlloc(form, this.listChecks.map(form => form.targetId), 1).then(() => {
                this.operSuccess()
            })
        },
        checkBoxChange(val) {
            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
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
                let typeSet = new Set()
                this.listChecks.forEach(c => {
                    stageSet.add(c.stage)
                    typeSet.add(c.target)
                })
                if (typeSet.size > 1) {
                    Notification.error({
                        title: '操作失败!',
                        message: '选中的待办属于不同类型送审表,无法批量处理！',
                        duration: 3000
                    })
                } else if (stageSet.size > 1) {
                    Notification.error({
                        title: '操作失败!',
                        message: '选中的待办处于不同阶段,无法批量处理！',
                        duration: 3000
                    })
                } else {
                    let stage = this.listChecks[0].stage
                    let type = this.listChecks[0].target
                    if (stage === 'project') { //批量审核立项
                        if (approve === 0) {
                            this.clientCall[type].batchAudit(approve, this.listChecks.map(form => form.targetId)).then(result => {
                                if (result) {
                                    this.operSuccess()
                                }
                            })
                        } else {
                            Notification.error({
                                title: '操作失败!',
                                message: '审计立项阶段需要填写审计编号,不可批量审核同意！',
                                duration: 3000
                            })
                        }
                    } else if (stage === 'distribution') { //批量分配
                        if (approve === 1) {
                            this.forms.submission.visible = false
                            this.forms.alloc.visible = false
                            this.forms.alloc.visible = true
                        } else {
                            this.clientCall[type].batchAlloc(null, this.listChecks.map(form => form.targetId), 0).then(() => {
                                this.operSuccess()
                            })
                        }
                    } else if (stage === 'check') { //批量审核分配
                        this.clientCall[type].batchAllocApprove('', this.listChecks.map(form => form.targetId), approve).then(() => {
                            this.operSuccess()
                        })
                    } else if (stage === 'complete') {
                        if (approve === 1) {//批量归档
                            this.clientCall[type].batchArc('', this.listChecks.map(form => form.targetId), approve).then(() => {
                                this.operSuccess()
                            })
                        } else {//批量打回复审
                            this.clientCall[type].batchBackToAuditSecond('', this.listChecks.map(form => form.targetId), approve).then(() => {
                                this.operSuccess()
                            })
                        }
                    } else if (stage === 'filed') {
                        if (approve === 1) {
                            Notification.error({
                                title: '操作失败!',
                                message: '归档阶段无法进入下一阶段！',
                                duration: 3000
                            })
                        } else {//批量打回完成
                            this.clientCall[type].batchBackToComplete('', this.listChecks.map(form => form.targetId), approve).then(() => {
                                this.operSuccess()
                            })
                        }
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
        stepNameConvert(serverStage) {
            switch (serverStage) {
                case 'distribution':
                    return 'alloced';
                case 'check':
                    return 'assigned';
                case 'survey_prepare':
                    return 'surveyPrepare';
                case 'survey_scene':
                    return 'survey';
                case 'argue':
                    return 'argueHandle';
                case 'argue_reject':
                    return 'argueDeal';
                case 'audit_first':
                    return 'auditFirst';
                case 'audit_second':
                    return 'auditSecond';
                case 'complete':
                    return 'auditComplete';
                case 'filed':
                    return 'auditArc';
                default:
                    return serverStage;
            }
        },
        editRow: function (row) {

            let step = this.stepNameConvert(row.stage)
            let type = row.target

            this.forms[type].step = step

            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
            this.forms[type].visible = true

            if (step === 'project') {
                this.projectAudit[type].comp = this //设置当前组件,用于回调刷新列表方法
                this.forms[type].formOpers = this.projectAudit[type].buttons
                this.forms[type].rules = this.projectAudit[type].rules
            } else if (step === 'assigned') {
                this.allocApprove[type].comp = this
                this.forms[type].formOpers = this.allocApprove[type].buttons
            } else if (step === 'reject') {
                this.rejectedOper[type].comp = this
                this.forms[type].formOpers = this.rejectedOper[type].buttons
                this.forms[type].rules = this.rejectedOper[type].rules
                this.forms[type].rules2 = this.rejectedOper[type].rules2
            } else if (step === 'surveyPrepare') {
                SurveyPrepare.comp = this
                this.forms.submission.formOpers = SurveyPrepare.buttons
                this.forms.submission.rules = SurveyPrepare.rules
            } else if (step === 'survey') {
                Survey.comp = this
                this.forms.submission.formOpers = Survey.buttons
            } else if (step === 'argueHandle') {
                Argue.comp = this
                this.forms.submission.formOpers = Argue.buttons
            } else if (step === 'argueDeal') {
                ArgueResolve.comp = this
                this.forms.submission.formOpers = ArgueResolve.buttons
            } else if (step === 'auditFirst') {
                this.auditFirst[type].comp = this
                this.forms[type].formOpers = this.auditFirst[type].buttons
                this.forms[type].rules = this.auditFirst[type].rules
            } else if (step === 'auditSecond') {
                this.auditSecond[type].comp = this
                this.forms[type].formOpers = this.auditSecond[type].buttons
                this.forms[type].rules = this.auditSecond[type].rules
            } else {
                this.forms[type].formOpers = []
            }
            this.formId = row.targetId
            this.forms[type].stepCode = this.stepCode[type][step]
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
            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
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
        AllocForm,
        BidForm
    }
}
</script>

<style scoped>

</style>
