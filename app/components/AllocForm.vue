<template>
    <el-dialog title="分配"
               :visible.sync="visible"
               :close-on-click-modal="false">
        <template>
            <el-form ref="allocForm" :model="allocForm" :rules="allocRules">
                <el-form-item prop="auditType">
                    <el-radio v-model="allocForm.auditType" label="内审" border @change="allocTypeChange">内审
                    </el-radio>
                    <el-radio v-model="allocForm.auditType" label="外审" border @change="allocTypeChange">外审
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
                <el-form-item prop="tel">
                    <el-input
                        v-model="allocForm.tel"
                        placeholder="审计人员联系方式"
                        :disabled="true">
                    </el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="allocCommit()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import User from "../script/server/user";

export default {
    name: "AllocForm",
    props: ['visible', 'commitCallback'],
    watch: {
        visible: function (newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs['allocForm'].resetFields();
                });
            }
        }
    },
    created: function () {

    },
    data: function () {
        return {
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
        }
    },
    methods: {
        allocCommit: function () {
            this.$refs['allocForm'].validate((valid) => {
                if (valid) {
                    this.commitCallback(this.allocForm)
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
}
</script>

<style scoped>

</style>