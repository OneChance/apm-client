<template>
    <el-form :inline="true" :model='query' ref='query' class="demo-form-inline query-form">
        <el-form-item prop="statuses" v-if="stepCode===0 || stepCode ===-10">
            <el-select v-model="query.statuses" filterable placeholder="审计状态" style="width: 160px;" size="small">
                <el-option
                    v-for="status in statusList"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="itemCode">
            <el-input v-model="query.itemCode" placeholder="立项代码" style="width: 150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="auditNo">
            <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="contractNo">
            <el-input v-model="query.contractNo" placeholder="合同编码" style="width: 150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="projectName">
            <el-input v-model="query.projectName" placeholder="工程项目" style="width: 300px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="constructionUnit">
            <el-select v-model="query.constructionUnit" filterable placeholder="施工单位" style="width: 220px;"
                       size="small">
                <el-option
                    v-for="unit in units"
                    :key="unit.value"
                    :label="unit.label"
                    :value="unit.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="contractMoney">
            <el-input v-model="query.contractMoney" placeholder="中标/合同金额" style="width: 120px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="assignedId"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced].indexOf(stepCode)===-1 ">
            <el-select v-model="query.assignedId" filterable placeholder="中介机构" style="width: 200px;" size="small">
                <el-option
                    v-for="inter in inters"
                    :key="inter.value"
                    :label="inter.label"
                    :value="inter.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="auditType"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced].indexOf(stepCode)===-1 ">
            <el-select v-model="query.auditType" filterable placeholder="审计方式" style="width: 110px;" size="small">
                <el-option
                    v-for="aType in auditTypes"
                    :key="aType.value"
                    :label="aType.label"
                    :value="aType.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="submissionPrice"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced,
                      stepCodes.surveyPrepare,stepCodes.survey,stepCodes.argueHandle,stepCodes.auditFirst].indexOf(stepCode)===-1 ">
            <el-input v-model="query.submissionPrice" placeholder="送审金额" style="width: 120px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="secondAuditPrice"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced,
                      stepCodes.surveyPrepare,stepCodes.survey,stepCodes.argueHandle,stepCodes.auditFirst].indexOf(stepCode)===-1 ">
            <el-input v-model="query.secondAuditPrice" placeholder="审定金额" style="width: 120px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="auditFee"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced,
                      stepCodes.surveyPrepare,stepCodes.survey,stepCodes.argueHandle,stepCodes.auditFirst].indexOf(stepCode)===-1 ">
            <el-input v-model="query.auditFee" placeholder="审计费用" style="width: 120px;" size="small"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="queryList" size="small">查询</el-button>
            <el-button @click="$refs['query'].resetFields()" size="small">重置</el-button>
            <el-button type="success" @click="exportData" v-if="needExport" size="small">导出</el-button>
            <el-button v-for="btn in buttons" :type="btn.color" @click="btnClick(btn.event)" :key="btn.name"
                       size="small">
                {{ btn.name }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>

import Common from "../../script/common";
import Config from "../../script/config";
import ClientCallProject from "../../script/client/project/clientCall";
import ClientCallCommon from "../../script/client/clientCall";

export default {
    name: "SubmissionQuery",
    props: ['stepCode', 'tableConfigObject', 'checkedList', 'buttons', 'needExport'],
    data: function () {
        return {
            stepCodes: Config.stepCode,
            query: {
                projectName: '',
                statuses: '',
                itemCode: '',
                auditNo: '',
                contractNo: '',
                constructionUnit: '',
                contractMoney: '',
                assignedId: '',
                auditType: '',
                submissionPrice: '',
                secondAuditPrice: '',
                auditFee: '',
            },
            units: [],
            inters: [],
            auditTypes: Config.auditTypes,
            statusList: [
                {value: 0, label: '所有'},
                {value: -10, label: '保存'},
                {value: -20, label: '退回'},
                {value: -30, label: '争议处理(送审人)'},
                {value: 10, label: '审计立项'},
                {value: 20, label: '审计分配'},
                {value: 25, label: '分配组员'},
                {value: 30, label: '分配审核'},
                {value: 40, label: '勘察准备'},
                {value: 50, label: '现场勘察'},
                {value: 60, label: '争议处理'},
                {value: 65, label: '争议处理(审计处)'},
                {value: 70, label: '初审'},
                {value: 80, label: '复审'},
                {value: 85, label: '征求意见'},
                {value: 90, label: '完成'},
                {value: 100, label: '归档'},
                {value: 110, label: '归档完成'},
            ],
        }
    },
    mounted: function () {
        ClientCallCommon.getConstructionUnits().then(res => {
            this.units = []
            res.list.content.forEach(user => {
                this.units.push({
                    value: user.id,
                    label: user.name
                })
            })
            ClientCallCommon.getIntermediary().then(res => {
                this.inters = []
                res.list.content.forEach(user => {
                    this.inters.push({
                        value: user.id,
                        label: user.name
                    })
                })
            })
            this.list()
        })
    },
    methods: {
        btnClick: function (event) {
            event()
        },
        exportData: function () {
            let exportOptions = {
                statuses: []
            }
            for (let op in this.query) {
                if (this.query[op]) {
                    exportOptions[op] = this.query[op]
                }
            }
            ClientCallCommon.exportData(ClientCallProject.exportSubmissions, exportOptions, '工程结算送审表')
        },
        queryList: function () {
            this.list()
        },
        list(config) {
            let data = Common.copyObject(Config.page)

            for (let op in this.query) {
                data[op] = this.query[op]
            }

            if (!data['statuses']) {
                if (this.stepCode === 0) {
                    data['statuses'] = []
                } else if (this.stepCode === -10) {
                    data['statuses'] = [-10, 10]
                } else if (this.stepCode === 10) {
                    data['statuses'] = [20, 25, 30, 40, 50, 60, 65, 70, 80, 90, 100, 110]
                } else {
                    data['statuses'] = [this.stepCode]
                }
            }

            for (let prop in config) {
                data[prop] = config[prop]
            }

            this.tableConfigObject.currentPage = data.page

            if (this.stepCode === -10) {
                data.creatorId = this.$root.loginUser.id
            }

            if (this.stepCode === 0) {
                data.creatorId = -1
            }

            ClientCallProject.getSubmissions(data).then(res => {

                if (this.checkedList) {
                    this.checkedList = []
                }

                if (this.stepCode === 0 || this.stepCode === -10) {
                    res.list.content.forEach(d => {
                        d.status = this.statusList.filter(s => s.value === d.status)[0].label
                    })
                }

                if (this.stepCode === -10) {
                    res.list.content.forEach(d => {
                        d.hideOper = (d.status !== '保存')
                    })
                }

                res.list.content.forEach(d => {
                    let unit = this.units.filter(u => u.value + '' === d.constructionUnit + '')[0]
                    d.constructionUnit = unit ? unit.label : ''
                })

                this.tableConfigObject.data = res.list.content
                this.tableConfigObject.total = res.list.totalElements
            })
        },
    },
    components: {},
}
</script>

<style scoped>

</style>