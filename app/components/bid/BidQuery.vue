<template>
    <el-form :inline="true" :model='query' ref='query' class="demo-form-inline query-form">
        <el-form-item prop="status" v-if="stepCode===0 || stepCode ===-10">
            <el-select v-model="query.status" filterable placeholder="审计状态" style="width: 160px;">
                <el-option
                    v-for="status in statusList"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="itemCode">
            <el-input v-model="query.itemCode" placeholder="立项代码" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item prop="auditNo">
            <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item prop="projectName">
            <el-input v-model="query.projectName" placeholder="工程项目" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item prop="assignedId"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced].indexOf(stepCode)===-1 ">
            <el-select v-model="query.assignedId" filterable placeholder="中介机构" style="width: 200px;">
                <el-option
                    v-for="inter in inters"
                    :key="inter.value"
                    :label="inter.label"
                    :value="inter.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="auditType"
                      v-if="[stepCodes.save,stepCodes.auditProject,stepCodes.alloced].indexOf(stepCode)===-1 ">
            <el-select v-model="query.auditType" filterable placeholder="审计方式" style="width: 110px;">
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
            <el-input v-model="query.submissionPrice" placeholder="送审金额" style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item prop="secondAuditPrice"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced,
                      stepCodes.surveyPrepare,stepCodes.survey,stepCodes.argueHandle,stepCodes.auditFirst].indexOf(stepCode)===-1 ">
            <el-input v-model="query.secondAuditPrice" placeholder="审定金额" style="width: 120px;"></el-input>
        </el-form-item>

        <el-button type="primary" @click="queryList">查询</el-button>
        <el-button @click="$refs['query'].resetFields()">重置</el-button>
        <el-button type="success" @click="exportData" v-if="needExport">导出</el-button>
        <el-button v-for="btn in buttons" :type="btn.color" @click="btnClick(btn.event)" :key="btn.name">
            {{ btn.name }}
        </el-button>
    </el-form>
</template>

<script>

import Common from "../../script/common";
import Config from "../../script/config";
import ClientCallBid from "../../script/client/bid/clientCall";
import ClientCallCommon from "../../script/client/clientCall"

export default {
    name: "BidQuery",
    props: ['stepCode', 'tableConfigObject', 'checkedList', 'buttons', 'needExport'],
    data: function () {
        return {
            stepCodes: Config.stepCodeBid,
            query: {
                projectName: '',
                status: '',
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
                {value: 10, label: '审计立项'},
                {value: 20, label: '审计分配'},
                {value: 25, label: '分配组员'},
                {value: 30, label: '分配审核'},
                {value: 40, label: '初审'},
                {value: 50, label: '复审'},
                {value: 60, label: '完成'},
                {value: 70, label: '归档'},
                {value: 80, label: '归档完成'},
            ],
        }
    },
    mounted: function () {
        ClientCallCommon.getIntermediary().then(res => {
            this.inters = []
            res.list.content.forEach(user => {
                this.inters.push({
                    value: user.id,
                    label: user.name
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
                status: 0
            }
            for (let op in this.query) {
                if (this.query[op]) {
                    exportOptions[op] = this.query[op]
                }
            }
            ClientCallCommon.exportData(ClientCallBid.exportSubmissions, exportOptions, '招标控制价送审表')
        },
        queryList: function () {
            this.list()
        },
        list(config) {
            let data = Common.copyObject(Config.page)

            for (let op in this.query) {
                data[op] = this.query[op]
            }

            if (!data['status']) {
                if (this.stepCode === -10) {
                    data['status'] = 0
                } else {
                    data['status'] = this.stepCode
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

            ClientCallBid.getSubmissions(data).then(res => {

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