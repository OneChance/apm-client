<template>
    <el-dialog :title="工程结算审计通知单" class="form-dialog" :visible.sync="visible" :close-on-click-modal="false">
        <template>
            <div ref="note-form">
                <el-form :model="auditNoteForm" :rules="rules" ref="submissionForm">
                    <p class="title">工程结算审计通知单</p>
                    <p>审计编号:{{ auditNoteForm.auditNo }}</p>
                    <table class="form-table">
                        <tr>
                            <th>建设单位</th>
                            <td>
                                <el-form-item prop="buildUnit">
                                    <el-input v-model="auditNoteForm.buildUnit"></el-input>
                                </el-form-item>
                            </td>
                            <th>施工单位</th>
                            <td>
                                <el-form-item prop="constructionUnit">
                                    <el-input v-model="auditNoteForm.constructionUnit" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>工程名称</th>
                            <td>
                                <el-form-item prop="projectName">
                                    <el-input v-model="auditNoteForm.projectName" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                            <th>建筑面积</th>
                            <td>
                                <el-form-item prop="floorArea">
                                    <el-input v-model="auditNoteForm.floorArea"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>送审金额</th>
                            <td>
                                <el-form-item prop="submissionMoney">
                                    <el-input v-model.number="auditNoteForm.submissionMoney" disabled></el-input>
                                </el-form-item>
                            </td>
                            <th>审定金额</th>
                            <td>
                                <el-form-item prop="auditMoney">
                                    <el-input v-model.number="auditNoteForm.auditMoney" disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>核增</th>
                            <td>
                                <el-form-item prop="add">
                                    <el-input v-model.number="auditNoteForm.add" disabled></el-input>
                                </el-form-item>
                            </td>
                            <th>核减</th>
                            <td>
                                <el-form-item prop="sub">
                                    <el-input v-model.number="auditNoteForm.sub" disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <el-form-item prop="budget">
                                    <el-input type="textarea" autosize v-model="auditNoteForm.auditInfo"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th rowspan="5">审计意见及说明</th>
                            <td colspan="3">
                                <el-form-item prop="note1">
                                    <el-input type="textarea" autosize v-model="auditNoteForm.note1"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <el-input v-model="auditNoteForm.note2" disabled></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <el-input v-model="auditNoteForm.note3" disabled></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <el-input v-model="auditNoteForm.note4" disabled></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <el-input v-model="auditNoteForm.note5" disabled></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th>审计处</th>
                                        <th>建设单位</th>
                                        <th>施工单位</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            主审人员:<br><br><br>
                                            复审人员:<br><br><br>
                                            领导审批:<br><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                                        </td>
                                        <td>
                                            签字
                                            <br><br><br>
                                            <br><br><br>
                                            <br><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                                        </td>
                                        <td>
                                            签字
                                            <br><br><br>
                                            <br><br><br>
                                            <br><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </el-form>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button @click="save" type="success">保存</el-button>
            <el-button @click="visible = false;print()">打印</el-button>
        </div>
    </el-dialog>
</template>

<script>

import ClientCallProject from "../../script/client/project/clientCall"
import Common from "../../script/common.js"
import ConstructionUnit from "../../script/server/constructionUnit"
import ClientCallBid from "../../script/client/bid/clientCall";

export default {
    name: "AuditNoteForm",
    props: ['visible', 'formId'],
    watch: {
        visible: function (newVal) {
            if (newVal) {
                //加载form

                ClientCallProject.getSubmission({
                    id: this.formId
                }).then(result => {
                    this.auditNoteForm.submissionId = this.formId
                    this.auditNoteForm.auditNo = result.submission.auditNo
                    this.auditNoteForm.projectName = result.submission.projectName
                    this.auditNoteForm.submissionMoney = result.submission.submissionPrice
                    this.auditNoteForm.auditMoney = result.submission.secondAuditPrice
                    this.auditNoteForm.sub = result.submission.subtractPrice
                    this.auditNoteForm.auditFee = result.submission.auditFee
                    this.auditNoteForm.auditUnit = result.submission.assigned.name
                    this.auditNoteForm.payType = result.submission.payType
                    this.auditNoteForm.auditNote = result.submission.auditNote

                    //取保存的信息,如果有,覆盖
                    ClientCallProject.getNoteForm({
                        submissionId: this.formId
                    }).then(result => {
                        if (result.submission_noty) {
                            this.auditNoteForm.id = result.submission_noty.id
                            this.auditNoteForm.buildUnit = result.submission_noty.buildUnit
                            this.auditNoteForm.floorArea = result.submission_noty.floorArea
                            this.auditNoteForm.note1 = result.submission_noty.note1
                            this.auditNoteForm.auditInfo = result.submission_noty.auditInfo
                        } else {
                            let now = new Date();
                            this.auditNoteForm.auditInfo = this.auditNoteForm.buildUnit + "\n  你单位送来的该工程，经审计，核定工程造价为" + this.auditNoteForm.auditMoney + "元。大写:" + Common.priceCN(
                                this.auditNoteForm.auditMoney) + "。\n" +
                                "请按审计结果办理结算手续。\n" +
                                "特此通知。\n " +
                                "                                                                                  审计处\n" +
                                "                                                                                  " + now.getFullYear() +
                                "/" + (now.getMonth() + 1) + "/" + now.getDate();
                        }
                    })

                    this.auditNoteForm.note2 = '请财务部门代扣施工单位惩罚性费用 ' + this.auditNoteForm.auditFee + ' 元'
                    this.auditNoteForm.note3 = '本项目由 ' + this.auditNoteForm.auditUnit + ' 初审（详见附件）'
                    this.auditNoteForm.note4 = '本工程结算方式：' + this.auditNoteForm.payType
                    this.auditNoteForm.note5 = '审计备注：' + this.auditNoteForm.auditNote

                    ConstructionUnit.getConstructionUnit({
                        id: result.submission.constructionUnit,
                    }).then(res => {
                        this.auditNoteForm.constructionUnit = res.construction.name
                    })
                })
            }
        },
    },
    mounted: function () {

    },
    data: function () {
        return {
            auditNoteForm: {
                submissionId: '',
                id: '',
                auditNo: '',
                arcNo: '',
                projectName: '',
                floorArea: '',
                submissionMoney: '',
                auditMoney: '',
                sub: '',
                add: '',
                auditInfo: '',
                auditFee: '',
                auditUnit: '',
                payType: '',
                auditNote: '',
                constructionUnit: '',
                buildUnit: '',
                note1: ' 本工程造价中未扣水电费、甲供材；甲供材、水电费结算执行《扬州大学建设工程甲供材及水电费结算暂行办法》（扬大审计〔2018〕3号）',
                note2: '',
                note3: '',
                note4: '',
                note5: '',
            },
            units: [],
        }
    },
    methods: {
        print: function () {
            this.$print(this.$refs['note-form'])
        },
        save: function () {
            ClientCallProject.saveNoteForm(this.auditNoteForm).then(result => {
                this.visible = false
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            })
        }
    },
}
</script>

<style scoped>

</style>
