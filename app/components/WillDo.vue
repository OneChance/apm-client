<template>
    <div class="card-content">
        <el-card ref='comp' class="box-card">
            <div slot="header" class="clearfix header" v-if="formName">
                <el-row>
                    <el-col :span="6"><span class="sign-title">待办任务</span></el-col>
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
                            v-bind:showPara="showPara"
                            v-bind:type="'willDo'">
            </workitem-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="forms.submission.visible" v-bind:from="'editform'"
                         v-bind:formOpers="forms.submission.formOpers"
                         v-bind:formRules="forms.submission.rules"
                         v-bind:formRules2="forms.submission.rules2"
                         v-bind:stepCode="forms.submission.stepCode"
                         v-bind:step="forms.submission.step" v-bind:formId="formId"
                         v-bind:workitemId="workitemId"
                         v-bind:formName="formName">
        </submission-form>
        <alloc-form v-bind:visible="forms.alloc.visible" v-bind:commitCallback="allocCallback">
        </alloc-form>
        <bid-form v-bind:visible="forms.bid.visible"
                  v-bind:from="'editform'"
                  v-bind:formOpers="forms.bid.formOpers"
                  v-bind:formRules="forms.bid.rules"
                  v-bind:stepCode="forms.bid.stepCode"
                  v-bind:step="forms.bid.step"
                  v-bind:formId="formId"
                  v-bind:workitemId="workitemId"
                  v-bind:formName="formName">
        </bid-form>
    </div>
</template>

<script>
import TableComponent from "./TableComponent";
import SubmissionForm from "./project/SubmissionForm";
import AllocForm from "./AllocForm";
import ClientCallCommon from "../script/client/clientCall"
import BidForm from "./bid/BidForm";
import WorkitemQuery from "./WorkitemQuery"
import Scripts from "../script/client/willdo/scripts"

export default {
    name: "WillDo",
    props: ['cols', 'formName', 'showPara', 'moreUrl'],
    created: function () {

    },
    mounted() {
        //初始化待办处理脚本
        Scripts.scripts.comp = this
        for (let script in Scripts.scripts) {
            this[script] = Scripts.scripts[script]
        }

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
                    prop: 'stageStr',
                    label: '待办名称',
                    width: '100'
                },
                {
                    prop: 'nextStageStr',
                    label: '下一步',
                    width: '100',
                },
                {
                    prop: 'auditNo',
                    label: '审计编号',
                    width: '120',
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
    },
    data: function () {
        return {
            buttons: [
                {name: '批量处理', color: 'success', event: this.batchAllocAgree},
                {name: '批量打回', color: 'danger', event: this.batchAllocReject},
            ],
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
                checkBoxChange: this.checkBoxChange,
                checkable: true,
                cols: [],
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
            workitemId: -1,
            currentType: '',
        }
    },
    methods: {
        more() {
            this.$root.$emit('routeTo', this.formName)
        },
        allocCallback(form) {
            let type = this.listChecks[0].target
            this.batch['distribution'][type][0](this.listChecks.map(form => {
                return {
                    targetId: form.targetId,
                    workitemId: form.id
                }
            }), 1, form).then(() => {
                this.operSuccess()
            })
        },
        checkBoxChange(val) {
            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
            this.listChecks = val
        },
        batchAllocAgree() {
            this.batchOper(1)
        },
        batchAllocReject() {
            this.batchOper(0)
        },
        batchOper(approve) { //待办的批量处理
            if (this.listChecks.length === 0) {
                this.$notify.error({
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
                    this.$notify.error({
                        title: '操作失败!',
                        message: '选中的待办属于不同类型送审表,无法批量处理！',
                        duration: 3000
                    })
                } else if (stageSet.size > 1) {
                    this.$notify.error({
                        title: '操作失败!',
                        message: '选中的待办处于不同阶段,无法批量处理！',
                        duration: 3000
                    })
                } else {
                    let stage = this.listChecks[0].stage
                    let type = this.listChecks[0].target
                    if (['reject', 'survey_prepare', 'survey_scene', 'argue', 'audit_first', 'audit_second', 'memberl', 'audit_dept', 'take_advice'].indexOf(stage) !== -1
                        || (stage === 'check' && type === 'bid')) {
                        this.$notify.error({
                            title: '操作失败!',
                            message: '当前阶段不可批量操作！',
                            duration: 3000
                        })
                    } else {
                        let batchRes = this.batch[stage][type][approve](this.listChecks.map(form => {
                            return {
                                targetId: form.targetId,
                                workitemId: form.id
                            }
                        }), approve)

                        if (batchRes) {
                            batchRes.then(result => {
                                if (result) {
                                    this.operSuccess()
                                }
                            })
                        }
                    }
                }
            }
        },
        editRow: function (row) {

            let step = ClientCallCommon.stepNameConvert(row.stage)
            let type = row.target

            this.forms[type].step = step

            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
            this.forms[type].visible = true

            if (this[step]) {
                this[step][type].comp = this
                this.forms[type].formOpers = this[step][type].buttons
                this.forms[type].rules = this[step][type].rules
                this.forms[type].rules2 = this[step][type].rules2
            }

            this.formId = row.targetId
            this.workitemId = row.id
            this.forms[type].stepCode = this.stepCode[type][step]
        },
        toPage: function (val) {
            this.$refs.query.list({page: val})
        },
        operSuccess() {
            for (let formType in this.forms) {
                this.forms[formType].visible = false
            }
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.$refs.query.list({page: 1})
        }
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
