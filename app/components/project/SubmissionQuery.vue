<template>
    <el-form :inline="true" :model='query' ref='query' class="demo-form-inline query-form">
        <el-form-item prop="status" v-if="stepCode===0">
            <el-select v-model="query.status" filterable placeholder="审计状态" style="width: 110px;">
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
        <el-form-item prop="contractNo">
            <el-input v-model="query.contractNo" placeholder="合同编码" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item prop="projectName">
            <el-input v-model="query.projectName" placeholder="工程项目" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item prop="constructionUnit">
            <el-select v-model="query.constructionUnit" filterable placeholder="施工单位" style="width: 220px;">
                <el-option
                    v-for="unit in units"
                    :key="unit.value"
                    :label="unit.label"
                    :value="unit.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="contractMoney">
            <el-input v-model="query.contractMoney" placeholder="中标/合同金额" style="width: 120px;"></el-input>
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
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced].indexOf(stepCode)===-1 ">
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
        <el-form-item prop="auditFee"
                      v-if="[stepCodes.submissionSave,stepCodes.auditProject,stepCodes.alloced,
                      stepCodes.surveyPrepare,stepCodes.survey,stepCodes.argueHandle,stepCodes.auditFirst].indexOf(stepCode)===-1 ">
            <el-input v-model="query.auditFee" placeholder="审计费用" style="width: 120px;"></el-input>
        </el-form-item>

        <el-button type="primary" @click="queryList">查询</el-button>
        <el-button @click="$refs['query'].resetFields()">重置</el-button>
        <el-button v-for="btn in buttons" :type="btn.color" @click="btnClick(btn.event)" :key="btn.name">
            {{ btn.name }}
        </el-button>
    </el-form>
</template>

<script>

import Common from "../../script/common";
import Config from "../../script/config";
import ClientCallProject from "../../script/client/project/clientCall";
import ClientCallCommon from "../../script/client/clientCall";

export default {
    name: "SubmissionQuery",
    props: ['stepCode', 'tableConfigObject', 'checkedList', 'buttons'],
    data: function () {
        return {
            stepCodes: Config.stepCode,
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
                {value: -10, label: '送审保存'},
                {value: -20, label: '送审打回'},
                {value: -30, label: '处理争议'},
                {value: 10, label: '审计立项'},
                {value: 20, label: '审计分配'},
                {value: 30, label: '分配审核'},
                {value: 40, label: '勘察准备'},
                {value: 50, label: '现场勘察'},
                {value: 60, label: '争议处理'},
                {value: 70, label: '初审'},
                {value: 80, label: '复审'},
                {value: 90, label: '完成'},
                {value: 100, label: '归档'},
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
        queryList: function () {
            this.list()
        },
        list(config) {
            let data = Common.copyObject(Config.page)

            for (let op in this.query) {
                data[op] = this.query[op]
            }

            if (!data['status']) {
                data['status'] = this.stepCode
            }

            for (let prop in config) {
                data[prop] = config[prop]
            }

            this.tableConfigObject.currentPage = data.page

            ClientCallProject.getSubmissions(data).then(res => {

                if (this.checkedList) {
                    this.checkedList = []
                }

                if (this.stepCode === 0) {
                    res.list.content.forEach(d => {
                        d.status = this.statusList.filter(s => s.value === d.status)[0].label
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