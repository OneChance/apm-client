<template>
    <div>
        <audit-component v-bind:step="'missionAlloc'"
                         v-bind:opers="opers"
                         v-bind:customTableConfig="customTableConfig">
        </audit-component>
        <el-dialog title="分配"
                   :visible.sync="missionAllocVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="allocForm" :model="allocForm" :rules="allocRules">
                    <el-form-item prop="auditType">
                        <el-radio v-model="allocForm.auditType" label="in" border @change="allocTypeChange">内审
                        </el-radio>
                        <el-radio v-model="allocForm.auditType" label="out" border @change="allocTypeChange">外审
                        </el-radio>
                    </el-form-item>
                    <el-form-item prop="target">
                        <el-select v-model="allocForm.target" filterable :placeholder="targetPlaceholder"
                                   @change="chooseTarget">
                            <el-option
                                v-for="target in targets"
                                :key="target.value"
                                :label="target.label"
                                :value="target.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="materialGroup">
                        <el-input
                            v-model="allocForm.tel"
                            placeholder="审计人员联系方式"
                            :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="missionAllocVisible = false">取 消</el-button>
                <el-button type="primary" @click="allocCommit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import AuditComponent from "./AuditComponent";
import User from "../script/server/user";

export default {
    name: "MissionAlloc",
    created: function () {

    },
    mounted() {
    },
    data: function () {
        return {
            missionAllocVisible: false,
            allocForm: {
                auditType: '',
                target: '',
                tel: '',
            },
            allocRules: {
                target: [
                    {required: true, message: '请选择审计人员', trigger: 'blur'},
                ],
                auditType: [
                    {required: true, message: '请选择审计类型', trigger: 'blur'},
                ],
            },
            targetPlaceholder: '请选择',
            targets: [],
            opers: [
                {name: '分配', color: 'success', event: this.batchAlloc}
            ],
            customTableConfig: {
                checkable: true,
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: 'edit',
                    },
                ]
            }
        }
    },
    methods: {
        batchAlloc(checks) {
            console.log(checks)
            this.missionAllocVisible = true
            this.$nextTick(() => {
                this.$refs['allocForm'].resetFields();
            });
        },
        allocCommit: function () {
            this.$refs['allocForm'].validate((valid) => {
                if (valid) {
                    this.missionAllocVisible = false;
                }
            })
        },
        allocTypeChange: function (val) {//分配类型改变
            this.allocForm.target = ''
            this.allocForm.tel = ''
            let thirdParty = false
            if (val === 'in') {
                this.targetPlaceholder = '请选择人员'
            } else {
                this.targetPlaceholder = '请选择审计单位'
                thirdParty = true
            }
            User.getUsers({
                page: 1,
                pageSize: 999999,
                thirdParty: thirdParty
            }).then(res => {
                this.targets = []
                res.list.content.forEach(user => {
                    let label = user.name + '(' + user.username + ")"
                    if (thirdParty) {
                        label = user.thirdPartyName + '(' + user.username + ")"
                    }
                    this.targets.push({
                        value: user.id,
                        label: label
                    })
                })
            })
        },
        chooseTarget(val) {
            User.getUser({id: val}).then(result => {
                this.allocForm.tel = result.user.telphone
            })
        }
    },
    components: {AuditComponent}
}
</script>

<style scoped>

</style>