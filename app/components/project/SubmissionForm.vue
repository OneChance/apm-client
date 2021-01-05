<template>
    <el-dialog class="form-dialog" :visible.sync="visible" :close-on-click-modal="false">
        <template>
            <div :ref="formName?formName+'sub':'submission'">
                <el-form :model="submissionForm" :rules="formRules" ref="submissionForm">
                    <p class="title">工程结算送审表</p>
                    <table class="form-table">
                        <tr>
                            <th :class="(stepCode===10 && !readonly)?' first-th editing':'first-th'"
                                class="">审计编号
                            </th>
                            <td>
                                <el-form-item prop="auditNo">
                                    <el-input v-model="submissionForm.auditNo"
                                              disabled=true></el-input>
                                </el-form-item>
                            </td>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">合同编号</th>
                            <td>
                                <el-form-item prop="contractNo">
                                    <el-input v-model="submissionForm.contractNo"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">工程项目名称</th>
                            <td>
                                <el-form-item prop="projectName">
                                    <el-input v-model="submissionForm.projectName"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              placeholder="填写工程项目名称"></el-input>
                                </el-form-item>
                            </td>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">项目地点</th>
                            <td>
                                <el-form-item prop="projectPlace">
                                    <el-select v-model="submissionForm.projectPlace"
                                               :disabled="(step!=='submission' && step!=='reject')||readonly"
                                               placeholder="请选择项目地点"
                                               class="form-select">
                                        <el-option label="荷花池" value="荷花池"></el-option>
                                        <el-option label="文汇路" value="文汇路"></el-option>
                                        <el-option label="瘦西湖" value="瘦西湖"></el-option>
                                        <el-option label="江阳路南" value="江阳路南"></el-option>
                                        <el-option label="江阳路北" value="江阳路北"></el-option>
                                        <el-option label="扬子津东" value="扬子津东"></el-option>
                                        <el-option label="扬子津西" value="扬子津西"></el-option>
                                        <el-option label="淮海路" value="淮海路"></el-option>
                                        <el-option label="广陵学院" value="广陵学院"></el-option>
                                        <el-option label="康源乳业" value="康源乳业"></el-option>
                                        <el-option label="高邮园区" value="高邮园区"></el-option>
                                        <el-option label="其他" value="其他"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">施工单位名称</th>
                            <td colspan="3">
                                <el-form-item prop="constructionUnit">
                                    <el-select v-model="submissionForm.constructionUnit"
                                               :disabled="(step!=='submission' && step!=='reject')||readonly"
                                               filterable
                                               class="form-select"
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
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">送审单位</th>
                            <td colspan="3">
                                <el-form-item prop="auditUnit">
                                    <el-select v-model="submissionForm.auditUnit"
                                               :disabled="(step!=='submission' && step!=='reject')||readonly"
                                               filterable
                                               class="form-select"
                                               placeholder="请选择送审单位" style="width: 220px;">
                                        <el-option
                                            v-for="org in orgs"
                                            :key="org.code"
                                            :label="org.name"
                                            :value="org.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">开工时间</th>
                            <td>
                                <el-form-item prop="startDate">
                                    <el-date-picker v-model="submissionForm.startDate"
                                                    :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">竣工时间</th>
                            <td>
                                <el-form-item prop="endDate">
                                    <el-date-picker v-model="submissionForm.endDate"
                                                    :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="stepCode<=0">
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">结算方式</th>
                            <td colspan="3">
                                <el-form-item prop="payType">
                                    <el-radio v-model="submissionForm.payType" label="按实结算"
                                              border
                                              size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payTypeChange">
                                        按实结算
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="中标价+变更价" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payTypeChange">
                                        中标价+变更价
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="固定单价" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payTypeChange">
                                        固定单价
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payType" label="其他" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payTypeChange">
                                        其他
                                    </el-radio>
                                </el-form-item>
                                <el-form-item prop="payTypeOther">
                                    <el-input v-model="submissionForm.payTypeOther"
                                              v-if="submissionForm.payType==='其他'"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              style="margin-top: 5px"
                                              placeholder="其他结算方式"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="stepCode<=0">
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">付款情况</th>
                            <td colspan="3">
                                <el-form-item prop="payCondition">
                                    <el-radio v-model="submissionForm.payCondition" label="未付款" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payConditionChange">
                                        未付款
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="合同价50%" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payConditionChange">
                                        合同价50%
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="合同价70%" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payConditionChange">
                                        合同价70%
                                    </el-radio>
                                    <el-radio v-model="submissionForm.payCondition" label="其他" border size="small"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              @change="payConditionChange">
                                        其他
                                    </el-radio>
                                </el-form-item>
                                <el-form-item prop="payConditionOther">
                                    <el-input v-model="submissionForm.payConditionOther"
                                              v-if="submissionForm.payCondition==='其他'"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              style="margin-top: 5px"
                                              placeholder="其他付款情况"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="stepCode>0">
                            <th>结算方式</th>
                            <td>
                                <el-input v-model="submissionForm.payType"
                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                          style="width: 200px"></el-input>
                                <el-input v-model="submissionForm.payTypeOther"
                                          v-if="submissionForm.payType==='其他'"
                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                          style="width: 200px"></el-input>
                            </td>
                            <th>付款情况</th>
                            <td>
                                <el-input v-model="submissionForm.payCondition"
                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                          style="width: 200px"></el-input>
                                <el-input v-model="submissionForm.payConditionOther"
                                          v-if="submissionForm.payCondition==='其他'"
                                          :value="submissionForm.payCondition==='其他'?'':'无'"
                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                          style="width: 200px"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <th rowspan="2" :class="(step==='submission' || step==='reject')?'form-required':''">
                                中标合同金额
                            </th>
                            <td rowspan="2">
                                <el-form-item prop="contractMoney">
                                    <el-input v-model="submissionForm.contractMoney"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              placeholder="填写中标合同金额"></el-input>
                                </el-form-item>
                            </td>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">
                                经费来源
                            </th>
                            <td>
                                <el-form-item prop="feeFrom">
                                    <el-input v-model="submissionForm.feeFrom"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              :placeholder="this.visible ? '填写经费来源' : '' "></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">
                                经费代码
                            </th>
                            <td>
                                <el-form-item prop="itemCode">
                                    <el-input v-model="submissionForm.itemCode"
                                              :disabled="(step!=='submission' && step!=='reject')||readonly"
                                              :placeholder="this.visible ? '填写经费代码' : '' "></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="compact-td">
                                <table class="form-table inner-table">
                                    <tr>
                                        <th class="first-th">报审单位</th>
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
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="施工单位报审金额"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>

                                        </td>
                                        <td>
                                            <el-form-item prop="constructionUnitProjectMan">
                                                <el-select v-model="submissionForm.constructionUnitProjectMan"
                                                           @change="projectManChange"
                                                           allow-create
                                                           filterable
                                                           :disabled="(step!=='submission' && step!=='reject')||readonly"
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
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="施工单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>监理单位</th>
                                        <td>
                                            <el-form-item prop="inspectUnitApplyFee">
                                                <el-input v-model="submissionForm.inspectUnitApplyFee"
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
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
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="监理单位项目负责人"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="inspectUnitTel">
                                                <el-input v-model="submissionForm.inspectUnitTel"
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="监理单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>建设单位</th>
                                        <td>
                                            <el-form-item prop="buildUnitApplyFee">
                                                <el-input v-model="submissionForm.buildUnitApplyFee"
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
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
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="建设单位项目负责人"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item prop="buildUnitTel">
                                                <el-input v-model="submissionForm.buildUnitTel"
                                                          :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                          placeholder="建设单位联系电话"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr class="print-not-show">
                            <th :class="(step==='submission' || step==='reject')?'form-required':''">资料清单组</th>
                            <td colspan="3">
                                <el-form-item prop="materialGroup">
                                    <el-select v-model="submissionForm.materialGroup" placeholder="请选择"
                                               :disabled="(step!=='submission' && step!=='reject')||readonly"
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
                                        <th class="print-not-show">附件</th>
                                        <th class="upload-num">数量</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.details">
                                        <th :class="((step==='submission' || step==='reject') && fileType.mRequired)?'form-required':''">
                                            <el-tooltip class="item" effect="dark" :content="fileType.description"
                                                        v-if="fileType.description"
                                                        placement="top-start">
                                                <p style="display: inline">{{ fileType.mName }}</p>
                                            </el-tooltip>
                                            <p style="display: inline" v-else>{{ fileType.mName }}</p>
                                        </th>
                                        <td class="print-not-show">
                                            <el-upload class="upload-demo"
                                                       action="noAction" :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemove"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='submission' || step ==='reject'"
                                                           @click="toUpload(fileType.mId)">点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td style="text-align: center">
                                            {{ fileType.mFiles.length }}
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize
                                                      v-model="fileType.mNote"
                                                      :disabled="(step!=='submission' && step!=='reject')||readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=25 && (allocInfoView || assigned)" class="print-not-show">
                            <th>审计方式</th>
                            <td colspan="3">
                                <el-input type="text" v-model="submissionForm.auditType" disabled></el-input>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=25 && submissionForm.thirdparty && (allocInfoView || assigned)"
                            class="print-not-show">
                            <th>中介公司</th>
                            <td colspan="3">
                                <el-input type="text" v-model="submissionForm.thirdparty.name" disabled></el-input>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=25 && submissionForm.assigned && (allocInfoView || assigned)"
                            class="print-not-show">
                            <th>审计组长</th>
                            <td>
                                <el-input type="text" v-model="submissionForm.assigned.name" disabled></el-input>
                            </td>
                            <th>联系方式</th>
                            <td>
                                <el-input type="text" v-model="submissionForm.assigned.telphone" disabled></el-input>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=25 && submissionForm.assigned  && (allocInfoView || assigned)"
                            class="print-not-show">
                            <th :class="stepCode===25?'editing form-required':''">审计组员</th>
                            <td colspan="3">
                                <el-form-item prop="members">
                                    <el-select v-model="submissionForm.members"
                                               class="table-select" filterable
                                               multiple placeholder="请选择"
                                               :disabled="stepCode!==25 || readonly">
                                        <el-option v-for="member in members" :key="member.value"
                                                   :label="member.label"
                                                   :value="member.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=40 && prepareInfoView" class="print-not-show">
                            <th :class="stepCode===40 && !readonly?'editing form-required':''">约看现场时间
                            </th>
                            <td colspan="3">
                                <el-form-item prop="prepareViewDate">
                                    <el-date-picker v-model="submissionForm.prepareViewDate"
                                                    :disabled="step!=='surveyPrepare'|| readonly"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    :picker-options="pickerOptions"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=50 && surveyInfoView" class="print-not-show">
                            <th :class="stepCode===50 && !readonly?'editing form-required':''">现场查看时间</th>
                            <td colspan="3">
                                <el-form-item prop="viewDate">
                                    <el-date-picker v-model="submissionForm.viewDate"
                                                    :disabled="step!=='survey' || readonly"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=50 && surveyInfoView" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">相关单位</th>
                                        <th>现场查看人员</th>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''"
                                            v-if="submissionForm.assigned && submissionForm.assigned.type==='THIRDPARTY'">
                                            外审单位
                                        </th>
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''" v-else>内审单位
                                        </th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesAuditUnit">
                                                <el-select v-model="submissionForm.viewPeoplesAuditUnit"
                                                           class="table-select" filterable
                                                           allow-create
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='survey' || readonly">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''">建设单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesBuildUnitIds">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesBuildUnitIds"
                                                          :disabled="step!=='survey' || readonly"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''">施工单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesConstructUnit">
                                                <el-select v-model="submissionForm.viewPeoplesConstructUnit"
                                                           class="table-select" filterable
                                                           allow-create
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='survey'|| readonly">
                                                    <el-option
                                                        v-for="pman in projectMans"
                                                        :key="pman.value"
                                                        :label="pman.label"
                                                        :value="pman.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr v-if="submissionForm.assigned && submissionForm.assigned.type==='THIRDPARTY'">
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''">内审单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesEntrustUnitIds">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesEntrustUnitIds"
                                                          :disabled="step!=='survey' || readonly"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=50 && surveyInfoView" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">现场勘察资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.surveyFiles">
                                        <th :class="stepCode===50 && !readonly?'editing form-required':''">
                                            {{ fileType.mName }}
                                        </th>
                                        <td>
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveSurvey"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='survey' && !readonly"
                                                           @click="toUpload(fileType.mId)">点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="step!=='survey' || readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode===50" class="print-not-show">
                            <th :class="stepCode===50 && !readonly?'editing form-required':''">下一阶段</th>
                            <td colspan="3">
                                <el-form-item prop="nextStep">
                                    <el-select v-model="submissionForm.nextStep" placeholder="请选择下一阶段" prop="nextStep"
                                               :disabled="readonly">
                                        <el-option key="60" label="争议处理" value="60">争议处理</el-option>
                                        <el-option key="70" label="审计初审" value="70">审计初审</el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="(stepCode>=60 && (argueInfoView || self)) || stepCode === -30" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">争议处理资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.argueFiles">
                                        <th>
                                            {{ fileType.mName }}
                                        </th>
                                        <td :class="stepCode===60?'editing':''">
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveArgue"
                                                       multiple
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='argueHandle'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="step!=='argueHandle' || readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="step ==='argueDeal' || (stepCode>=60 && (argueInfoView || self))"
                            class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">补充资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.supplementFiles">
                                        <th :class="step==='argueDeal'?'form-required editing':''">
                                            {{ fileType.mName }}
                                        </th>
                                        <td>
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveSupplement"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='argueDeal'" @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="step!=='argueDeal' || readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70 && (auditFirstInfoView||assigned)" class="print-not-show">
                            <th :class="stepCode===70 &&!readonly?'editing form-required':''">约看现场时间(初审)</th>
                            <td>
                                <el-form-item prop="prepareViewDate2">
                                    <el-date-picker v-model="submissionForm.prepareViewDate2"
                                                    :disabled="step!=='auditFirst' || readonly"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                            <th :class="stepCode===70 &&!readonly?'editing form-required':''">现场查看时间(初审)</th>
                            <td>
                                <el-form-item prop="viewDate2">
                                    <el-date-picker v-model="submissionForm.viewDate2"
                                                    :disabled="step!=='auditFirst' || readonly"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="stepCode>=70 && (auditFirstInfoView|| assigned)" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">相关单位</th>
                                        <th>现场查看人员(初审)</th>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''"
                                            v-if="submissionForm.assigned && submissionForm.assigned.type==='THIRDPARTY'">
                                            外审单位
                                        </th>
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''" v-else>内审单位
                                        </th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesAuditUnit2">
                                                <el-select v-model="submissionForm.viewPeoplesAuditUnit2"
                                                           class="table-select" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='auditFirst' || readonly">
                                                    <el-option v-for="item in users" :key="item.value"
                                                               :label="item.label"
                                                               :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''">建设单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesBuildUnitIds2">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesBuildUnitIds2"
                                                          :disabled="step!=='auditFirst' || readonly"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''">施工单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesConstructUnit2">
                                                <el-select v-model="submissionForm.viewPeoplesConstructUnit2"
                                                           class="table-select" filterable
                                                           multiple placeholder="请选择"
                                                           :disabled="step!=='auditFirst' || readonly">
                                                    <el-option
                                                        v-for="pman in projectMans"
                                                        :key="pman.value"
                                                        :label="pman.label"
                                                        :value="pman.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                    <tr v-if="submissionForm.assigned && submissionForm.assigned.type==='THIRDPARTY'">
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''">内审单位</th>
                                        <td colspan="3">
                                            <el-form-item prop="viewPeoplesEntrustUnitIds2">
                                                <el-input type="text"
                                                          v-model="submissionForm.viewPeoplesEntrustUnitIds2"
                                                          :disabled="step!=='auditFirst' || readonly"></el-input>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70 && (auditFirstInfoView|| assigned)" class="print-not-show">
                            <th :class="stepCode===70 && !readonly?'editing form-required':''">送审价</th>
                            <td>
                                <el-form-item prop="submissionPrice">
                                    <el-input v-model="submissionForm.submissionPrice"
                                              :disabled="step!=='auditFirst' || readonly"
                                              placeholder="填写送审价"></el-input>
                                </el-form-item>
                            </td>
                            <th :class="stepCode===70 && !readonly?'editing form-required':''">初审审定金额</th>
                            <td :class="stepCode===70?'editing':''">
                                <el-form-item prop="firstAuditPrice">
                                    <el-input v-model="submissionForm.firstAuditPrice"
                                              :disabled="step!=='auditFirst' || readonly"
                                              placeholder="初审审定金额"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70 && (auditFirstInfoView|| assigned)" class="print-not-show">
                            <th :class="stepCode===70 && !readonly?'editing form-required':''">初审核减额</th>
                            <td>
                                <el-form-item prop="auditFirstSub">
                                    <el-input v-model="submissionForm.auditFirstSub" disabled></el-input>
                                </el-form-item>
                            </td>
                            <th :class="stepCode===70 && !readonly?'editing form-required':''">初审核减率</th>
                            <td>
                                <el-form-item prop="auditFirstSubRatio">
                                    <el-input v-model="submissionForm.auditFirstSubRatio+'%'"
                                              disabled
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70 && (auditFirstInfoView|| assigned)" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">初审资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.auditFirstFiles">
                                        <th :class="stepCode===70 && !readonly?'editing form-required':''">
                                            {{ fileType.mName }}
                                        </th>
                                        <td>
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveAuditFirst"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditFirst' && !readonly"
                                                           @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="step!=='auditFirst' || readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=70 && (auditFirstInfoView|| assigned)" class="print-not-show">
                            <th :class="stepCode===70 && !readonly?'editing':''">审计发现问题及建议</th>
                            <td colspan="3">
                                <el-form-item prop="qas">
                                    <el-input type="textarea" v-model="submissionForm.qas"
                                              :disabled="stepCode!==70 || readonly"
                                              placeholder="审计发现问题及建议"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80 && auditSecondInfoView" class="print-not-show">
                            <th :class="stepCode===80 && !readonly?'editing form-required':''">复审审定金额</th>
                            <td>
                                <el-form-item prop="secondAuditPrice">
                                    <el-input v-model="submissionForm.secondAuditPrice"
                                              :disabled="step!=='auditSecond' || readonly"
                                              placeholder="填写复审审定金额"></el-input>
                                </el-form-item>
                            </td>
                            <th :class="stepCode===80 && !readonly?'editing form-required':''">复审核减额</th>
                            <td>
                                <el-form-item prop="auditSecondSub">
                                    <el-input v-model="submissionForm.auditSecondSub"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80 && auditSecondInfoView" class="print-not-show">
                            <th :class="stepCode===80 && !readonly?'editing form-required':''">复审核减率</th>
                            <td colspan="3">
                                <el-form-item prop="auditSecondSubRatio">
                                    <el-input v-model="submissionForm.auditSecondSubRatio+'%'"
                                              disabled></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80 && auditSecondInfoView" class="print-not-show">
                            <td colspan="4" class="compact-td">
                                <table class="form-table">
                                    <tr>
                                        <th class="first-th">复审资料</th>
                                        <th>附件</th>
                                        <th class="upload-note">备注</th>
                                    </tr>
                                    <tr v-for="fileType of this.submissionForm.auditSecondFiles">
                                        <th :class="stepCode===80 && !readonly?'editing form-required':''">
                                            {{ fileType.mName }}
                                        </th>
                                        <td>
                                            <el-upload class="upload-demo"
                                                       action="noAction"
                                                       :http-request="upload"
                                                       :with-credentials="true"
                                                       :on-preview="handlePreview"
                                                       :on-remove="handleRemove"
                                                       :before-remove="beforeRemoveAuditSecond"
                                                       :file-list="fileType.mFiles">
                                                <el-button size="small" type="primary" class="upload-btn"
                                                           v-if="step ==='auditSecond' && !readonly"
                                                           @click="toUpload(fileType.mId)">
                                                    点击上传
                                                </el-button>
                                            </el-upload>
                                        </td>
                                        <td>
                                            <el-input type="textarea"
                                                      autosize v-model="fileType.mNote"
                                                      :disabled="step!=='auditSecond' || readonly"
                                                      placeholder="填写备注"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80 && auditSecondInfoView" class="print-not-show">
                            <th :class="stepCode===80 && !readonly?'editing form-required':''">复审说明</th>
                            <td colspan="3">
                                <el-form-item prop="auditSecondNote">
                                    <el-input type="textarea" v-model="submissionForm.auditSecondNote"
                                              :disabled="step!=='auditSecond' || readonly"
                                              placeholder="复审说明"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=80 && auditSecondInfoView" class="print-not-show">
                            <th :class="stepCode===80 && !readonly?'editing form-required':''">审计备注
                            </th>
                            <td colspan="3">
                                <el-form-item prop="auditNote">
                                    <el-input type="textarea" v-model="submissionForm.auditNote"
                                              :disabled="step!=='auditSecond' || readonly"
                                              placeholder="审计备注"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <tr v-if="stepCode>=90 && completeInfoView" class="print-not-show">
                            <th :class="stepCode===90 && !readonly?'editing':''">项目总结</th>
                            <td colspan="3">
                                <el-form-item prop="projectSum">
                                    <el-input type="textarea" v-model="submissionForm.projectSum"
                                              :disabled="stepCode!==90 || readonly"
                                              placeholder="项目总结"></el-input>
                                </el-form-item>
                            </td>
                        </tr>

                        <!--这里的意见非表单数据 是写入意见表的-->
                        <tr v-if="stepCode===10||stepCode===30||stepCode===65" class="print-not-show">
                            <th :class="(stepCode===10||stepCode===30||stepCode===65) && !readonly?'editing':''">审批意见
                            </th>
                            <td colspan="3">
                                <el-input type="textarea" v-model="comment"
                                          :disabled="(stepCode!==10 && stepCode!==30 && stepCode!==65) || readonly"></el-input>
                            </td>
                        </tr>

                        <tr class="print-not-show">
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
                            <th>送审部门(盖章)</th>
                            <td style="height: 100px;">

                            </td>
                            <th></th>
                            <td style="height: 100px;">

                            </td>
                        </tr>
                        <tr class="print-info">
                            <th>初审人</th>
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
            <el-button v-for="oper in formOpers" :type="oper.color" @click="commit(oper.event,oper.type)"
                       :key="oper.name">
                {{ oper.name }}
            </el-button>
            <el-button v-if="step !== 'submission' && step !== 'reject'" @click="print()"
                       :loading="printLoading">打印
            </el-button>
        </div>
    </el-dialog>
