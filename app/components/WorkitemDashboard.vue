<template>
    <div class="work-dashboard">
        <el-row>
            <el-col :span="12">
                <will-do v-bind:cols="willDoCols" v-bind:formName="'willdo'" v-bind:height="600"></will-do>
            </el-col>
            <el-col :span="12">
                <done v-bind:cols="workCols" v-bind:formName="'done'"></done>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <my-work v-bind:cols="workCols" v-bind:formName="'mywork'"></my-work>
            </el-col>
            <el-col :span="12">
                <my-create v-bind:cols="workCols" v-bind:formName="'mycreate'"></my-create>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import WillDo from "./WillDo";
import Done from "./Done";
import MyWork from "./MyWork";
import MyCreate from "./MyCreate";

export default {
    name: "WorkitemDashboard",
    created: function () {

    },
    mounted() {

    },
    data: function () {
        return {
            workCols: [
                {
                    prop: 'auditNo',
                    label: '审计编号',
                    width: '100',
                },
                {
                    prop: 'projectName',
                    label: '项目名称',
                    width: '150',
                },
                {
                    prop: 'creator.name',
                    label: '送审人',
                    width: '100'
                },
            ],
            willDoCols: [
                {
                    prop: 'targetStr',
                    label: '送审类型',
                    width: '110',
                },
                {
                    prop: 'stageStr',
                    label: '待办名称',
                    width: '100'
                },
                {
                    prop: 'nextStageStr',
                    label: '下一步',
                    width: '150',
                },
                {
                    prop: 'auditNo',
                    label: '审计编号',
                    width: '100',
                },
                {
                    prop: 'projectName',
                    label: '项目名称',
                    width: '150',
                },
                {
                    prop: 'creator.name',
                    label: '送审人',
                    width: '100'
                },
            ]
        }
    },
    methods: {},
    components: {WillDo, Done, MyWork, MyCreate}
}
</script>

<style scoped>

</style>
