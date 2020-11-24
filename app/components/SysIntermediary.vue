<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.name" placeholder="单位名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="add">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog title="用户信息"
                   :visible.sync="userInfoDialogVisible"
                   class="form-dialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
                    <el-form-item label="单位名称" prop="name" style="width:580px">
                        <el-input v-model="form.name" style="width:500px"
                                  :disabled="!$root.loginUser.admin"></el-input>
                    </el-form-item>

                    <div v-for="(link,index) in form.links">
                        <el-form-item label="联系人" :prop="'links.' + index + '.contact'"
                                      :rules="{required: true, message: '联系人', trigger: 'blur'}"
                                      style="width:200px">
                            <el-input v-model="link.contact" style="width:120px"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" :prop="'links.' + index + '.telphone'"
                                      :rules="{required: true, message: '联系方式', trigger: 'blur'}"
                                      style="width:240px">
                            <el-input v-model="link.telphone" style="width:160px"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" :prop="'links.' + index + '.mail'">
                            <el-input v-model="link.mail"></el-input>
                        </el-form-item>
                        <el-button @click.prevent="removeLink(link)">删除</el-button>
                    </div>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialogVisible = false">取 消</el-button>
                <el-button @click="addLink">新增联系人</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import Intermediary from "../script/server/intermediary";
import Common from "../script/common";
import Config from "../script/config";
import TableComponent from "./TableComponent";

export default {
    name: "SysIntermediary",
    data: function () {
        return {
            query: {},
            form: {
                id: '',
                name: '',
                thirdParty: true,
                links: [{
                    contact: '',
                    telphone: '',
                    email: '',
                }],
            },
            rules: {
                name: [
                    {required: true, message: '请输入单位名称', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '单位', width: '500'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.delete,
                        check: true
                    }
                ]
            },
            userInfoDialogVisible: false,
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        addLink: function () {
            this.form.links.push({
                contact: '',
                telphone: '',
                email: '',
            })
        },
        removeLink: function (link) {
            let index = this.form.links.indexOf(link)
            if (index > 0) {
                this.form.links.splice(index, 1)
            } else {
                this.$message({
                    message: '第一行无法删除',
                    type: 'success'
                });
            }
        },
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Intermediary.save(this.form).then(() => {
                        this.operSuccess(this)
                        this.userInfoDialogVisible = false;
                    })
                }
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        add: function () {
            this.userInfoDialogVisible = true
            this.form.links.length = 1
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
                this.form.links = [{
                    contact: '',
                    telphone: '',
                    email: '',
                }]
            });
        },
        edit: function (row) {
            Intermediary.get({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.$nextTick(() => {
                    this.form = result.thirdparty
                });
            })
        },
        delete: function (row) {
            Intermediary.delete({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        operSuccess(comp) {
            comp.dialogVisible = false
            comp.$message({
                message: '操作成功',
                type: 'success'
            });
            comp.list({page: 1})
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            data.thirdParty = true;
            Intermediary.gets(data).then(res => {
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
    },
    components: {
        TableComponent
    }
}
</script>

<style scoped>

</style>