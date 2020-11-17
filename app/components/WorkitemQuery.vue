<template>
    <el-form :inline="true" :model='query' ref='query' class="demo-form-inline query-form">
        <el-form-item prop="auditNo">
            <el-input v-model="query.auditNo" placeholder="审计编号" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item prop="projectName">
            <el-input v-model="query.projectName" placeholder="项目名称" style="width: 300px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
        <el-button @click="$refs['query'].resetFields()">重置</el-button>
        <el-button v-for="btn in buttons" :type="btn.color" @click="btnClick(btn.event)" :key="btn.name">
            {{ btn.name }}
        </el-button>
    </el-form>
</template>

<script>

import Common from "../script/common";
import Config from "../script/config";
import ClientCall from "../script/client/clientCall";

export default {
    name: "WorkitemQuery",
    props: ['type', 'tableConfigObject', 'checkedList', 'buttons'],
    data: function () {
        return {
            stepCodes: Config.stepCode,
            query: {
                projectName: '',
                status: '',
                auditNo: '',
            },
        }
    },
    mounted: function () {
        this.list()
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