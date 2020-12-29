<template>
    <el-form :inline="true" :model='query' ref='query' class="demo-form-inline query-form">
        <el-form-item prop="auditNo" v-if="!formName">
            <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="projectName" v-if="!formName">
            <el-input v-model="query.projectName" placeholder="项目名称" style="width: 300px;" size="small"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryList" v-if="!formName" size="small">查询</el-button>
            <el-button @click="$refs['query'].resetFields()" v-if="!formName" size="small">重置</el-button>
            <el-button v-for="btn in buttons" :type="btn.color" @click="btnClick(btn.event)" :key="btn.name"
                       :size="btnSize" >
                {{ btn.name }}
            </el-button>
            <el-button v-if="formName==='done'" size="mini" class="hold-btn">占位</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

import Common from "../script/common";
import Config from "../script/config";
import ClientCall from "../script/client/clientCall";

export default {
    name: "WorkitemQuery",
    props: ['type', 'tableConfigObject', 'checkedList', 'buttons', 'formName'],
    data: function () {
        return {
            stepCodes: Config.stepCode,
            query: {
                projectName: '',
                status: '',
                auditNo: '',
            },
            btnSize: 'small'
        }
    },
    mounted: function () {
        this.list()
        if (this.formName) {
            this.btnSize = 'mini'
        }
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

            if (this.tableConfigObject.pageSize) {
                data.pageSize = this.tableConfigObject.pageSize
            }

            for (let op in this.query) {
                data[op] = this.query[op]
            }
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfigObject.currentPage = data.page
            ClientCall.getWorkitems(data, this.type).then(res => {
                if (this.checkedList) {
                    this.checkedList = []
                }
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