<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.userName" placeholder="施工单位名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="add">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <el-dialog title="施工单位信息"
                   :visible.sync="dialogVisible"
                   class="form-dialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" :inline="true">
                    <el-form-item label="施工单位名称" prop="name">
                        <el-input v-model="form.name" style="width: 350px;"></el-input>
                    </el-form-item>
                    <div v-for="(link,index) in form.links">
                        <el-form-item label="联系人" :prop="'links.' + index + '.contact'"
                                      :rules="{required: true, message: '联系人', trigger: 'blur'}">
                            <el-input v-model="link.contact"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" :prop="'links.' + index + '.telphone'"
                                      :rules="{required: true, message: '联系方式', trigger: 'blur'}">
                            <el-input v-model="link.telphone"></el-input>
                        </el-form-item>
                        <el-button @click.prevent="removeLink(link)">删除</el-button>
                    </div>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="addLink">新增联系人</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import TableComponent from "./TableComponent";
import Config from "../script/config";
import Common from '../script/common'
import ConstructionUnit from "../script/server/constructionUnit"

export default {
    name: "SysConstructionUnit",
    data: function () {
        return {
            query: {
                userName: ''
            },
            form: {
                name: '',
                links: [{
                    contact: '',
                    telphone: '',
                }],
            },
            rules: {
                name: [
                    {required: true, message: '施工单位名称', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '施工单位名称', width: '180'},
                    {prop: 'contact', label: '联系人', width: '180'},
                    {prop: 'telphone', label: '联系方式', width: '180'},
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
            dialogVisible: false
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
            })
        },
        removeLink: function (link) {
            let index = this.form.links.indexOf(link)
            if (index > 0) {
                this.form.links.splice(index, 1)
            }
        },
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    ConstructionUnit.saveConstructionUnit(this.form).then(() => {
                        this.operSuccess(this)
                        this.dialogVisible = false;
                    })
                }
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        add: function () {
            this.dialogVisible = true
            this.form.links.length = 1
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
            });
        },
        edit: function (row) {
            ConstructionUnit.getConstructionUnit({id: row.id}).then(result => {
                this.dialogVisible = true
                this.form.id = result.construction.id
                this.form.name = result.construction.name
                this.form.links[0].contact = result.construction.contact
                this.form.links[0].telphone = result.construction.telphone
            })
        },
        delete: function (row) {
            ConstructionUnit.deleteConstructionUnit({id: row.id}).then(() => {
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
            ConstructionUnit.getConstructionUnits(data).then(res => {
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