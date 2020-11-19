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
                <el-form-item prop="intermediary" v-if="allocForm.auditType === '外审'">
                    <el-select v-model="allocForm.intermediary" filterable placeholder="请选择审计单位"
                               @change="chooseIntermediary">
                        <el-option
                            v-for="intermediary in intermediaries"
                            :key="intermediary.value"
                            :label="intermediary.label"
                            :value="intermediary.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="leader">
                    <el-select v-model="allocForm.leader" filterable placeholder="请选择组长"
                               @change="chooseLeader">
                        <el-option
                            v-for="user in users"
                            :key="user.value"
                            :label="user.label"
                            :value="user.value">
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
                leader: '',
                intermediary: '',
                tel: '',
            },
            allocRules: {
                auditType: [
                    {required: true, message: '请选择审计类型', trigger: 'blur'},
                ],
                leader: [
                    {required: true, message: '请选择组长', trigger: 'blur'},
                ],
                intermediary: [
                    {required: true, message: '请选择中介公司', trigger: 'blur'},
                ],
            },
            users: [],
            intermediaries: [],
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
            this.allocForm.leader = ''
            this.allocForm.intermediary = ''
            this.allocForm.tel = ''

            let data = Common.copyObject(Config.pageAll)
            if (val === '外审') {
                this.intermediaries = []
                this.users = []
                ClientCallCommon.getIntermediary().then(res => {
                    res.list.content.forEach(intermediary => {
                        this.intermediaries.push({
                            value: intermediary.id,
                            label: intermediary.name
                        })
                    })
                })
            } else {
                User.getInsideUsers(data).then(res => {
                    this.users = []
                    res.list.content.forEach(user => {
                        let label = user.name + '(' + user.username + ")"
                        this.users.push({
                            value: user.id,
                            label: label
                        })
                    })
                })
            }
        },
        chooseLeader(val) {
            User.getUser({id: val}).then(result => {
                this.allocForm.tel = result.user.telphone
            })
        },
        chooseIntermediary(val) {
            this.users = []
            User.getIntermediaryUsers({
                thirdpartyId: val
            }).then(res => {
                res.list.forEach(user => {
                    let label = user.name + '(' + user.username + ")"
                    this.users.push({
                        value: user.id,
                        label: label
                    })
                })
            })
        },
    },
}
</script>

<style scoped>

</style>