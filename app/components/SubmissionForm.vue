<template>
    <el-dialog :title="工程结算送审表"
               class="form-dialog"
               :visible.sync="visible"
               :close-on-click-modal="false">
        <template>
            <div class="form">
                <el-form :model="submissionForm" :rules="rules" ref="submissionForm">
                    <table class="form-table">
                        <tr>
                            <th colspan="4">
                                扬州大学工程结算送审表
                            </th>
                        </tr>
                        <tr>
                            <th>立项代码</th>
                            <td>
                                <el-form-item prop="itemCode">
                                    <el-input v-model="submissionForm.itemCode"
                                              :disabled="step!=='submission' && step!=='reject'"></el-input>
                                </el-form-item>
                            </td>
                            <th>审计编号</th>
                            <td>
                                <el-form-item prop="auditNo">
                                    <el-input v-model="submissionForm.auditNo" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>合同编码</th>
                            <td>
                                <el-form-item prop="contractNo">
                                    <el-input v-model="submissionForm.contractNo"
                                              :disabled="step!=='submission' && step!=='reject'"></el-input>
                                </el-form-item>
                            </td>
                            <th>工程项目名称<span style="color: red; ">*</span></th>
                            <td>
                                <el-form-item prop="projectName">
                                    <el-input v-model="submissionForm.projectName"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写工程项目名称"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>经费来源</th>
                            <td>
                                <el-form-item prop="feeFrom">
                                    <el-input v-model="submissionForm.feeFrom"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写经费来源"></el-input>
                                </el-form-item>
                            </td>
                            <th>预算(万元)</th>
                            <td>
                                <el-form-item prop="budget">
                                    <el-input v-model.number="submissionForm.budget"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写预算"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>施工单位名称<span style="color: red; ">*</span></th>
                            <td colspan="3">
                                <el-form-item prop="constructionUnit">
                                    <el-input v-model="submissionForm.constructionUnit"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写施工单位名称"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>开工时间<span style="color: red; ">*</span></th>
                            <td>
                                <el-form-item prop="startDate">
                                    <el-date-picker
                                        v-model="submissionForm.startDate"
                                        :disabled="step!=='submission' && step!=='reject'"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th>竣工时间<span style="color: red; ">*</span></th>
                            <td>
                                <el-form-item prop="endDate">
                                    <el-date-picker
                                        v-model="submissionForm.endDate"
                                        :disabled="step!=='submission' && step!=='reject'"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>中标合同金额</th>
                            <td colspan="3">
                                <el-form-item prop="contractMoney">
                                    <el-input v-model.number="submissionForm.contractMoney"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写中标合同金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>土建</th>
                            <td>
                                <el-form-item prop="constructMoney">
                                    <el-input v-model="submissionForm.constructMoney"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写土建金额"></el-input>
                                </el-form-item>
                            </td>
                            <th>安装</th>
                            <td>
                                <el-form-item prop="installMoney">
                                    <el-input v-model="submissionForm.installMoney"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写安装金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:15%">报审单位</th>
                                        <th>报审金额（元）</th>
                                        <th>核减金额（元）</th>
                                        <th>联系电话</th>
                                    </tr>
                                    <tr>
                                        <th>施工单位</th>
                                        <td>
                                            <el-form-item prop="constructionUnitApplyFee">
                                                <el-input v-model="submissionForm.constructionUnitApplyFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写施工单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="constructionUnitCheckFee">
                                                <el-input v-model="submissionForm.constructionUnitCheckFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写施工单位核减金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="constructionUnitTel">
                                                <el-input v-model="submissionForm.constructionUnitTel"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="施工单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>监理单位</th>
                                        <td>
                                            <el-form-item prop="inspectUnitApplyFee">
                                                <el-input v-model="submissionForm.inspectUnitApplyFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写监理单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitCheckFee">
                                                <el-input v-model="submissionForm.inspectUnitCheckFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写监理单位核减金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitTel">
                                                <el-input v-model="submissionForm.inspectUnitTel"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写监理单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>建设单位</th>
                                        <td>
                                            <el-form-item prop="buildUnitApplyFee">
                                                <el-input v-model="submissionForm.buildUnitApplyFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitCheckFee">
                                                <el-input v-model="submissionForm.buildUnitCheckFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitTel">
                                                <el-input v-model="submissionForm.buildUnitTel"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <th>项目内容</th>
                            <td colspan="3">
                                <el-form-item prop="content">
                                    <el-input v-model="submissionForm.content" placeholder="填写项目内容"
                                              :disabled="step!=='submission' && step!=='reject'"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>项目概况</th>
                            <td colspan="3">
                                <el-form-item prop="description">
                                    <el-input v-model="submissionForm.description" placeholder="填写项目概况"
                                              :disabled="step!=='submission' && step!=='reject'"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th>资料清单组</th>
                            <td colspan="3">
                                <el-form-item prop="materialGroup">
                                    <el-select v-model="submissionForm.materialGroup" placeholder="请选择"
                                               :disabled="step!=='submission' && step!=='reject'"
                                               @change="materialGroupChange">
                                        <el-option
                                            v-for="group in materialGroups"
                                            :key="group.id"
                                            :label="group.name"
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
                                        <th style="width:33%">资料清单</th>
                                        <th>附件</th>
                                        <th>备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.details">
                                        <td>
                                            {{ fileType.mName }}
                                        </td>
                                        <td>
                                            <el-upload
                                                class="upload-demo"
                                                action="noAction"
                                                :http-request="upload"
                                                :with-credentials="true"
                                                :on-preview="handlePreview"
                                                :on-remove="handleRemove"
                                                :before-remove="beforeRemove"
                                                :on-success="afterUpload"
                                                :data="uploadParams"
                                                multiple
                                                :limit="3"
                                                :on-exceed="handleExceed"
                                                :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='submission' || step ==='reject'"
                                                           @click="toUpload(fileType.mId)">点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote"
                                                      :disabled="step!=='submission' && step!=='reject'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr class="allocMan" v-if="step==='assigned'">
                            <th>分配审计人员</th>
                            <td colspan="3">
                                <el-input type="text" v-model="submissionForm.assigned.name" disabled></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="comment compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:12%">审批阶段</th>
                                        <th style="width:12%">审批人</th>
                                        <th style="width:12%">审批意见</th>
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
                                            {{ comment.typeStr }}
                                        </td>
                                        <td>
                                            {{ comment.content }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr class="comment" v-if="step==='project' || step === 'assigned'">
                            <th>审计意见</th>
                            <td colspan="3">
                                <el-input type="textarea" v-model="comment"></el-input>
                            </td>
                        </tr>
                        <tr class="print-info">
                            <th>送审部门盖章</th>
                            <td style="height: 100px;">

                            </td>
                            <th>审计部门盖章</th>
                            <td style="height: 100px;">

                            </td>
                        </tr>
                        <tr class="print-info">
                            <th>项目负责人</th>
                            <td>

                            </td>
                            <th>审计接收人</th>
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
            <el-button @click="visible = false;print()">打印</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {Notification} from "element-ui";
import MaterialFile from "../script/server/materialFile";
import Upload from "../script/server/upload";
import Audit from "../script/server/audit";
import Comment from "../script/server/comment";

export default {
    name: "SubmissionForm",
    props: ['visible', 'from', 'formOpers', 'step', 'formId'],
    watch: {
        visible: function (newVal) {
            if (newVal) {
                this.submissionForm.details = []
                this.$nextTick(() => {
                    if (this.from === 'addform') {
                        this.$refs['submissionForm'].resetFields();
                        $(".comment").hide()
                    } else if (this.from === 'editform') {
                        //加载form
                        Audit.getSubmission({id: this.formId}).then(result => {
                            this.submissionForm = result.submission
                            //填充清单组元数据信息到附件清单
                            MaterialFile.getMaterialGroup({id: this.submissionForm.materialGroup}).then(res => {
                                for (let fType of res.materialGroup.details) {
                                    let detail = this.submissionForm.details.filter(f => f.mId === fType.material.id)[0]
                                    if (detail) {
                                        detail.mRequired = fType.material.required
                                    } else {
                                        comp.submissionForm.details.push({
                                            mRequired: fType.material.required,
                                            mId: fType.material.id,
                                            mName: fType.material.name,
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        })
                                    }
                                }
                            })
                            //获取意见
                            this.comments = []
                            Comment.getComment({target: 'submission', targetId: this.submissionForm.id}).then(res => {
                                this.comments = res.list
                            })
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
        MaterialFile.getMaterialGroups().then(res => {
            this.materialGroups = res.list
        })
    },
    data: function () {
        return {
            dialogVisible: false,
            submissionForm: {
                id: '',
                itemCode: '',
                auditNo: '',
                contractNo: '',
                projectName: '',
                feeFrom: '',
                budget: 0,
                constructionUnit: '',
                startDate: '',
                endDate: '',
                contractMoney: 0,
                constructMoney: 0,
                installMoney: 0,
                constructionUnitApplyFee: 0,
                constructionUnitCheckFee: 0,
                constructionUnitTel: '',
                inspectUnitApplyFee: 0,
                inspectUnitCheckFee: 0,
                inspectUnitTel: '',
                buildUnitApplyFee: 0,
                buildUnitCheckFee: 0,
                buildUnitTel: '',
                content: '',
                description: '',
                materialGroup: '',
                details: [],
                status: 0,
                assigned: {
                    name: ''
                }
            },
            rules: {},
            materialGroups: [],
            uploadParams: {
                id: '',
            },
            comment: '',
            comments: [],
        }
    },
    methods: {
        commit: function (event) {
            let comp = this
            if (this.step === 'submission' || this.step === 'reject') {
                //送审提交
                this.$refs['submissionForm'].validate((valid) => {
                    if (valid) {
                        //验证附件上传情况
                        for (let type of this.submissionForm.details) {
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
                        for (let types of this.submissionForm.details) {
                            let ids = ''
                            for (let file of types.mFiles) {
                                ids = ids + ',' + file.id
                            }
                            types.mFileIds = ids.substr(1)
                        }
                        //提交
                        event(this.submissionForm)
                    } else {
                        Notification.error({
                            title: '提交失败!',
                            message: '表单信息有误,请检查!',
                            duration: 2000
                        })
                        return false;
                    }
                });
            } else {
                event(this.comment, this.submissionForm.id)
            }
        },
        print: function () {
            $(".upload-btn").hide()
            $(".print-info").show()
            $(".form").printArea({
                importCSS: false
            })
        },
        handleRemove(file, fileList) {
            //从附件列表中移除该文件
            let comp = this
            for (let types of comp.submissionForm.details) {
                let size = types.mFiles.length
                if (size !== 0) {
                    types.mFiles = types.mFiles.filter(f => f.uid !== file.uid)
                    if (types.mFiles.length < size) {
                        break
                    }
                }
            }
        },
        handlePreview(file) {
            window.open(file.url)
        },
        beforeRemove(file, fileList) {
            if (this.step !== 'submission' && this.step !== 'reject') {
                Notification.error({
                    title: '操作失败!',
                    message: '当前阶段不可移除附件!',
                    duration: 2000
                })
                return false;
            }
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        materialGroupChange: function (value) {
            //根据选择的清单组，初始化附加列表
            let comp = this
            MaterialFile.getMaterialGroup({id: value}).then(res => {
                comp.submissionForm.details.length = []
                for (let fType of res.materialGroup.details) {
                    comp.submissionForm.details.push({
                        mRequired: fType.material.required,
                        mId: fType.material.id,    //清单类型id
                        mName: fType.material.name,
                        mFiles: [], //上传的文件列表
                        mFileIds: '',  //上传的文件id集合(用于服务端接收 是mFiles数组中文件id的集合)
                        mNote: ''  //上传文件的备注
                    })
                }
            })
        },
        toUpload(typeId) {
            //上传之前暂存当前要上传文件所属的清单组Id
            this.uploadParams.id = typeId
        },
        upload(content) {
            //自定义附件上传
            let comp = this
            let fd = new FormData()
            fd.append('formFile', content.file)
            Upload.upload(comp.uploadParams.id, fd, (event) => {
                let num = event.loaded / event.total * 100 | 0;
                content.onProgress({percent: num})
            }).then(res => {
                content.onSuccess()
                //在对应的清单组的附件列表中添加上传文件的信息{上传成功服务器返回的id,列表控件里的uid}
                comp.submissionForm.details.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push({
                    'id': res.id,
                    'uid': content.file.uid,
                    'name': content.file.name
                })
            })
        },
    },
}
</script>

<style scoped>

</style>