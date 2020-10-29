<template>
    <div class="card-content">
        <el-card class="box-card">
            <!--<el-form :inline="true" class="demo-form-inline query-form">
                <el-form-item>
                    <el-input v-model="query.workitemName" placeholder="待办名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                </el-form-item>
            </el-form>-->
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
                cols: [
                    {
                        prop: 'targetStr',
                        label: '送审类型',
                        width: '100',
                    },
                    {
                        prop: 'auditNo',
                        label: '审计编号',
                        width: '100',
                    },
                    {
                        prop: 'projectName',
                        label: '项目名称',
                    },
                    {
                        prop: 'creator.name',
                        label: '送审人',
                        width: '100'
                    },
                    {
                        prop: 'createTime',
                        label: '送审时间',
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
                operWidth: 80
            },
            listChecks: [],
            formId: -1,
            currentType: '',
        }
    },
    methods: {
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

            this.formId = row.targetId
            if (type === 'submission') {
                this.forms[type].stepCode = 100
            } else if (type === 'bid') {
                this.forms[type].stepCode = 70
            }
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
            ClientCall.getDone(data).then(res => {
                //如果以后多选框,清除所选数据
                this.listChecks = []
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
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
