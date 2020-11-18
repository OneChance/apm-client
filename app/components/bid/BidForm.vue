<template>
    <el-dialog class="form-dialog" :visible.sync="visible" :close-on-click-modal="false">
        <template>
            <div :id="formName?formName+'bid':'bid'">
                <el-form :model="bidForm" :rules="formRules" ref="bidForm">
                    <p class="title">招标控制价审核送审表</p>
                    <table class="form-table">
                        <tr>
                            <th class="first-th">立项代码</th>
                            <td>
                                <el-form-item prop="itemCode">
                                    <el-input v-model="bidForm.itemCode"
                                              :disabled="stepCode>0"></el-input>
                                </el-form-item>
                            </td>
                            <th :class="stepCode===10?'form-required':''">审计编号</th>
                            <td :class="stepCode===10?'editing':''">
                                <el-form-item prop="auditNo">
                                    <el-input v-model="bidForm.auditNo"
                                              :disabled="stepCode!==10"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">工程项目名称</th>
                            <td>
                                <el-form-item prop="projectName">
                                    <el-input v-model="bidForm.projectName"
                                              :disabled="stepCode>0"
                                              placeholder="填写工程项目名称"></el-input>
                                </el-form-item>
                            </td>
                            <th>经费来源</th>
                            <td>
                                <el-form-item prop="feeFrom">
                                    <el-input v-model="bidForm.feeFrom"
                                              :disabled="stepCode>0"
                                              placeholder="填写经费来源"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">编制单位名称</th>
                            <td colspan="3">
                                <el-form-item prop="bidUnit">
                                    <el-input v-model="bidForm.bidUnit"
                                              :disabled="stepCode>0"
                                              placeholder="填写编制单位名称"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">编标人</th>
                            <td>
                                <el-form-item prop="bidMan">
                                    <el-input v-model="bidForm.bidMan"
                                              :disabled="stepCode>0"
                                              placeholder="填写编标人"></el-input>
                                </el-form-item>
                            </td>
                            <th>联系电话</th>
                            <td>
                                <el-form-item prop="bidManTel">
                                    <el-input v-model="bidForm.bidManTel"
                                              :disabled="stepCode>0"
                                              placeholder="填写联系电话"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">预计开工时间</th>
                            <td>
                                <el-form-item prop="startDate">
                                    <el-date-picker v-model="bidForm.startDate"
                                                    :disabled="stepCode>0"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd" type="date" placeholder="选择预计开工时间">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>预算金额</th>
                            <td>
                                <el-form-item prop="budget">
                                    <el-input v-model="bidForm.budget"
                                              :disabled="stepCode>0"
                                              placeholder="填写预算"></el-input>
                                </el-form-item>
                            </td>
                            <th>土建</th>
                            <td>
                                <el-form-item prop="constructMoney">
                                    <el-input v-model="bidForm.constructMoney"
                                              :disabled="stepCode>0"
                                              placeholder="填写土建金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>报审金额</th>
                            <td>
                                <el-form-item prop="subMoney">
                                    <el-input v-model="bidForm.subMoney"
                                              :disabled="stepCode>0"
                                              placeholder="填写预算"></el-input>
                                </el-form-item>
                            </td>
                            <th>安装</th>
                            <td>
                                <el-form-item prop="installMoney">
                                    <el-input v-model="bidForm.installMoney"
                                              :disabled="stepCode>0"
                                              placeholder="填写安装金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr>
                            <th class="form-required">资料清单组</th>
                            <td colspan="3">
                                <el-form-item prop="materialGroup">
                                    <el-select v-model="bidForm.materialGroup" placeholder="请选择"
                                               :disabled="stepCode>0"
                                               @change="materialGroupChange">
                                        <el-option v-for="group in materialGroups" :key="group.id" :label="group.name"
                                                   :value="group.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">资料清单</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.bidForm.details">
                                        <th>
                                            {{ fileType.mName }}<span style="color: red; "
                                                                      v-if="fileType.mRequired">*</span>
                                        </th>
                                        <td>
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemove"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="stepCode<0"
                                                           @click="toUpload(fileType.mId)">点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="stepCode>0"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr class="allocMan" v-if="stepCode>=30">
                            <th>审计方式</th>
                            <td colspan="3">
                                <el-input type="text" v-model="bidForm.auditType" disabled></el-input>
                            </td>
                        </tr>

                        <tr class="allocMan"
                            v-if="stepCode>=30 && bidForm.assigned">
                            <th v-if="bidForm.assigned.thirdParty">分配审计单位</th>
                            <th v-if="!bidForm.assigned.thirdParty">分配审计人员</th>
                            <td>
                                <el-input type="text" v-model="bidForm.assigned.name" disabled></el-input>
                            </td>
                            <th>联系方式</th>
                            <td>
                                <el-input type="text" v-model="bidForm.assigned.telphone" disabled
                                          v-if="!bidForm.assigned.thirdParty"></el-input>
                                <el-input type="text" v-model="bidForm.assignedLink.telphone" disabled
                                          v-if="bidForm.assigned.thirdParty && bidForm.assignedLink"></el-input>
                            </td>
                        </tr>
                        <tr class="allocMan"
                            v-if="stepCode>=30 && bidForm.assigned && bidForm.assigned.thirdParty">
                            <th>联系人</th>
                            <td colspan="3">
                                <el-input type="text" v-if="bidForm.assignedLink"
                                          v-model="bidForm.assignedLink.contact"
                                          disabled></el-input>
                            </td>
                        </tr>
                        <!--这里的意见非表单数据 是写入意见表的-->
                        <tr v-if="step==='project' || step === 'assigned'">
                            <th>审批意见</th>
                            <td colspan="3" :class="stepCode===10||stepCode===30?'editing':''">
                                <el-input type="textarea" v-model="comment"></el-input>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=40">
                            <th>送审价</th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="submissionPrice">
                                    <el-input v-model="bidForm.submissionPrice" :disabled="step!=='auditFirst'"
                                              placeholder="填写送审价"></el-input>
                                </el-form-item>
                            </td>
                            <th>初审审定金额<span style="color: red; ">*</span></th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="firstAuditPrice">
                                    <el-input v-model="bidForm.firstAuditPrice" :disabled="step!=='auditFirst'"
                                              placeholder="填写土建金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=40">
                            <th class="form-required">初审核减额</th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="auditFirstSub">
                                    <el-input v-model="bidForm.auditFirstSub" disabled></el-input>
                                </el-form-item>
                            </td>
                            <th class="form-required">初审核减率</th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="auditFirstSubRatio">
                                    <el-input v-model="bidForm.auditFirstSubRatio+'%'"
                                              disabled
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=40">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">初审资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.bidForm.auditFirstFiles">
                                        <th>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </th>
                                        <td :class="stepCode===40?'editing':''">
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveAuditFirst"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditFirst'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote" :disabled="step!=='auditFirst'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=50">
                            <th class="form-required">复审审定金额</th>
                            <td :class="stepCode===50?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="bidForm.secondAuditPrice" :disabled="step!=='auditSecond'"
                                              placeholder="填写复审审定金额"></el-input>
                                </el-form-item>
                            </td>
                            <th class="form-required">复审核减额</th>
                            <td :class="stepCode===50?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="bidForm.auditSecondSub"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=50">
                            <th class="form-required">复审核减率</th>
                            <td colspan="3" :class="stepCode===50?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="bidForm.auditSecondSubRatio+'%'"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=50">
                            <th class="form-required">审计备注</th>
                            <td colspan="3" :class="stepCode===50?'editing':''">
                                <el-form-item prop="auditNote">
                                    <el-input type="textarea" v-model="bidForm.auditNote"
                                              :disabled="step!=='auditSecond'"
                                              placeholder="审计备注"></el-input>
                                </el-form-item>
                            </td>
                        </tr>


                        <tr v-if="stepCode>=50">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">复审资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.bidForm.auditSecondFiles">
                                        <th>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </th>
                                        <td :class="stepCode===50?'editing':''">
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveAuditSecond"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditSecond'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote" :disabled="step!=='auditSecond'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="4" class="comment compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">审批阶段</th>
                                        <th>审批人</th>
                                        <th>审批时间</th>
                                        <th>审批意见</th>
                                        <th>审批内容</th>
                                    </tr>
                                    <tr v-for="comment in comments" :key="comment.id">
                                        <td>
                                            {{ comment.stageStr }}
                                        </td>
                                        <td>
                                            {{ comment.creator.name }}
                                        </td>
                                        <td>
                                            {{ comment.createTime }}
                                        </td>
                                        <td>
                                            {{ comment.typeStr }}
                                        </td>
                                        <td>
                                            {{ comment.content }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr class="print-info">
                            <th>送审部门（盖章）</th>
                            <td style="height: 100px;">

                            </td>
                            <th>审计部门（盖章）</th>
                            <td style="height: 100px;">

                            </td>
                        </tr>
                        <tr class="print-info">
                            <th>项目负责人</th>
                            <td>

                            </td>
                            <th>材料接收人</th>
                            <td>

                            </td>
                        </tr>
                        <tr class="print-info">
                            <th>送审人联系电话</th>
                            <td>

                            </td>
                            <th>接收时间</th>
                            <td>

                            </td>
                        </tr>
                    </table>
                </el-form>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button v-for="oper in formOpers" :type="oper.color" @click="commit(oper.event)" :key="oper.name">
                {{ oper.name }}
            </el-button>
            <el-button @click="print()">打印</el-button>
        </div>
    </el-dialog>
</template>

<script>

import MaterialFile from "../../script/server/materialFile";
import Upload from "../../script/server/upload";
import Bid from "../../script/server/bid";
import Comment from "../../script/server/comment";
import Env from "../../script/server/env"
import ClientCallCommon from "../../script/client/clientCall"

export default {
    name: "BidForm",
    props: ['visible', 'from', 'formOpers', 'step', 'formId', 'formRules', 'stepCode', 'formName'],
    watch: {
        'bidForm.submissionPrice': function () {
            this.calAuditFirst()
        },
        'bidForm.firstAuditPrice': function () {
            this.calAuditFirst()
        },
        'bidForm.secondAuditPrice': function () {
            this.calAuditSecond()
        },
        visible: function (newVal) {
            if (newVal) {

                this.uploadFiles = []

                MaterialFile.getMaterialGroups().then(res => {
                    this.materialGroups = res.list
                })

                this.bidForm.details = []

                this.$nextTick(() => {
                    if (this.from === 'addform') {
                        this.$refs['bidForm'].resetFields();
                        $(".comment").hide()
                    } else if (this.from === 'editform') {
                        //加载form
                        Bid.getSubmission({
                            id: this.formId
                        }).then(result => {

                            //每次打开清空意见
                            this.comment = '';

                            //加载初审资料附件
                            if (!result.bid.auditFirstFiles || result.bid.auditFirstFiles.length === 0) {
                                result.bid.auditFirstFiles = [
                                    {
                                        mId: '-4',
                                        mName: '审定单',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-5',
                                        mName: '初审报告',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-6',
                                        mName: '审计工作底稿',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-7',
                                        mName: '计价文本',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                ]
                            }
                            //加载复审资料附件
                            if (!result.bid.auditSecondFiles || result.bid.auditSecondFiles.length === 0) {
                                result.bid.auditSecondFiles = [
                                    {
                                        mId: '-8',
                                        mName: '审定单',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-9',
                                        mName: '初审报告',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-10',
                                        mName: '审计工作底稿',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                    {
                                        mId: '-11',
                                        mName: '计价文本',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    },
                                ]
                            }

                            for (let p in result.bid) {
                                this.bidForm[p] = result.bid[p]
                            }

                            if (this.bidForm.materialGroup) {
                                MaterialFile.getMaterialGroup({
                                    id: this.bidForm.materialGroup
                                }).then(res => {
                                    for (let fType of res.materialGroup.details) {
                                        let detail = this.bidForm.details.filter(f => f.mId === fType.material.id)[0]
                                        if (detail) {
                                            detail.mRequired = fType.required
                                        } else {
                                            this.bidForm.details.push({
                                                mRequired: fType.required,
                                                mId: fType.material.id,
                                                mName: fType.material.name,
                                                mFiles: [],
                                                mFileIds: '',
                                                mNote: ''
                                            })
                                        }
                                    }
                                })
                            }

                            //获取意见
                            this.comments = []
                            Comment.getComment({
                                target: 'bid',
                                targetId: this.bidForm.id
                            }).then(res => {
                                this.comments = res.list
                            })

                            if (this.stepCode >= 80) {
                                //将复审审定金额默认设置为初审审定金额
                                if (!this.bidForm.secondAuditPrice || this.bidForm.secondAuditPrice === 0) {
                                    this.bidForm.secondAuditPrice = this.bidForm.firstAuditPrice
                                }
                            }

                            //初始化附件
                            if (this.step === 'auditFirst') {
                                ClientCallCommon.setFiles(this.uploadFiles, this.bidForm.auditFirstFiles)
                            } else if (this.step === 'auditSecond') {
                                ClientCallCommon.setFiles(this.uploadFiles, this.bidForm.auditSecondFiles)
                            } else if (this.step === 'bid' || this.step === 'reject') {
                                ClientCallCommon.setFiles(this.uploadFiles, this.bidForm.details)
                            }
                        })
                    }
                    $(".print-info").hide()
                });
            } else {
                $(".upload-btn").show()
            }
        }
    },
    mounted: function () {

    },
    data: function () {
        return {
            dialogVisible: false,
            bidForm: {
                id: '',
                itemCode: '',
                auditNo: '',
                projectName: '',
                feeFrom: '',
                bidUnit: '',
                bidMan: '',
                bidManTel: '',
                budget: 0,
                startDate: '',
                subMoney: 0,
                constructMoney: '',
                installMoney: '',
                materialGroup: '',
                details: [], //资料清单信息
                status: 0,
                assignedLink: {
                    telphone: '',
                    contact: '',
                },
                assigned: {
                    telphone: '',
                    thirdParty: false,
                },
                //审计初审--------------
                submissionPrice: 0,
                firstAuditPrice: 0,
                auditFirstFiles: [],
                auditFirstSub: '',
                auditFirstSubRatio: '',
                //审计复审
                secondAuditPrice: 0,
                auditNote: '',
                auditSecondSub: '',
                auditSecondSubRatio: '',
                auditSecondFiles: [],
            },
            materialGroups: [],
            uploadParams: {
                id: '',
            },
            comment: '',
            comments: [],
            uploadFiles: []
        }
    },
    methods: {
        calAuditFirst: function () {
            this.bidForm.auditFirstSub = this.bidForm.submissionPrice - this.bidForm.firstAuditPrice
            this.bidForm.auditFirstSubRatio = (this.bidForm.auditFirstSub / this.bidForm.submissionPrice).toFixed(4) * 100
        },
        calAuditSecond: function () {
            this.bidForm.auditSecondSub = this.bidForm.firstAuditPrice - this.bidForm.secondAuditPrice
            this.bidForm.auditSecondSubRatio = (this.bidForm.auditSecondSub / this.bidForm.firstAuditPrice).toFixed(2) * 100
        },
        commit: function (event) {
            if ((this.step === 'bid' && event.name.indexOf('save') === -1) ||
                this.step === 'project' ||
                this.step === 'reject' ||
                this.step === 'auditFirst' ||
                this.step === 'auditSecond') {

                let _this = this

                //需要验证表单的提交
                this.$refs['bidForm'].validate((valid) => {
                    if (valid) {
                        if (this.step === 'bid' || this.step === 'reject') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.bidForm.details)
                            if (ClientCallCommon.checkFileOrNote(this.bidForm.details)) {
                                event(this.bidForm)
                            }
                        } else if (this.step === 'project') {
                            event({
                                targetId: this.bidForm.id,
                                content: this.comment,
                                auditNo: this.bidForm.auditNo
                            })
                        } else if (this.step === 'auditFirst') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.bidForm.auditFirstFiles)
                            if (ClientCallCommon.fileListCheck(this.bidForm.auditFirstFiles)) {
                                event({
                                    targetId: this.bidForm.id,
                                    type: 2,
                                    submissionPrice: this.bidForm.submissionPrice,
                                    firstAuditPrice: this.bidForm.firstAuditPrice,
                                    auditFirstSub: this.bidForm.auditFirstSub,
                                    auditFirstSubRatio: this.bidForm.auditFirstSubRatio,
                                    auditFirstFiles: this.bidForm.auditFirstFiles,
                                })
                            }
                        } else if (this.step === 'auditSecond') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.bidForm.auditSecondFiles)
                            if (ClientCallCommon.fileListCheck(this.bidForm.auditSecondFiles)) {
                                event({
                                    targetId: this.bidForm.id,
                                    type: 2,
                                    secondAuditPrice: this.bidForm.secondAuditPrice,
                                    auditSecondSub: this.bidForm.auditSecondSub,
                                    auditSecondSubRatio: this.bidForm.auditSecondSubRatio,
                                    auditNote: this.bidForm.auditNote,
                                    auditSecondFiles: this.bidForm.auditSecondFiles,
                                })
                            }
                        }
                    } else {
                        _this.$notify.error({
                            title: '提交失败!',
                            message: '表单信息有误,请检查!',
                            duration: 2000
                        })
                        return false;
                    }
                });
            } else {
                if (this.step === 'bid') {
                    //保存不验证必填
                    ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.bidForm.details)
                    event(this.bidForm)
                } else {
                    event(this.comment, this.bidForm.id)
                }
            }
        },
        print: function () {
            $(".upload-btn").hide()
            $(".print-info").show()
            let formName = this.formName ? this.formName + 'bid' : 'bid'
            $("#" + formName).printArea({
                importCSS: false
            })
        },
        //资料清单移除方法
        handleRemove(file) {
            this.removeFileFromList(file)
        },
        beforeRemove(file) {
            return this.removeableConfirm(file, ['bid', 'reject'], '当前阶段不可移除资料清单附件!')
        },
        beforeRemoveAuditFirst(file) {
            return this.removeableConfirm(file, ['auditFirst'], '当前阶段不可移除初审资料附件!')
        },
        beforeRemoveAuditSecond(file) {
            return this.removeableConfirm(file, ['auditSecond'], '当前阶段不可移除复审资料附件!')
        },
        removeableConfirm(file, steps, message) {
            return ClientCallCommon.removeableConfirm(file, steps, message, this.step)
        },
        removeFileFromList(file) {
            ClientCallCommon.removeFile(file, this.uploadFiles)
        },
        handlePreview(file) {
            window.open(Env.baseURL + file.url)
        },
        materialGroupChange: function (value) {
            //根据选择的清单组，初始化附加列表
            ClientCallCommon.materialGroupChange(value, this.bidForm.details)
        },
        toUpload(typeId) {
            //上传之前暂存当前要上传文件所属的清单组Id
            this.uploadParams.id = typeId
        },
        upload(content) {

            let failRefeshList = []

            if (this.step === 'auditFirst') {
                failRefeshList = this.bidForm.auditFirstFiles
            } else if (this.step === 'auditSecond') {
                failRefeshList = this.bidForm.auditSecondFiles
            } else {
                failRefeshList = this.bidForm.details
            }

            ClientCallCommon.upload(content, this.uploadParams.id, this.uploadFiles, failRefeshList)

        },
    },
}
</script>

<style scoped>

</style>
