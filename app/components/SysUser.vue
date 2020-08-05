<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <i class="fa fa-plus-circle fa-2x right-fa primary-fa" aria-hidden="true"
                   @click="add"></i>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input v-model="currentRow.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="currentRow.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userInfoDialogVisible=false;commit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import User from "../script/server/user";
    import TableComponent from "./TableComponent";
    import Config from "../script/config";

    export default {
        name: "SysUser",
        data: function () {
            return {
                query: {
                    userName: ''
                },
                currentRow: {
                    name: '',
                    password: ''
                },
                tableConfig: {
                    data: [],
                    page: true,
                    pageMethod: this.toPage,
                    cols: [
                        {prop: 'name', label: '姓名', width: '180'},
                    ],
                    oper: [
                        {
                            class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                            tip: {content: '编辑', placement: 'top'},
                            event: this.editUser,
                        },
                        {
                            class: 'fa fa-trash-o fa-lg click-fa',
                            tip: {content: '删除', placement: 'right'},
                            event: this.deleteUser,
                            check: true
                        }
                    ]
                },
                userInfoDialogVisible: false
            }
        },
        mounted: function () {
            this.list()
        },
        methods: {
            list: function (config) {
                let data = Config.page
                for (let prop in config) {
                    data[prop] = config[prop]
                }
                this.tableConfig.data = User.getUsers()
                this.tableConfig.total = this.tableConfig.data.length
            },
            commit: function () {

            },
            toPage: function (val) {
                this.list({page: val})
            },
            add: function () {
                this.userInfoDialogVisible = true
            }
        },
        components: {TableComponent}
    }
</script>

<style scoped>

</style>