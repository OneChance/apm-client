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
                <el-form-item prop="link" v-if="allocForm.auditType === '外审'">
                    <el-select v-model="allocForm.link" filterable placeholder="请选择组长"
                               @change="chooseLink">
                        <el-option
                            v-for="l in links"
                            :key="l.value"
                            :label="l.label"
                            :value="l.value">
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
import Common from "../script/common";
import Config from "../script/config";
import ClientCallCommon from "../script/client/clientCall";

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
                link: '',
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
            links: [],
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
            this.allocForm.link = ''
            this.allocForm.tel = ''
            let thirdParty = false
            if (val === '内审') {
                this.targetPlaceholder = '请选择组长'
            } else {
                this.targetPlaceholder = '请选择审计单位'
                thirdParty = true
            }

            let data = Common.copyObject(Config.page)
            if (thirdParty) {
                ClientCallCommon.getIntermediary().then(res => {
                    this.targets = []
                    res.list.content.forEach(user => {
                        this.targets.push({
                            value: user.id,
                            label: user.name
                        })
                    })
                })
            } else {
                User.getUsers(data).then(res => {
                    this.targets = []
                    res.list.content.forEach(user => {
                        let label = user.name + '(' + user.username + ")"
                        this.targets.push({
                            value: user.id,
                            label: label
                        })
                    })
                })
            }
        },
        chooseTarget(val) {
            User.getUser({id: val}).then(result => {
                if (this.allocForm.auditType === '外审') {
                    this.links.length = 0;
                    result.user.links.forEach(l => {
                        this.links.push({
                            value: l.id,
                            label: l.contact,
                            tel: l.telphone
                        })
                    })
                } else {
                    this.allocForm.tel = result.user.telphone
                }
            })
        },
        chooseLink(val) {
            this.allocForm.tel = this.links.filter(l => l.value === val)[0].tel
        },
    },
}
</script>

<style scoped>

</style>