<template>
    <el-dialog :title="工程结算送审表" class="form-dialog" :visible.sync="visible" :close-on-click-modal="false">
        <template>
            <div class="form">
                <el-form :model="submissionForm" :rules="formRules" ref="submissionForm">
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
                            <th class="form-required">合同编码</th>
                            <td>
                                <el-form-item prop="contractNo">
                                    <el-input v-model="submissionForm.contractNo"
                                              :disabled="step!=='submission' && step!=='reject'"></el-input>
                                </el-form-item>
                            </td>
                            <th class="form-required">工程项目名称</th>
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
                                    <el-input v-model="submissionForm.budget"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写预算"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">施工单位名称</th>
                            <td colspan="3">
                                <el-form-item prop="constructionUnit">
                                    <el-select v-model="submissionForm.constructionUnit"
                                               :disabled="step!=='submission' && step!=='reject'"
                                               filterable
                                               @change="unitChange"
                                               placeholder="填写施工单位名称" style="width: 220px;">
                                        <el-option
                                            v-for="unit in units"
                                            :key="unit.value"
                                            :label="unit.label"
                                            :value="unit.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">开工时间</th>
                            <td>
                                <el-form-item prop="startDate">
                                    <el-date-picker v-model="submissionForm.startDate"
                                                    :disabled="step!=='submission' && step!=='reject'"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th class="form-required">竣工时间</th>
                            <td>
                                <el-form-item prop="endDate">
                                    <el-date-picker v-model="submissionForm.endDate"
                                                    :disabled="step!=='submission' && step!=='reject'"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th rowspan="2">中标合同金额</th>
                            <td rowspan="2">
                                <el-form-item prop="contractMoney">
                                    <el-input v-model="submissionForm.contractMoney"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写中标合同金额"></el-input>
                                </el-form-item>
                            </td>
                            <th>土建</th>
                            <td>
                                <el-form-item prop="constructMoney">
                                    <el-input v-model="submissionForm.constructMoney"
                                              :disabled="step!=='submission' && step!=='reject'"
                                              placeholder="填写土建金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
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
                            <th class="form-required">结算方式</th>
                            <td colspan="3" v-if="step === 'submission' || step === 'reject'">
                                <el-form-item prop="payType">
                                    <el-radio v-model="submissionForm.payType" label="按实结算"
                                              border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payTypeChange">
                                        按实结算
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="中标价+变更价" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payTypeChange">
                                        中标价+变更价
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="固定单价" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payTypeChange">
                                        固定单价
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="其他" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payTypeChange">
                                        其他
                                    </el-radio>
                                </el-form-item>
                                <el-form-item prop="payTypeOther">
                                    <el-input v-model="submissionForm.payTypeOther"
                                              v-if="submissionForm.payType==='其他'"
                                              :disabled="step!=='submission' && step!=='reject'" style="margin-top: 5px"
                                              placeholder="其他结算方式"></el-input>
                                </el-form-item>
                            </td>
                            <td colspan="3" v-if="step !== 'submission' && step !== 'reject'">
                                <el-input v-model="submissionForm.payType"
                                          :disabled="step!=='submission' && step!=='reject'"
                                          style="width: 200px"></el-input>
                                <el-input v-model="submissionForm.payTypeOther"
                                          v-if="submissionForm.payType==='其他'"
                                          :disabled="step!=='submission' && step!=='reject'"
                                          style="width: 200px"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <th class="form-required">付款情况</th>
                            <td colspan="3" v-if="step === 'submission' || step === 'reject'">
                                <el-form-item prop="payCondition">
                                    <el-radio v-model="submissionForm.payCondition" label="未付款" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payConditionChange">
                                        未付款
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="合同价50%" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payConditionChange">
                                        合同价50%
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="合同价70%" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payConditionChange">
                                        合同价70%
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="其他" border
                                              :disabled="step!=='submission' && step!=='reject'"
                                              @change="payConditionChange">
                                        其他
                                    </el-radio>
                                </el-form-item>
                                <el-form-item prop="payConditionOther">
                                    <el-input v-model="submissionForm.payConditionOther"
                                              v-if="submissionForm.payCondition==='其他'"
                                              :disabled="step!=='submission' && step!=='reject'" style="margin-top: 5px"
                                              placeholder="其他付款情况"></el-input>
                                </el-form-item>
                            </td>
                            <td colspan="3" v-if="step !== 'submission' && step !== 'reject'">
                                <el-input v-model="submissionForm.payCondition"
                                          :disabled="step!=='submission' && step!=='reject'"
                                          style="width: 200px"></el-input>
                                <el-input v-model="submissionForm.payConditionOther"
                                          v-if="submissionForm.payCondition==='其他'"
                                          :value="submissionForm.payCondition==='其他'?'':'无'"
                                          :disabled="step!=='submission' && step!=='reject'"
                                          style="width: 200px"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:15%">报审单位</th>
                                        <th>报审金额（元）</th>
                                        <th>核减金额（元）</th>
                                        <th>项目负责人</th>
                                        <th>联系电话</th>
                                    </tr>
                                    <tr>
                                        <th>施工单位</th>
                                        <td>
                                            <el-form-item prop="constructionUnitApplyFee">
                                                <el-input v-model="submissionForm.constructionUnitApplyFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="施工单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>

                                        </td>
                                        <td>
                                            <el-form-item prop="constructionUnitProjectMan">
                                                <el-select v-model="submissionForm.constructionUnitProjectMan"
                                                           @change="projectManChange"
                                                           :disabled="step!=='submission' && step!=='reject'"
                                                           placeholder="请选择项目负责人">
                                                    <el-option
                                                        v-for="pman in projectMans"
                                                        :key="pman.value"
                                                        :label="pman.label"
                                                        :value="pman.value">
                                                    </el-option>
                                                </el-select>
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
                                                          placeholder="监理单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitCheckFee">
                                                <el-input v-model="submissionForm.inspectUnitCheckFee"
                                                          disabled></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitProjectMan">
                                                <el-input v-model="submissionForm.inspectUnitProjectMan"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="监理单位项目负责人"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitTel">
                                                <el-input v-model="submissionForm.inspectUnitTel"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="监理单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>建设单位</th>
                                        <td>
                                            <el-form-item prop="buildUnitApplyFee">
                                                <el-input v-model="submissionForm.buildUnitApplyFee"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="建设单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitCheckFee">
                                                <el-input v-model="submissionForm.buildUnitCheckFee"
                                                          disabled></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitProjectMan">
                                                <el-input v-model="submissionForm.buildUnitProjectMan"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="建设单位项目负责人"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitTel">
                                                <el-input v-model="submissionForm.buildUnitTel"
                                                          :disabled="step!=='submission' && step!=='reject'"
                                                          placeholder="建设单位联系电话"></el-input>
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
                            <th class="form-required">资料清单组</th>
                            <td colspan="3">
                                <el-form-item prop="materialGroup">
                                    <el-select v-model="submissionForm.materialGroup" placeholder="请选择"
                                               :disabled="step!=='submission' && step!=='reject'"
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
                                        <th style="width:20%">资料清单</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.details">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; "
                                                                      v-if="fileType.mRequired">*</span>
                                        </td>
                                        <td>
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemove" :before-remove="beforeRemove"
                                                       :on-success="afterUpload" :data="uploadParams"
                                                       multiple :on-exceed="handleExceed"
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
                        <tr class="allocMan" v-if="stepCode>=30">
                            <th>审计方式</th>
                            <td colspan="3">
                                <el-input type="text" v-model="submissionForm.auditType" disabled></el-input>
                            </td>
                        </tr>

                        <tr class="allocMan"
                            v-if="stepCode>=30 && submissionForm.assigned">
                            <th v-if="submissionForm.assigned.thirdParty">分配审计单位</th>
                            <th v-if="!submissionForm.assigned.thirdParty">分配审计人员</th>
                            <td>
                                <el-input type="text" v-model="submissionForm.assignName" disabled></el-input>
                            </td>
                            <th>联系方式</th>
                            <td>
                                <el-input type="text" v-model="submissionForm.assigned.telphone" disabled></el-input>
                            </td>
                        </tr>
                        <tr class="allocMan"
                            v-if="stepCode>=30 && submissionForm.assigned && submissionForm.assigned.thirdParty">
                            <th>联系人</th>
                            <td colspan="3">
                                <el-input type="text" v-model="submissionForm.assigned.name" disabled></el-input>
                            </td>
                        </tr>
                        <!--这里的意见非表单数据 是写入意见表的-->
                        <tr class="comment" v-if="step==='project' || step === 'assigned'">
                            <th>审计意见</th>
                            <td colspan="3" :class="stepCode===10||stepCode===30?'editing':''">
                                <el-input type="textarea" v-model="comment"></el-input>
                            </td>
                        </tr>
                        <tr class="comment" v-if="stepCode>=40">
                            <th class="form-required">约看现场时间
                            </th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="prepareViewDate">
                                    <el-date-picker v-model="submissionForm.prepareViewDate"
                                                    :disabled="step!=='surveyPrepare'" format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th class="form-required">现场查看时间</th>
                            <td :class="stepCode===40?'editing':''">
                                <el-form-item prop="viewDate">
                                    <el-date-picker v-model="submissionForm.viewDate" :disabled="step!=='surveyPrepare'"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="comment" v-if="stepCode>=50">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width: 30%">相关单位</th>
                                        <th>现场查看人员</th>
                                    </tr>
                                    <tr>
                                        <td>审核单位</td>
                                        <td colspan="3" :class="stepCode===50?'editing':''">
                                            <el-form-item prop="viewPeoplesAuditUnit">
                                                <el-select v-model="submissionForm.viewPeoplesAuditUnit"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='survey'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>建设单位</td>
                                        <td colspan="3" :class="stepCode===50?'editing':''">
                                            <el-form-item prop="viewPeoplesBuildUnit">
                                                <el-select v-model="submissionForm.viewPeoplesBuildUnit"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='survey'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>施工单位</td>
                                        <td colspan="3" :class="stepCode===50?'editing':''">
                                            <el-form-item prop="viewPeoplesConstructUnit">
                                                <el-select v-model="submissionForm.viewPeoplesConstructUnit"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='survey'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>委托单位</td>
                                        <td colspan="3" :class="stepCode===50?'editing':''">
                                            <el-form-item prop="viewPeoplesEntrustUnitIds">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesEntrustUnitIds"
                                                          :disabled="step!=='survey'"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=50">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:20%">现场勘察资料</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.surveyFiles">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </td>
                                        <td :class="stepCode===50?'editing':''">
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemoveSurvey"
                                                       :before-remove="beforeRemoveSurvey" :on-success="afterUpload"
                                                       multiple :on-exceed="handleExceed"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='survey'" @click="toUpload(fileType.mId)">点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote" :disabled="step!=='survey'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=60 || stepCode === -30">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:20%">争议处理资料</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.argueFiles">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </td>
                                        <td :class="stepCode===60?'editing':''">
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemoveArgue" :before-remove="beforeRemoveArgue"
                                                       :on-success="afterUpload" multiple
                                                       :on-exceed="handleExceed" :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='argueHandle'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote" :disabled="step!=='argueHandle'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>


                        <tr class="comment" v-if="stepCode>=70">
                            <th class="form-required">约看现场时间(初审)</th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="prepareViewDate2">
                                    <el-date-picker v-model="submissionForm.prepareViewDate2"
                                                    :disabled="step!=='auditFirst'" format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th>现场查看时间(初审)<span style="color: red; ">*</span></th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="viewDate2">
                                    <el-date-picker v-model="submissionForm.viewDate2"
                                                    :disabled="step!=='auditFirst'"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="comment" v-if="stepCode>=70">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width: 30%">相关单位</th>
                                        <th>现场查看人员(初审)</th>
                                    </tr>
                                    <tr>
                                        <td>审核单位</td>
                                        <td colspan="3" :class="stepCode===70?'editing':''">
                                            <el-form-item prop="viewPeoplesAuditUnit2">
                                                <el-select v-model="submissionForm.viewPeoplesAuditUnit2"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='auditFirst'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>建设单位</td>
                                        <td colspan="3" :class="stepCode===70?'editing':''">
                                            <el-form-item prop="viewPeoplesBuildUnit2">
                                                <el-select v-model="submissionForm.viewPeoplesBuildUnit2"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='auditFirst'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>施工单位</td>
                                        <td colspan="3" :class="stepCode===70?'editing':''">
                                            <el-form-item prop="viewPeoplesConstructUnit2">
                                                <el-select v-model="submissionForm.viewPeoplesConstructUnit2"
                                                           style="width:700px" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='auditFirst'">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>委托单位</td>
                                        <td colspan="3" :class="stepCode===70?'editing':''">
                                            <el-form-item prop="viewPeoplesEntrustUnitIds2">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesEntrustUnitIds2"
                                                          :disabled="step!=='auditFirst'"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70">
                            <th>送审价</th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="submissionPrice">
                                    <el-input v-model="submissionForm.submissionPrice" :disabled="step!=='auditFirst'"
                                              placeholder="填写送审价"></el-input>
                                </el-form-item>
                            </td>
                            <th>初审审定金额<span style="color: red; ">*</span></th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="firstAuditPrice">
                                    <el-input v-model="submissionForm.firstAuditPrice" :disabled="step!=='auditFirst'"
                                              placeholder="填写土建金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70">
                            <th class="form-required">初审核减额</th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="submissionPrice">
                                    <el-input v-model="submissionForm.auditFirstSub" disabled></el-input>
                                </el-form-item>
                            </td>
                            <th class="form-required">初审核减率%</th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="firstAuditPrice">
                                    <el-input v-model="submissionForm.auditFirstSubRatio"
                                              disabled
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:20%">初审资料</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.auditFirstFiles">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </td>
                                        <td :class="stepCode===70?'editing':''">
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemoveAuditFirst"
                                                       :before-remove="beforeRemoveAuditFirst" :on-success="afterUpload"
                                                       multiple :on-exceed="handleExceed"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditFirst'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote" :disabled="step!=='auditFirst'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80">
                            <th class="form-required">复审审定金额</th>
                            <td :class="stepCode===80?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="submissionForm.secondAuditPrice" :disabled="step!=='auditSecond'"
                                              placeholder="填写复审审定金额"></el-input>
                                </el-form-item>
                            </td>
                            <th class="form-required">复审核减额</th>
                            <td :class="stepCode===80?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="submissionForm.auditSecondSub"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80">
                            <th class="form-required">复审核减率</th>
                            <td colspan="3" :class="stepCode===80?'editing':''">
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="submissionForm.auditSecondSubRatio"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80">
                            <th class="form-required">审计备注</th>
                            <td colspan="3" :class="stepCode===80?'editing':''">
                                <el-form-item prop="auditNote">
                                    <el-input type="textarea" v-model="submissionForm.auditNote"
                                              :disabled="step!=='auditSecond'"
                                              placeholder="审计备注"></el-input>
                                </el-form-item>
                            </td>
                        </tr>


                        <tr v-if="stepCode>=80">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:20%">复审资料</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.auditSecondFiles">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </td>
                                        <td :class="stepCode===80?'editing':''">
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemoveAuditSecond"
                                                       :before-remove="beforeRemoveAuditSecond"
                                                       :on-success="afterUpload"
                                                       multiple :on-exceed="handleExceed"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditSecond'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote" :disabled="step!=='auditSecond'"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="step ==='argueDeal' || stepCode>=60">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th style="width:20%">补充资料</th>
                                        <th style="width:30%">附件</th>
                                        <th style="width:50%">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.supplementFiles">
                                        <td>
                                            {{ fileType.mName }}<span style="color: red; ">*</span>
                                        </td>
                                        <td>
                                            <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                                       :with-credentials="true" :on-preview="handlePreview"
                                                       :on-remove="handleRemoveSupplement"
                                                       :before-remove="beforeRemoveSupplement"
                                                       :on-success="afterUpload"
                                                       multiple :on-exceed="handleExceed"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='argueDeal'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input v-model="fileType.mNote" :disabled="step!=='argueDeal'"
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
import {
    Notification
} from "element-ui";
import MaterialFile from "../script/server/materialFile";
import Upload from "../script/server/upload";
import Audit from "../script/server/audit";
import Comment from "../script/server/comment";
import ClientCall from "../script/client/clientCall"
import Env from "../script/server/env"
import ConstructionUnit from "../script/server/constructionUnit";

