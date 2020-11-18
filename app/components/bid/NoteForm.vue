<template>
    <el-dialog :title="招标控制价通知单" class="form-dialog" :visible.sync="visible" :close-on-click-modal="false">
        <template>
            <div class="note-form">
                <el-form :model="noteForm" :rules="rules" ref="submissionForm">
                    <p class="title">招标控制价审核通知单</p>
                    <table class="form-table">
                        <tr>
                            <th>项目编号</th>
                            <td colspan="3">
                                <el-form-item prop="auditNo">
                                    <el-input v-model="noteForm.projectNo" placeholder="填写项目编号"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>建设单位</th>
                            <td colspan="3">
                                <el-form-item prop="constructionUnit">
                                    <el-input v-model="noteForm.constructionUnit" placeholder="填写建设单位"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>设计单位</th>
                            <td colspan="3">
                                <el-form-item prop="disignUnit">
                                    <el-input v-model="noteForm.disignUnit" placeholder="填写设计单位"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>工程名称</th>
                            <td colspan="3">
                                <el-form-item prop="projectName">
                                    <el-input v-model="noteForm.projectName" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>编制单位</th>
                            <td colspan="3">
                                <el-form-item prop="bidUnit">
                                    <el-input v-model="noteForm.bidUnit" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>外审单位</th>
                            <td colspan="3">
                                <el-form-item prop="auditUnit">
                                    <el-input v-model="noteForm.auditUnit" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>预算价</th>
                            <td colspan="3">
                                <el-form-item prop="budget">
                                    <el-input v-model="noteForm.budget" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>送审价</th>
                            <td>
                                <el-form-item prop="subMoney">
                                    <el-input v-model.number="noteForm.subMoney" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                            <th>核增</th>
                            <td>
                                <el-form-item prop="add">
                                    <el-input v-model.number="noteForm.add" :disabled="true"></el-input>
                                </el-form-item>
                            </td>

                        </tr>
                        <tr>
                            <th>审核价</th>
                            <td>
                                <el-form-item prop="auditMoney">
                                    <el-input v-model.number="noteForm.auditMoney" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                            <th>核减</th>
                            <td>
                                <el-form-item prop="sub">
                                    <el-input v-model.number="noteForm.sub" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <el-form-item prop="budget">
                                    <el-input type="textarea" autosize v-model="noteForm.auditInfo"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th rowspan="5">审计意见及说明</th>
                            <td colspan="3">
                                1.该项目由（去外审单位）审核，审核说明详见附件;
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                2.人工费按照苏建函价（2020）115号调整;
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                3.材料价格执行《扬州市工程造价管理》2020年第7期，缺项部分参照市场询价;
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                4.该建议招标控制价不含暂列金额;
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                审计备注：{{ noteForm.auditNote }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th>审计处</th>
                                        <th>建设单位</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            经办人:<br><br><br>
                                            领导审批:<br><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                                        </td>
                                        <td>
                                            签收人:<br><br><br>
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
            <el-button @click="print()">打印</el-button>
        </div>
    </el-dialog>
</template>

<script>

import ClientCallBid from "../../script/client/bid/clientCall"
import Common from "../../script/common.js"

export default {
    name: "NoteForm",
    props: ['visible', 'formId'],
    watch: {
        visible: function (newVal) {
            if (newVal) {
                //先加载通知单，如果没有，加载送审单信息初始化

                //加载form
                ClientCallBid.getSubmission({
                    id: this.formId
                }).then(result => {
                    let now = new Date();

                    console.log(result.bid)

                    this.noteForm.projectNo = result.bid.itemCode
                    this.noteForm.projectName = result.bid.projectName
                    this.noteForm.bidUnit = result.bid.bidUnit
                    this.noteForm.subMoney = result.bid.submissionPrice
                    this.noteForm.budget = result.bid.budget
                    this.noteForm.auditMoney = result.bid.secondAuditPrice
                    this.noteForm.sub = result.bid.subtractPrice
                    this.noteForm.auditInfo = result.bid.bidUnit + "\n     你单位送来的该工程，经审核，建议招标控制价为" + this.noteForm.auditMoney + "元。大写:" + Common.priceCN(
                        this.noteForm.auditMoney) + "。\n" +
                        "请按审计结果办理招投标相关手续。\n" +
                        "特此通知。\n " +
                        "                                                                                  审计处\n" +
                        "                                                                                  " + now.getFullYear() +
                        "/" + (now.getMonth() + 1) + "/" + now.getDate();

                    this.noteForm.auditFee = result.bid.auditFee
                    this.noteForm.auditNote = result.bid.auditNote
                    this.noteForm.auditUnit = result.bid.assigned.name

                })
            }
        },
    },
    mounted: function () {

    },
    data: function () {
        return {
            dialogVisible: false,
            noteForm: {
                id: '',
                projectNo: '',
                arcNo: '',
                projectName: '',
                bidUnit: '',
                submissionMoney: 0,
                auditMoney: 0,
                budget: 0,
                sub: 0,
                add: 0,
                auditInfo: '',
                auditFee: 0,
                auditUnit: '',
                auditNote: '',
            },
        }
    },
    methods: {
        print: function () {
            $(".note-form").printArea({
                importCSS: false
            })
        },
        save: function () {
            console.log(this.noteForm)
        }
    },
}
</script>

<style scoped>

</style>
