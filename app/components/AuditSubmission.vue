<template>
    <audit-component v-bind:step="'submission'"
                     v-bind:formOpers="formOpers"
                     v-bind:customTableConfig="customTableConfig"
                     v-bind:formRules="rules">
    </audit-component>
</template>

<script>

import AuditComponent from "./AuditComponent";
import {Notification} from "element-ui";
import Audit from "../script/server/audit";

export default {
    name: "AuditSubmission",
    created: function () {

    },
    mounted() {

    },
    watch: {},
    data: function () {
        return {
            formOpers: [
                {name: '保存', color: 'primary', event: this.saveSubmission},
                {name: '提交', color: 'success', event: this.commitSubmission}
            ],
            customTableConfig: {
                checkable: false,
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: 'edit',
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: 'delete',
                        check: true
                    }
                ]
            },
            rules: {
                projectName: [
                    {required: true, message: '请输入工程项目名称', trigger: 'blur'},
                ],
                constructionUnit: [
                    {required: true, message: '请输入施工单位名称', trigger: 'blur'},
                ],
                budget: [
                    {required: true, message: '请填写预算', trigger: 'blur'},
                    {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                ],
                contractMoney: [
                    {required: true, message: '请填写中标或合同金额', trigger: 'blur'},
                    {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                ],
                startDate: [
                    {required: true, message: '请选择开工时间', trigger: 'blur'}
                ],
                endDate: [
                    {required: true, message: '请选择竣工时间', trigger: 'blur'}
                ],
                materialGroup: [
                    {required: true, message: '请选择资料清单组', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        saveSubmission: function (operSuccess, comp, form) {
            this.commitForm(-10, operSuccess, comp, form)
        },
        commitSubmission: function (operSuccess, comp, form) {
            this.commitForm(10, operSuccess, comp, form)
        },
        commitForm(code, operSuccess, comp, form) {
            //验证附件上传情况
            for (let type of form.details) {
                if (type.mRequired) {
                    if ((!type.mFiles || type.mFiles.length === 0) && (!type.mNote || type.mNote.match(/^[ ]*$/))) {
                        Notification.error({
                            title: '提交失败!',
                            message: type.mName + '必须上传附件或填写备注！',
                            duration: 5000
                        })
                        return
                    }
                }
            }
            //附件列表转换为serverId字符串
            for (let types of form.details) {
                let ids = ''
                for (let file of types.mFiles) {
                    ids = ids + ',' + file.id
                }
                types.mFileIds = ids.substr(1)
            }
            //设置状态
            form.status = code
            Audit.saveSubmission(form).then(result => {
                if (result) {
                    comp.operSuccess(comp)
                }
            })
        }
    },
    components: {AuditComponent}
}
</script>

<style scoped>

</style>