export default {
    name: "SubmissionForm",
    props: ['visible', 'from', 'formOpers', 'step', 'formId', 'formRules', 'formRules2', 'stepCode'],
    watch: {
        'submissionForm.constructionUnitApplyFee': function (newVal) {
            this.submissionForm.inspectUnitCheckFee = newVal - this.submissionForm.inspectUnitApplyFee
            this.submissionForm.buildUnitCheckFee = newVal - this.submissionForm.buildUnitApplyFee
        },
        'submissionForm.inspectUnitApplyFee': function (newVal) {
            this.submissionForm.inspectUnitCheckFee = this.submissionForm.constructionUnitApplyFee - newVal
        },
        'submissionForm.buildUnitApplyFee': function (newVal) {
            this.submissionForm.buildUnitCheckFee = this.submissionForm.constructionUnitApplyFee - newVal
        },
        'submissionForm.submissionPrice': function () {
            this.calAuditFirst()
        },
        'submissionForm.firstAuditPrice': function () {
            this.calAuditFirst()
        },
        'submissionForm.secondAuditPrice': function () {
            this.calAuditSecond()
        },
        visible: function (newVal) {
            if (newVal) {
                this.submissionForm.details = []
                this.$nextTick(() => {
                    if (this.from === 'addform') {
                        this.$refs['submissionForm'].resetFields();
                        $(".comment").hide()
                    } else if (this.from === 'editform') {

                        if (this.stepCode >= 50) {
                            ClientCall.getEmps().then(result => {
                                this.users = []
                                result.list.content.forEach(user => {
                                    this.users.push({
                                        value: user.id,
                                        label: user.name
                                    })
                                })
                            })
                        }
                        //加载form
                        Audit.getSubmission({
                            id: this.formId
                        }).then(result => {

                            //加载现场勘察资料
                            if (!result.submission.surveyFiles || result.submission.surveyFiles.length === 0) {
                                result.submission.surveyFiles = [{
                                    mId: '-1',
                                    mName: '勘察记录',
                                    mFiles: [],
                                    mFileIds: '',
                                    mNote: ''
                                },
                                    {
                                        mId: '-2',
                                        mName: '勘察照片',
                                        mFiles: [],
                                        mFileIds: '',
                                        mNote: ''
                                    }
                                ]
                            }
                            //加载争议处理资料
                            if (!result.submission.argueFiles || result.submission.argueFiles.length === 0) {
                                result.submission.argueFiles = [{
                                    mId: '-3',
                                    mName: '联系单',
                                    mFiles: [],
                                    mFileIds: '',
                                    mNote: ''
                                },]
                            }
                            //加载初审资料附件
                            if (!result.submission.auditFirstFiles || result.submission.auditFirstFiles.length === 0) {
                                result.submission.auditFirstFiles = [
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
                            if (!result.submission.auditSecondFiles || result.submission.auditSecondFiles.length === 0) {
                                result.submission.auditSecondFiles = [
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
                            //加载补充资料附件
                            if (!result.submission.supplementFiles || result.submission.supplementFiles.length === 0) {
                                result.submission.supplementFiles = [{
                                    mId: '-12',
                                    mName: '补充资料',
                                    mFiles: [],
                                    mFileIds: '',
                                    mNote: ''
                                }]
                            }

                            for (let p in result.submission) {
                                this.submissionForm[p] = result.submission[p]
                            }

                            if (this.submissionForm.materialGroup) {
                                MaterialFile.getMaterialGroup({
                                    id: this.submissionForm.materialGroup
                                }).then(res => {
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
                            }

                            //获取意见
                            this.comments = []
                            Comment.getComment({
                                target: 'submission',
                                targetId: this.submissionForm.id
                            }).then(res => {
                                this.comments = res.list
                            })

                            //加载施工单位项目负责人列表
                            this.setProjectMans(this.submissionForm.constructionUnit)

                            if (this.stepCode > 30) {
                                //加载分配人字段
                                if (this.submissionForm.assigned) {
                                    if (this.submissionForm.assigned.thirdParty) {
                                        this.submissionForm.assignName = this.submissionForm.assigned.thirdPartyName
                                    } else {
                                        this.submissionForm.assignName = this.submissionForm.assigned.name
                                    }
                                }
                            }

                            if (this.stepCode > 50) {
                                //加载现场查看人员字段(选择的字段)
                                if (this.submissionForm.viewPeoplesAuditUnitIds) {
                                    this.submissionForm.viewPeoplesAuditUnit = []
                                    this.submissionForm.viewPeoplesAuditUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesAuditUnit.push(id - 0)
                                    })

                                    this.submissionForm.viewPeoplesBuildUnit = []
                                    this.submissionForm.viewPeoplesBuildUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesBuildUnit.push(id - 0)
                                    })

                                    this.submissionForm.viewPeoplesConstructUnit = []
                                    this.submissionForm.viewPeoplesConstructUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesConstructUnit.push(id - 0)
                                    })
                                }
                            }

                            if (this.stepCode >= 70) {
                                if (this.stepCode === 70) {
                                    //初始化约看时间为勘察准备和勘察阶段填写的值
                                    let prepareViewDate = this.submissionForm.prepareViewDate
                                    let vewDate = this.submissionForm.viewDate
                                    let viewPeoplesEntrustUnitIds = this.submissionForm.viewPeoplesEntrustUnitIds

                                    this.submissionForm.prepareViewDate2 = prepareViewDate
                                    this.submissionForm.viewDate2 = vewDate

                                    this.submissionForm.viewPeoplesAuditUnit2 = []
                                    this.submissionForm.viewPeoplesAuditUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesAuditUnit2.push(id - 0)
                                    })
                                    this.submissionForm.viewPeoplesBuildUnit2 = []
                                    this.submissionForm.viewPeoplesBuildUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesBuildUnit2.push(id - 0)
                                    })
                                    this.submissionForm.viewPeoplesConstructUnit2 = []
                                    this.submissionForm.viewPeoplesConstructUnitIds.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesConstructUnit2.push(id - 0)
                                    })

                                    this.submissionForm.viewPeoplesEntrustUnitIds2 = viewPeoplesEntrustUnitIds

                                } else {

                                    this.submissionForm.viewPeoplesAuditUnit2 = []
                                    this.submissionForm.viewPeoplesAuditUnitIds2.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesAuditUnit2.push(id - 0)
                                    })
                                    this.submissionForm.viewPeoplesBuildUnit2 = []
                                    this.submissionForm.viewPeoplesBuildUnitIds2.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesBuildUnit2.push(id - 0)
                                    })
                                    this.submissionForm.viewPeoplesConstructUnit2 = []
                                    this.submissionForm.viewPeoplesConstructUnitIds2.split(',').forEach(id => {
                                        this.submissionForm.viewPeoplesConstructUnit2.push(id - 0)
                                    })
                                }

                                //送审价=建设单位报审金额
                                this.submissionForm.submissionPrice = this.submissionForm.buildUnitApplyFee
                            }

                            if (this.stepCode >= 80) {
                                //将复审审定金额默认设置为初审审定金额
                                if (!this.submissionForm.secondAuditPrice || this.submissionForm.secondAuditPrice === 0) {
                                    this.submissionForm.secondAuditPrice = this.submissionForm.firstAuditPrice
                                }
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
        MaterialFile.getMaterialGroups().then(res => {
            this.materialGroups = res.list
        })
        ConstructionUnit.getConstructionUnits({
            page: 1,
            pageSize: 999999,
        }).then(res => {
            this.units = []
            res.list.content.forEach(unit => {
                this.units.push({
                    value: unit.id,
                    label: unit.name,
                    links: unit.links
                })
            })
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
                payType: '',
                payTypeOther: '',
                payCondition: '',
                payConditionOther: '',
                constructionUnitApplyFee: 0,
                constructionUnitCheckFee: 0,
                constructionUnitProjectMan: '',
                constructionUnitTel: '',
                inspectUnitApplyFee: 0,
                inspectUnitCheckFee: 0,
                inspectUnitProjectMan: '',
                inspectUnitTel: '',
                buildUnitApplyFee: 0,
                buildUnitCheckFee: 0,
                buildUnitProjectMan: '',
                buildUnitTel: '',
                content: '',
                description: '',
                materialGroup: '',
                details: [], //资料清单信息
                status: 0,
                //分配人
                assignName: '',
                assigned: {
                    thirdParty: false,
                },
                //勘察准备-----------
                prepareViewDate: '',
                viewDate: '',
                //现场勘察--------------
                surveyFiles: [],
                viewPeoplesAuditUnit: [],
                viewPeoplesBuildUnit: [],
                viewPeoplesConstructUnit: [],
                viewPeoplesEntrustUnitIds: '',
                //争议处理
                argueFiles: [],
                //审计初审--------------
                submissionPrice: 0,
                firstAuditPrice: 0,
                auditFirstFiles: [],
                prepareViewDate2: '',
                viewDate2: '',
                viewPeoplesAuditUnit2: [],
                viewPeoplesBuildUnit2: [],
                viewPeoplesConstructUnit2: [],
                viewPeoplesEntrustUnitIds2: '',
                auditFirstSub: '',
                auditFirstSubRatio: '',
                //审计复审
                secondAuditPrice: 0,
                auditNote: '',
                auditSecondSub: '',
                auditSecondSubRatio: '',
                auditSecondFiles: [],
                //争议处理，申请人补充上传资料
                supplementFiles: [],
            },
            materialGroups: [],
            uploadParams: {
                id: '',
            },
            comment: '',
            comments: [],
            users: [],
            units: [],
            projectMans: [],
        }
    },
    methods: {
        calAuditFirst: function () {
            this.submissionForm.auditFirstSub = this.submissionForm.submissionPrice - this.submissionForm.firstAuditPrice
            this.submissionForm.auditFirstSubRatio = (this.submissionForm.auditFirstSub / this.submissionForm.submissionPrice).toFixed(2)
        },
        calAuditSecond: function () {
            this.submissionForm.auditSecondSub = this.submissionForm.firstAuditPrice - this.submissionForm.secondAuditPrice
            this.submissionForm.auditSecondSubRatio = (this.submissionForm.auditSecondSub / this.submissionForm.firstAuditPrice).toFixed(2)
        },
        unitChange: function (val) {
            this.projectMans.length = 0
            this.submissionForm.constructionUnitProjectMan = ''
            this.submissionForm.constructionUnitTel = ''
            this.setProjectMans(val)
        },
        setProjectMans: function (val) {
            this.units.filter(u => u.value === val)[0].links.forEach(link => {
                this.projectMans.push({
                    label: link.contact,
                    value: link.id + "",
                    telphone: link.telphone,
                })
            });
        },
        projectManChange: function (val) {
            this.submissionForm.constructionUnitTel = this.projectMans.filter(man => man.value === val)[0].telphone
        },
        commit: function (event) {
            if ((this.step === 'submission' && event.name.indexOf('save') === -1) ||
                this.step === 'reject' ||
                this.step === 'surveyPrepare' ||
                this.step === 'survey' ||
                this.step === 'auditFirst' ||
                this.step === 'auditSecond') {
                //需要验证表单的提交
                this.$refs['submissionForm'].validate((valid) => {
                    if (valid) {
                        if (this.step === 'submission' || this.step === 'reject') {
                            //验证资料组清单附件上传情况
                            let fileOk = true
                            for (let type of this.submissionForm.details) {
                                if (type.mRequired) {
                                    if ((!type.mFiles || type.mFiles.length === 0) && (!type.mNote || type.mNote.match(/^[ ]*$/))) {
                                        setTimeout(function () {
                                            Notification.error({
                                                title: '提交失败!',
                                                message: type.mName + '必须上传附件或填写备注！',
                                                duration: 5000
                                            })
                                        }, 100);
                                        fileOk = false
                                    }
                                }
                            }

                            if (!fileOk) {
                                return
                            }

                            this.fileIdsConstruct(this.submissionForm.details)
                            event(this.submissionForm)
                        } else if (this.step === 'surveyPrepare') {
                            event({
                                targetId: this.submissionForm.id,
                                prepareViewDate: this.submissionForm.prepareViewDate,
                                viewDate: this.submissionForm.viewDate,
                                type: 2
                            })
                        } else if (this.step === 'survey') {
                            //验证现场勘察附件上传情况
                            if (this.fileListCheck(this.submissionForm.surveyFiles)) {
                                //附件列表转换为serverId字符串
                                this.fileIdsConstruct(this.submissionForm.surveyFiles)
                                event({
                                    targetId: this.submissionForm.id,
                                    surveyFiles: this.submissionForm.surveyFiles,
                                    viewPeoplesAuditUnitIds: this.submissionForm.viewPeoplesAuditUnit.toString(),
                                    viewPeoplesBuildUnitIds: this.submissionForm.viewPeoplesBuildUnit.toString(),
                                    viewPeoplesConstructUnitIds: this.submissionForm.viewPeoplesConstructUnit.toString(),
                                    viewPeoplesEntrustUnitIds: this.submissionForm.viewPeoplesEntrustUnit,
                                    type: 2
                                })
                            }
                        } else if (this.step === 'auditFirst') {
                            //验证现场勘察附件上传情况
                            if (this.fileListCheck(this.submissionForm.auditFirstFiles)) {
                                this.fileIdsConstruct(this.submissionForm.auditFirstFiles)
                                event({
                                    targetId: this.submissionForm.id,
                                    type: 2,
                                    submissionPrice: this.submissionForm.submissionPrice,
                                    firstAuditPrice: this.submissionForm.firstAuditPrice,
                                    auditFirstSub: this.submissionForm.auditFirstSub,
                                    auditFirstSubRatio: this.submissionForm.auditFirstSubRatio,
                                    auditFirstFiles: this.submissionForm.auditFirstFiles,
                                    prepareViewDate2: this.submissionForm.prepareViewDate2,
                                    viewDate2: this.submissionForm.viewDate2,
                                    viewPeoplesAuditUnitIds2: this.submissionForm.viewPeoplesAuditUnit2.toString(),
                                    viewPeoplesBuildUnitIds2: this.submissionForm.viewPeoplesBuildUnit2.toString(),
                                    viewPeoplesConstructUnitIds2: this.submissionForm.viewPeoplesConstructUnit2.toString(),
                                    viewPeoplesEntrustUnitIds2: this.submissionForm.viewPeoplesEntrustUnitIds2,
                                })
                            }
                        } else if (this.step === 'auditSecond') {
                            if (this.fileListCheck(this.submissionForm.auditSecondFiles)) {
                                this.fileIdsConstruct(this.submissionForm.auditSecondFiles)
                                event({
                                    targetId: this.submissionForm.id,
                                    type: 2,
                                    secondAuditPrice: this.submissionForm.secondAuditPrice,
                                    auditSecondSub: this.submissionForm.auditSecondSub,
                                    auditSecondSubRatio: this.submissionForm.auditSecondSubRatio,
                                    auditNote: this.submissionForm.auditNote,
                                    auditSecondFiles: this.submissionForm.auditSecondFiles,
                                })
                            }
                        }
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
                if (this.step === 'submission') {
                    //保存不验证必填
                    this.fileIdsConstruct(this.submissionForm.details)
                    event(this.submissionForm)
                } else if (this.step === 'argueHandle') {
                    this.fileIdsConstruct(this.submissionForm.argueFiles)
                    event({
                        targetId: this.submissionForm.id,
                        argueFiles: this.submissionForm.argueFiles,
                        type: 2
                    })
                } else if (this.step === 'argueDeal') {
                    this.fileIdsConstruct(this.submissionForm.supplementFiles)
                    event({
                        targetId: this.submissionForm.id,
                        supplementFiles: this.submissionForm.supplementFiles,
                        type: 2
                    })
                } else {
                    event(this.comment, this.submissionForm.id)
                }
            }
        },
        print: function () {
            $(".upload-btn").hide()
            $(".print-info").show()
            $(".form").printArea({
                importCSS: false
            })
        },
        //验证附件上传
        fileListCheck(list) {
            let fileOk = true
            for (let type of list) {
                if (!type.mFiles || type.mFiles.length === 0) {
                    setTimeout(function () {
                        Notification.error({
                            title: '提交失败!',
                            message: type.mName + '必须上传附件！',
                            duration: 5000
                        })
                    }, 100);
                    fileOk = false
                }
            }
            return fileOk
        },
        //拼接附件id
        fileIdsConstruct(list) {
            for (let types of list) {
                let ids = ''
                for (let file of types.mFiles) {
                    ids = ids + ',' + file.id
                }
                types.mFileIds = ids.substr(1)
            }
        },
        //资料清单移除方法
        handleRemove(file) {
            this.removeFileFromList(file, this.submissionForm.details)
        },
        beforeRemove(file) {
            return this.removeableConfirm(file, ['submission', 'reject'], '当前阶段不可移除资料清单附件!')
        },
        //初审资料移除方法
        handleRemoveAuditFirst(file) {
            this.removeFileFromList(file, this.submissionForm.auditFirstFiles)
        },
        beforeRemoveAuditFirst(file) {
            return this.removeableConfirm(file, ['auditFirst'], '当前阶段不可移除初审资料附件!')
        },
        //现场勘察资料移除方法
        handleRemoveSurvey(file) {
            this.removeFileFromList(file, this.submissionForm.surveyFiles)
        },
        beforeRemoveSurvey(file) {
            return this.removeableConfirm(file, ['survey'], '当前阶段不可移除现场勘察资料附件!')
        },
        //争议处理移除方法
        handleRemoveArgue(file) {
            this.removeFileFromList(file, this.submissionForm.argueFiles)
        },
        beforeRemoveArgue(file) {
            return this.removeableConfirm(file, ['argueHandle'], '当前阶段不可移除争议处理资料附件!')
        },
        //复审资料移除方法
        handleRemoveAuditSecond(file) {
            this.removeFileFromList(file, this.submissionForm.auditSecondFiles)
        },
        beforeRemoveAuditSecond(file) {
            return this.removeableConfirm(file, ['auditSecond'], '当前阶段不可移除复审资料附件!')
        },
        //补充资料
        handleRemoveSupplement(file) {
            this.removeFileFromList(file, this.submissionForm.supplementFiles)
        },
        beforeRemoveSupplement(file) {
            return this.removeableConfirm(file, ['argueDeal'], '当前阶段不可移除补充资料附件!')
        },
        removeableConfirm(file, steps, message) {
            if (steps.indexOf(this.step) < 0) {
                Notification.error({
                    title: '操作失败!',
                    message: message,
                    duration: 2000
                })
                return false;
            }
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        removeFileFromList(file, list) {
            for (let types of list) {
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
            window.open(Env.baseURL + file.url)
        },
        materialGroupChange: function (value) {
            //根据选择的清单组，初始化附加列表
            let comp = this
            MaterialFile.getMaterialGroup({
                id: value
            }).then(res => {
                comp.submissionForm.details.length = []
                for (let fType of res.materialGroup.details) {
                    comp.submissionForm.details.push({
                        mRequired: fType.material.required,
                        mId: fType.material.id, //清单类型id
                        mName: fType.material.name,
                        mFiles: [], //上传的文件列表
                        mFileIds: '', //上传的文件id集合(用于服务端接收 是mFiles数组中文件id的集合)
                        mNote: '' //上传文件的备注
                    })
                }
            })
        },
        toUpload(typeId) {
            //上传之前暂存当前要上传文件所属的清单组Id
            this.uploadParams.id = typeId
        },
        upload(content) {
            let comp = this
            let fd = new FormData()
            fd.append('formFile', content.file)
            Upload.upload(comp.uploadParams.id, fd, (event) => {
                let num = event.loaded / event.total * 100 | 0;
                content.onProgress({
                    percent: num
                })
            }).then(res => {
                content.onSuccess()
                //在对应的清单组的附件列表中添加上传文件的信息{上传成功服务器返回的id,列表控件里的uid}
                let fileData = {
                    'id': res.id,
                    'uid': content.file.uid,
                    'name': content.file.name
                }

                if (comp.step === 'survey') {//现场勘察阶段上传的勘察资料
                    comp.submissionForm.surveyFiles.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                } else if (comp.step === 'argueDeal') {
                    comp.submissionForm.supplementFiles.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                } else if (comp.step === 'argueHandle') {
                    comp.submissionForm.argueFiles.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                } else if (comp.step === 'auditFirst') {
                    comp.submissionForm.auditFirstFiles.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                } else if (comp.step === 'auditSecond') {
                    comp.submissionForm.auditSecondFiles.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                } else {
                    //送审阶段上传的资料清单
                    comp.submissionForm.details.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push(fileData)
                }
            })
        },
        payConditionChange(val) {
            if (val === '其他') {
                this.formRules['payConditionOther'] = this.formRules2['payConditionOther']
            } else {
                delete this.formRules.payConditionOther
                this.submissionForm.payConditionOther = ''
            }
        },
        payTypeChange(val) {
            if (val === '其他') {
                this.formRules['payTypeOther'] = this.formRules2['payTypeOther']
            } else {
                delete this.formRules.payTypeOther
                this.submissionForm.payTypeOther = ''
            }
        }
    },
}
</script>

<style scoped>

</style>
