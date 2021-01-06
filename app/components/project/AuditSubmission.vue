<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query"
                              v-bind:tableConfigObject="tableConfig"
                              v-bind:stepCode="stepCode"
                              v-bind:needExport="true"
                              v-bind:buttons="buttons">
            </submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formRules="rules"
                         v-bind:formRules2="rules2"
                         v-bind:formOpers="formOpers"
                         v-bind:step="step"
                         v-bind:stepCode="stepCode"
                         v-bind:formId="formId">
        </submission-form>
    </div>
</template>

<script>

import TableComponent from "../TableComponent";
import SubmissionForm from "./SubmissionForm";
import Config from "../../script/config";
import SubmissionQuery from "./SubmissionQuery";
import ClientCallProject from "../../script/client/project/clientCall"
import RejectedOper from "../../script/client/project/rejectedOper"

export default {
    name: "AuditSubmission",
    created: function () {

    },
    mounted() {
        if (this.$root.loginUser.type === 'THIRDPARTY') {
            this.buttons = []
        }
    },
    watch: {},
    data: function () {
        return {
            step: 'submission',
            stepCode: Config.stepCode.submissionSave,
            dialogVisible: false,
            from: '',
            formId: -1,
            formOpers: [],
            buttons: [
                {name: '新增', color: 'success', event: this.add},
            ],
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {
                        prop: 'status',
                        label: '审计状态',
                        width: '120',
                        fixed: true,
                    },
                    {prop: 'auditNo', label: '审计编号', width: '100'},
                    {prop: 'contractNo', label: '合同编码'},
                    {prop: 'projectName', label: '工程项目', width: '220'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '110'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editRow,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.deleteRow,
                        check: true
                    }
                ],
                oper2: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '查看', placement: 'right'},
                        event: this.viewRow,
                    },
                ],
                operWidth: 100
            },
            rules: RejectedOper.rules,
            rules2: RejectedOper.rules2
        }
    },
    methods: {
        add: function () {
            //子组件关闭后visible值不能回传,所以在父组件里重置下,触发变化
            this.dialogVisible = false
            this.dialogVisible = true
            this.from = 'addform'
            this.step = 'submission'
            this.stepCode = Config.stepCode.submissionSave
            this.formOpers = [
                {name: '保存', color: 'primary', event: this.saveSubmission},
                {name: '提交', color: 'success', event: this.commitSubmission}
            ]
        },
        editRow: function (row) {
            this.from = 'editform'
            this.step = 'submission'
            this.stepCode = Config.stepCode.submissionSave
            this.formId = row.id
            this.formOpers = [
                {name: '保存', color: 'primary', event: this.saveSubmission},
                {name: '提交', color: 'success', event: this.commitSubmission}
            ]
            this.dialogVisible = false
            this.dialogVisible = true
        },
        viewRow: function (row) {
            this.formId = row.id
            this.from = 'editform'
            this.formOpers = []
            this.step = 'otherStep'
            this.stepCode = 10000
            this.dialogVisible = false
            this.dialogVisible = true
        },
        deleteRow: function (row) {
            ClientCallProject.deleteSubmission({id: row.id}).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.$refs.query.list({page: 1})
            })
        },
        saveSubmission: function (form) {
            ClientCallProject.saveSubmission(form).then(result => {
                if (result) {
                    this.operSuccess()
                }
            })
        },
        commitSubmission: function (form) {
            ClientCallProject.startSubmission(form).then(result => {
                if (result) {
                    this.operSuccess()
                }
            })
        },
        operSuccess() {
            this.dialogVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.$refs.query.list({page: 1})
        },
        toPage: function (val) {
            this.$refs.query.list({page: val})
        },
    },
    components: {TableComponent, SubmissionForm, SubmissionQuery}
}
</script>

<style scoped>

</style>