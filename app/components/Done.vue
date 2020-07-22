<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>已办事项列表</span>
            </div>
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="标题">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-col :span="11">
                        <el-date-picker type="date" v-model="form.date1" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" v-model="form.date2" placeholder="选择时间" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>

            <template>
                <el-table
                        :data="tableData"
                        :span-method="arraySpanMethod"
                        style="width: 100%">
                    <el-table-column
                            prop="date"
                            label="日期"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                </el-table>
            </template>

        </el-card>
    </div>
</template>

<script>

    export default {
        name: "Land",
        data: function () {
            return {
                form: {
                    title: '',
                    date1: '',
                    date2: ''
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        mounted: function () {

        },
        methods: {

        },
        components: {},
        filters: {

        }
    }
</script>

<style scoped>
    .box-card {
        width: 90%;
    }
</style>