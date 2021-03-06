<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix header" v-if="formName">
                <el-row>
                    <el-col :span="6"><span class="sign-title">{{ name }}</span></el-col>
                    <el-col :span="2" :offset="16">
                        <el-button type="info" plain size="mini" @click="more()">更多</el-button>
                    </el-col>
                </el-row>
            </div>
            <workitem-query ref="query"
                            v-bind:formName="formName"
                            v-bind:tableConfigObject="tableConfig"
                            v-bind:buttons="buttons"
                            v-bind:checkedList="checkedList"
                            v-bind:type="type">
            </workitem-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="forms.submission.visible" v-bind:from="'editform'"
                         v-bind:formOpers="forms.submission.formOpers"
                         v-bind:formRules="forms.submission.rules"
                         v-bind:formRules2="forms.submission.rules2"
                         v-bind:stepCode="forms.submission.stepCode"
                         v-bind:step="forms.submission.step" v-bind:formId="formId" v-bind:formName="formName">
        </submission-form>
        <bid-form v-bind:visible="forms.bid.visible"
                  v-bind:from="'editform'"
                  v-bind:formOpers="forms.bid.formOpers"
                  v-bind:formRules="forms.bid.rules"
                  v-bind:stepCode="forms.bid.stepCode"
                  v-bind:step="forms.bid.step" v-bind:formId="formId" v-bind:formName="formName">
        </bid-form>
    </div>
</template>

<script>
import TableComponent from "./TableComponent";
import SubmissionForm from "./project/SubmissionForm";
import AllocForm from "./AllocForm";
import BidForm from "./bid/BidForm";
import WorkitemQuery from "./WorkitemQuery";
import ClientCallCommon from "../script/client/clientCall";

export default {
    name: "Workitems",
    props: ['type', 'checkedList', 'buttons', 'cols', 'formName', 'showPara'],
    created: function () {

    },
    mounted() {
        if (this.showPara && this.showPara.height) {
            this.tableConfig.height = this.showPara.height
        }
        if (this.cols) {
            this.tableConfig.cols = this.cols
        } else {
            this.tableConfig.cols = [
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
            ]
        }

        switch (this.formName) {
            case 'done':
                this.name = '已办任务';
                break
            case 'myWork':
                this.name = '我的任务单';
                break
            case 'myCreate':
                this.name = '我发起的';
                break
            default:
        }
    },
    data: function () {
        return {
            name: {},
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
                page: this.showPara ? this.showPara.page : true,
                total: 0,
                pageSize: this.showPara ? this.showPara.pageSize : '',
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
                operWidth: 50,
            },
            listChecks: [],
            formId: -1,
            currentType: '',
        }
    },
    methods: {
        more() {
            this.$root.$emit('routeTo', this.formName)
        },
        editRow: function (row) {
            let step = ClientCallCommon.stepNameConvert(row.stage)
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
        toPage: function (val) {
            this.$refs.query.list({page: val})
        },
    },
    components: {
        TableComponent,
        SubmissionForm,
        AllocForm,
        BidForm,
        WorkitemQuery
    }
}
</script>

<style scoped>

</style>