</template>

<script>

import MaterialFile from "../../script/server/materialFile";
import Comment from "../../script/server/comment";
import ClientCallProject from "../../script/client/project/clientCall"
import ClientCallCommon from "../../script/client/clientCall"
import ConstructionUnit from "../../script/server/constructionUnit";
import Org from '../../script/server/org'

export default {
    name: "SubmissionForm",
    props: ['readonly', 'visible', 'from', 'formOpers', 'step', 'formId', 'workitemId', 'formRules', 'formRules2', 'stepCode', 'formName'], //formRules2只在某些条件下验证
    watch: {
        'submissionForm.constructionUnitApplyFee': function (newVal) {
            this.calInspectUnitCheckFee(newVal, this.submissionForm.inspectUnitApplyFee)
            this.calBuildUnitCheckFee(newVal, this.submissionForm.inspectUnitApplyFee, this.submissionForm.buildUnitApplyFee)
        },
        'submissionForm.inspectUnitApplyFee': function (newVal) {
            this.calInspectUnitCheckFee(this.submissionForm.constructionUnitApplyFee, newVal)
            this.calBuildUnitCheckFee(this.submissionForm.constructionUnitApplyFee, newVal, this.submissionForm.buildUnitApplyFee)
        },
        'submissionForm.buildUnitApplyFee': function (newVal) {
            this.calBuildUnitCheckFee(this.submissionForm.constructionUnitApplyFee, this.submissionForm.inspectUnitApplyFee, newVal)
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

                this.submissionForm.id = ''
                this.printLoading = true
                this.uploadFiles = []

                //所有基础数据请求
                let promises = []

                promises.push(MaterialFile.getMaterialGroups().then(res => {
                    this.materialGroups = res.list
                }))
                promises.push(ConstructionUnit.getConstructionUnits({
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
                }))
                promises.push(Org.getOrgs().then(res => {
                    this.orgs = res.list
                }))

                Promise.all(promises).then(() => {
                    //初始化表单
                    this.resetForm()

                    this.$nextTick(() => {
                        if (this.from === 'addform') {
                            this.$refs['submissionForm'].resetFields();
                            $(".comment").hide()
                        } else if (this.from === 'editform') {
                            //加载form
                            ClientCallProject.getSubmission({
                                id: this.formId
                            }).then(result => {


                                if (this.stepCode >= 50) {
                                    if (result.submission.auditType === '内审') {
                                        ClientCallCommon.getEmps().then(result => {
                                            this.users = []
                                            result.list.content.forEach(user => {
                                                this.users.push({
                                                    value: user.id,
                                                    label: user.name
                                                })
                                            })
                                        })
                                    } else {
                                        if (result.submission.thirdparty) {
                                            ClientCallCommon.getIntermediaryUsers({thirdpartyId: result.submission.thirdparty.id}).then(result => {
                                                this.users = []
                                                result.list.forEach(user => {
                                                    this.users.push({
                                                        value: user.id,
                                                        label: user.name
                                                    })
                                                })
                                            })
                                        }
                                    }
                                }

                                this.comment = '';

                                //初始化按钮名字
                                //console.log(this.formOpers)

                                this.self = this.$root.loginUser.id === result.submission.creatorId
                                this.assigned = result.submission.assigned && this.$root.loginUser.id === result.submission.assigned.id

                                let needRolesMap = new Map()

                                needRolesMap.set('allocInfoView', ['admin', 'submission_distribution_approver', 'submission_check_approver', 'submission_view_alloc', 'submission_view'])
                                needRolesMap.set('prepareInfoView', ['admin', 'submission_survey_prepare_approver', 'submission_view_prepare', 'submission_view'])
                                needRolesMap.set('surveyInfoView', ['admin', 'submission_survey_scene_approver', 'submission_view_survey', 'submission_view'])
                                needRolesMap.set('argueInfoView', ['admin', 'submission_argue_approver', 'submission_view_argue', 'submission_view'])
                                needRolesMap.set('auditFirstInfoView', ['admin', 'submission_audit_first_approver', 'submission_view_first', 'submission_view'])
                                needRolesMap.set('auditSecondInfoView', ['admin', 'submission_audit_second_approver', 'submission_view_second', 'submission_view'])
                                needRolesMap.set('completeInfoView', ['admin', 'submission_filed_approver'])

                                //页面内容查看权限控制
                                ClientCallCommon.checkRights(needRolesMap).then(checkRes => {
                                    for (let [key, value] of checkRes.entries()) {
                                        this[key] = value
                                    }
                                })

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
                                            mName: '审定单(初)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-5',
                                            mName: '初审报告(初)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-6',
                                            mName: '审计工作底稿(初)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-7',
                                            mName: '计价文本(初)',
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
                                            mName: '审定单(复)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-9',
                                            mName: '初审报告(复)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-10',
                                            mName: '审计工作底稿(复)',
                                            mFiles: [],
                                            mFileIds: '',
                                            mNote: ''
                                        },
                                        {
                                            mId: '-11',
                                            mName: '计价文本(复)',
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

                                if (this.stepCode >= 25) {
                                    this.members = []
                                    if (result.submission.thirdparty) {
                                        ClientCallCommon.getIntermediaryUsers({thirdpartyId: result.submission.thirdparty.id}).then(res => {
                                            res.list.forEach(user => {
                                                let label = user.name + '(' + user.username + ")"
                                                this.members.push({
                                                    value: user.id,
                                                    label: label
                                                })
                                            })
                                        })
                                    } else {
                                        ClientCallCommon.getEmps().then(result => {
                                            result.list.content.forEach(user => {
                                                let label = user.name + '(' + user.username + ")"
                                                this.members.push({
                                                    value: user.id,
                                                    label: label
                                                })
                                            })
                                        })
                                    }

                                    if (this.submissionForm.memberIds) {
                                        this.submissionForm.members = []
                                        this.submissionForm.memberIds.split(',').forEach(id => {
                                            this.submissionForm.members.push(id - 0)
                                        })
                                    }
                                }

                                //根据所选清单组，加载清单组文件类型
                                if (this.submissionForm.materialGroup) {
                                    MaterialFile.getMaterialGroup({
                                        id: this.submissionForm.materialGroup
                                    }).then(res => {
                                        for (let fType of res.materialGroup.details) {
                                            let detail = this.submissionForm.details.filter(f => f.mId === fType.material.id)[0]
                                            if (detail) {
                                                //已有数据，但是需要补上是否必传信息，修改时显示
                                                detail.mRequired = fType.required
                                            } else {
                                                //新增时
                                                this.submissionForm.details.push({
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
                                    target: 'submission',
                                    targetId: this.submissionForm.id
                                }).then(res => {
                                    this.comments = res.list
                                })

                                //加载施工单位项目负责人列表
                                this.setProjectMans(this.submissionForm.constructionUnit)

                                if (this.stepCode > 50) {
                                    //加载现场查看人员字段(选择的字段)

                                    if (this.submissionForm.viewPeoplesAuditUnitIds) {
                                        this.submissionForm.viewPeoplesAuditUnit = []
                                        this.submissionForm.viewPeoplesAuditUnitIds.split(',').forEach(id => {
                                            this.submissionForm.viewPeoplesAuditUnit.push(id - 0)
                                        })

                                        this.submissionForm.viewPeoplesConstructUnit = []
                                        this.submissionForm.viewPeoplesConstructUnitIds.split(',').forEach(id => {
                                            this.submissionForm.viewPeoplesConstructUnit.push(id)
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

                                        this.submissionForm.viewPeoplesBuildUnitIds2 = this.submissionForm.viewPeoplesBuildUnitIds

                                        this.submissionForm.viewPeoplesConstructUnit2 = []
                                        this.submissionForm.viewPeoplesConstructUnitIds.split(',').forEach(id => {
                                            this.submissionForm.viewPeoplesConstructUnit2.push(id)
                                        })

                                        this.submissionForm.viewPeoplesEntrustUnitIds2 = viewPeoplesEntrustUnitIds

                                    } else {
                                        this.submissionForm.viewPeoplesAuditUnit2 = []
                                        if (this.submissionForm.viewPeoplesAuditUnitIds2) {
                                            this.submissionForm.viewPeoplesAuditUnitIds2.split(',').forEach(id => {
                                                this.submissionForm.viewPeoplesAuditUnit2.push(id - 0)
                                            })
                                        }
                                        this.submissionForm.viewPeoplesConstructUnit2 = []
                                        if (this.submissionForm.viewPeoplesConstructUnitIds2) {
                                            this.submissionForm.viewPeoplesConstructUnitIds2.split(',').forEach(id => {
                                                this.submissionForm.viewPeoplesConstructUnit2.push(id - 0)
                                            })
                                        }
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

                                //初始化附件
                                if (this.step === 'survey') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.surveyFiles)
                                } else if (this.step === 'argueDeal') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.supplementFiles)
                                } else if (this.step === 'argueHandle') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.argueFiles)
                                } else if (this.step === 'auditFirst') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.auditFirstFiles)
                                } else if (this.step === 'auditSecond') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.auditSecondFiles)
                                } else if (this.step === 'submission' || this.step === 'reject') {
                                    ClientCallCommon.setFiles(this.uploadFiles, this.submissionForm.details)
                                }
                            })
                        }
                        $(".print-info").hide()
                        $(".print-not-show").show()
                    });
                })

                //延时两秒可打印,防止页面元素没有加载完成,样式错误
                setTimeout(() => {
                    this.printLoading = false
                }, 2000)

            } else {
                $(".upload-btn").show()
            }
        }
    },
    mounted: function () {

    },
    data: function () {
        return {
            self: false,
            assigned: false,
            dialogVisible: false,
            submissionForm: {
                formType: '工程结算送审表',
                id: '',
                /*--------------------------submission start -----------------------------------*/
                itemCode: '',
                auditNo: '',
                contractNo: '',
                projectName: '',
                projectPlace: '',
                feeFrom: '',
                budget: '',
                constructionUnit: '',
                auditUnit: '',
                startDate: '',
                endDate: '',
                contractMoney: '',
                constructMoney: '',
                installMoney: '',
                payType: '',
                payTypeOther: '',
                payCondition: '',
                payConditionOther: '',
                constructionUnitApplyFee: '',
                constructionUnitCheckFee: '',
                constructionUnitProjectMan: '',
                constructionUnitTel: '',
                inspectUnitApplyFee: '',
                inspectUnitCheckFee: '',
                inspectUnitProjectMan: '',
                inspectUnitTel: '',
                buildUnitApplyFee: '',
                buildUnitCheckFee: '',
                buildUnitProjectMan: '',
                buildUnitTel: '',
                content: '',
                description: '',
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
                //分配组员
                members: [],
                //勘察准备-----------
                prepareViewDate: '',
                viewDate: '',
                //现场勘察--------------
                surveyFiles: [],
                viewPeoplesAuditUnit: [],
                viewPeoplesBuildUnitIds: '',
                viewPeoplesConstructUnit: [],
                viewPeoplesEntrustUnitIds: '',
                //争议处理
                argueFiles: [],
                //审计初审--------------
                submissionPrice: '',
                firstAuditPrice: '',
                auditFirstFiles: [],
                prepareViewDate2: '',
                viewDate2: '',
                viewPeoplesAuditUnit2: [],
                viewPeoplesBuildUnitIds2: '',
                viewPeoplesConstructUnit2: [],
                viewPeoplesEntrustUnitIds2: '',
                auditFirstSub: '',
                auditFirstSubRatio: '',
                qas: '',
                //审计复审
                secondAuditPrice: '',
                auditNote: '',
                auditSecondNote: '',
                auditSecondSub: '',
                auditSecondSubRatio: '',
                auditSecondFiles: [],
                //争议处理，申请人补充上传资料
                supplementFiles: [],
                nextStep: '',
                projectSum: '',
                /*--------------------------submission end -----------------------------------*/
            },
            materialGroups: [],
            uploadParams: {
                id: '',
            },
            comment: '',
            comments: [],
            users: [],
            orgs: [],
            units: [],
            members: [],
            projectMans: [],
            uploadFiles: [], //由于上传完成后修改upload的file-list存在列表刷新问题，所以用这个数组来存放已上传附件,不修改file-list
            printLoading: true,
            //页面可见内容控制
            allocInfoView: false,
            prepareInfoView: false,
            surveyInfoView: false,
            argueInfoView: false,
            auditFirstInfoView: false,
            auditSecondInfoView: false,
            completeInfoView: false,
            pickerOptions: {
                disabledDate: time => {
                    return time.getTime() <= Date.now() - 8.64e7
                }
            },
        }
    },
    methods: {
        resetForm() {
            this.$refs['submissionForm'].resetFields();
            ClientCallCommon.clearForm(this.submissionForm)
        },
        calInspectUnitCheckFee(constructionUnitApplyFee, inspectApplyFee) {
            if (inspectApplyFee && inspectApplyFee > 0) {
                this.submissionForm.inspectUnitCheckFee = (constructionUnitApplyFee - inspectApplyFee).toFixed(2)
            } else {
                this.submissionForm.inspectUnitCheckFee = ''
            }
        },
        calBuildUnitCheckFee(constructionUnitApplyFee, inspectApplyFee, buildUnitApplyFee) {
            if (inspectApplyFee && inspectApplyFee > 0) {
                this.submissionForm.buildUnitCheckFee = (inspectApplyFee - buildUnitApplyFee).toFixed(2)
            } else {
                this.submissionForm.buildUnitCheckFee = (constructionUnitApplyFee - buildUnitApplyFee).toFixed(2)
            }
        },
        calAuditFirst: function () {
            this.submissionForm.auditFirstSub = this.submissionForm.submissionPrice - this.submissionForm.firstAuditPrice
            if (this.submissionForm.submissionPrice && this.submissionForm.submissionPrice > 0) {
                this.submissionForm.auditFirstSubRatio = ((this.submissionForm.auditFirstSub / this.submissionForm.submissionPrice).toFixed(4) * 100).toFixed(2)
            }
        },
        calAuditSecond: function () {
            this.submissionForm.auditSecondSub = this.submissionForm.firstAuditPrice - this.submissionForm.secondAuditPrice
            if (this.submissionForm.firstAuditPrice && this.submissionForm.firstAuditPrice > 0) {
                this.submissionForm.auditSecondSubRatio = ((this.submissionForm.auditSecondSub / this.submissionForm.firstAuditPrice).toFixed(2) * 100).toFixed(2)
            }
        },
        unitChange: function (val) {
            this.submissionForm.constructionUnitProjectMan = ''
            this.submissionForm.constructionUnitTel = ''
            this.setProjectMans(val)
        },
        setProjectMans: function (val) {
            let unit = this.units.filter(u => u.value === val)[0]
            if (unit) {
                this.projectMans = []
                unit.links.forEach(link => {
                    this.projectMans.push({
                        label: link.contact,
                        value: link.id + "",
                        telphone: link.telphone,
                    })
                });
            }
        },
        projectManChange: function (val) {
            this.submissionForm.constructionUnitTel = this.projectMans.filter(man => man.value === val)[0].telphone
        },
        commit: function (event, type) {
            let _this = this
            if (((this.step === 'submission' && event.name.indexOf('save') === -1) ||
                this.step === 'project' ||
                this.step === 'reject' ||
                this.step === 'surveyPrepare' ||
                this.step === 'survey' ||
                this.step === 'auditFirst' ||
                this.step === 'auditSecond' ||
                this.stepCode === 25) && type !== 'reject') {
                //需要验证表单的提交
                this.$refs['submissionForm'].validate((valid) => {
                    if (valid) {
                        if (this.step === 'submission' || this.stepCode === -20) {  //初次提交或者被退回
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.details)
                            if (ClientCallCommon.checkFileOrNote(this.submissionForm.details)) {
                                if (this.stepCode === -20) {
                                    //如果是被打回的单据,带上workitemid参数
                                    this.submissionForm.workitemId = this.workitemId
                                }
                                event(this.submissionForm)
                            }
                        } else if (this.step === 'project') { //审计立项同意
                            let commitData = {
                                targetId: this.submissionForm.id,
                                workitemId: this.workitemId,
                                content: this.comment,
                            }
                            if (this.submissionForm.auditNo) {
                                event(commitData)
                            } else {
                                this.$confirm('是否确认立项通过,通过后系统将自动编号?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    event(commitData)
                                })
                            }
                        } else if (this.stepCode === 25) { //分配组员同意
                            event({
                                targetId: this.submissionForm.id,
                                workitemId: this.workitemId,
                                memberIds: this.submissionForm.members.toString(),
                            })
                        } else if (this.step === 'surveyPrepare') { //调查准备
                            event({
                                targetId: this.submissionForm.id,
                                workitemId: this.workitemId,
                                prepareViewDate: this.submissionForm.prepareViewDate,
                                type: 1
                            })
                        } else if (this.step === 'survey') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.surveyFiles)
                            if (ClientCallCommon.fileListCheck(this.submissionForm.surveyFiles)) {
                                event({
                                    viewDate: this.submissionForm.viewDate,
                                    targetId: this.submissionForm.id,
                                    status: this.submissionForm.nextStep,
                                    workitemId: this.workitemId,
                                    surveyFiles: this.submissionForm.surveyFiles,
                                    viewPeoplesAuditUnitIds: this.submissionForm.viewPeoplesAuditUnit.toString(),
                                    viewPeoplesBuildUnitIds: this.submissionForm.viewPeoplesBuildUnitIds,
                                    viewPeoplesConstructUnitIds: this.submissionForm.viewPeoplesConstructUnit.toString(),
                                    viewPeoplesEntrustUnitIds: this.submissionForm.viewPeoplesEntrustUnitIds,
                                    type: 1
                                })
                            }
                        } else if (this.step === 'auditFirst') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.auditFirstFiles)
                            if (ClientCallCommon.fileListCheck(this.submissionForm.auditFirstFiles)) {
                                event({
                                    targetId: this.submissionForm.id,
                                    workitemId: this.workitemId,
                                    type: 1,
                                    submissionPrice: this.submissionForm.submissionPrice,
                                    firstAuditPrice: this.submissionForm.firstAuditPrice,
                                    auditFirstSub: this.submissionForm.auditFirstSub,
                                    auditFirstSubRatio: this.submissionForm.auditFirstSubRatio,
                                    auditFirstFiles: this.submissionForm.auditFirstFiles,
                                    prepareViewDate2: this.submissionForm.prepareViewDate2,
                                    viewDate2: this.submissionForm.viewDate2,
                                    viewPeoplesAuditUnitIds2: this.submissionForm.viewPeoplesAuditUnit2.toString(),
                                    viewPeoplesBuildUnitIds2: this.submissionForm.viewPeoplesBuildUnitIds2,
                                    viewPeoplesConstructUnitIds2: this.submissionForm.viewPeoplesConstructUnit2.toString(),
                                    viewPeoplesEntrustUnitIds2: this.submissionForm.viewPeoplesEntrustUnitIds2,
                                    qas: this.submissionForm.qas
                                })
                            }
                        } else if (this.step === 'auditSecond') {
                            ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.auditSecondFiles)
                            if (ClientCallCommon.fileListCheck(this.submissionForm.auditSecondFiles)) {
                                event({
                                    targetId: this.submissionForm.id,
                                    workitemId: this.workitemId,
                                    type: 1,
                                    secondAuditPrice: this.submissionForm.secondAuditPrice,
                                    auditSecondSub: this.submissionForm.auditSecondSub,
                                    auditSecondSubRatio: this.submissionForm.auditSecondSubRatio,
                                    auditNote: this.submissionForm.auditNote,
                                    auditSecondNote: this.submissionForm.auditSecondNote,
                                    auditSecondFiles: this.submissionForm.auditSecondFiles,
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
                if (this.step === 'submission') {
                    //保存不验证必填
                    ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.details)
                    console.log(this.submissionForm)
                    event(this.submissionForm)
                } else if (this.stepCode === 10) { //审计立项不同意
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                        content: this.comment,
                        auditNo: this.submissionForm.auditNo
                    })
                } else if (this.stepCode === 25) { //分配组员不同意
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                    })
                } else if (this.step === 'argueHandle') {
                    ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.argueFiles)
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                        argueFiles: this.submissionForm.argueFiles,
                        type: 1
                    })
                } else if (this.stepCode === 65) { //争议处理审计处审核
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                        content: this.comment,
                    })
                } else if (this.step === 'argueDeal') {
                    ClientCallCommon.fileIdsConstruct(this.uploadFiles, this.submissionForm.supplementFiles)
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                        supplementFiles: this.submissionForm.supplementFiles,
                        type: 1
                    })
                } else if (this.stepCode === 90) {
                    event({
                        targetId: this.submissionForm.id,
                        workitemId: this.workitemId,
                        projectSum: this.submissionForm.projectSum,
                        comment: this.comment
                    })
                } else {
                    event(
                        this.comment, this.submissionForm.id, this.workitemId
                    )
                }
            }
        },
        print: function () {
            this.visible = false
            $(".upload-btn").hide()
            $(".print-info").show()
            $(".print-not-show").hide()
            //id唯一化,防止打印错误的单据
            let formName = this.formName ? this.formName + 'sub' : 'submission'
            this.$nextTick(() => {
                this.$print(this.$refs[formName])
            })
        },
        //资料清单移除方法
        handleRemove(file) {
            this.removeFileFromList(file)
        },
        beforeRemove(file) {
            return this.removeableConfirm(file, ['submission', 'reject'], '当前阶段不可移除资料清单附件!')
        },
        beforeRemoveAuditFirst(file) {
            return this.removeableConfirm(file, ['auditFirst'], '当前阶段不可移除初审资料附件!')
        },
        beforeRemoveSurvey(file) {
            return this.removeableConfirm(file, ['survey'], '当前阶段不可移除现场勘察资料附件!')
        },
        beforeRemoveArgue(file) {
            return this.removeableConfirm(file, ['argueHandle'], '当前阶段不可移除争议处理资料附件!')
        },
        beforeRemoveAuditSecond(file) {
            return this.removeableConfirm(file, ['auditSecond'], '当前阶段不可移除复审资料附件!')
        },
        beforeRemoveSupplement(file) {
            return this.removeableConfirm(file, ['argueDeal'], '当前阶段不可移除补充资料附件!')
        },
        removeableConfirm(file, steps, message) {
            return ClientCallCommon.removeableConfirm(file, steps, message, this.step)
        },
        removeFileFromList(file) {
            let showList = []
            if (this.step === 'submission' || this.step === 'reject') {
                showList = this.submissionForm.details
            }
            ClientCallCommon.removeFile(file, this.uploadFiles, showList)
        },
        handlePreview(file) {
            ClientCallCommon.filePreview(file, this)
        },
        materialGroupChange: function (value) {
            //根据选择的清单组，初始化附加列表
            ClientCallCommon.materialGroupChange(value, this.submissionForm.details)
        },
        toUpload(typeId) {
            //上传之前暂存当前要上传文件所属的清单组Id
            this.uploadParams.id = typeId
        },
        upload(content) {

            let failRefeshList = []
            let listType = ''

            if (this.step === 'survey') {
                failRefeshList = this.submissionForm.surveyFiles
            } else if (this.step === 'argueDeal') {
                failRefeshList = this.submissionForm.supplementFiles
            } else if (this.step === 'argueHandle') {
                failRefeshList = this.submissionForm.argueFiles
            } else if (this.step === 'auditFirst') {
                failRefeshList = this.submissionForm.auditFirstFiles
            } else if (this.step === 'auditSecond') {
                failRefeshList = this.submissionForm.auditSecondFiles
            } else {
                //送审阶段上传的资料清单
                failRefeshList = this.submissionForm.details
                listType = 'submission'
            }
            ClientCallCommon.upload(content, this.uploadParams.id, this.uploadFiles, failRefeshList, listType)
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
    components: {}
}
</script>

<style scoped>

</style>
