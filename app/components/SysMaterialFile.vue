<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>资料清单类别维护</span>
            </div>
            <div class="right-button-group">
                <el-button type="primary" @click="addFileType">添加资料类别</el-button>
            </div>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <el-dialog title="资料类别信息"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <el-form label-width="100px" :model="fileTypeForm" ref="fileTypeForm" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="fileTypeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="description">
                    <el-input type="textarea" v-model="fileTypeForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible=false;submit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import MaterialFile from '../script/server/materialFile'
import TableComponent from "./TableComponent";

export default {
    name: "SysMaterialFile",
    mounted: function () {
        let comp = this
        comp.list()
    },
    data: function () {
        return {
            fileTypes: [],
            fileTypeForm: {
                id: '',
                name: '',
                description: '',
                required: false
            },
            rules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
                ],
            },
            dialogVisible: false,
            tableConfig: {
                data: [],
                cols: [
                    {prop: 'name', label: '资料类别名称', width: '400'},
                    {prop: 'description', label: '说明'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editFileType,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.deleteFileType,
                        check: true
                    }
                ],
                operWidth: 100
            },
        }
    },
    methods: {
        submit() {
            let comp = this
            MaterialFile.saveMaterialType(this.fileTypeForm).then(() => {
                comp.$message({
                    message: '操作成功',
                    type: 'success'
                });
                comp.list()
            })
        },
        addFileType() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs['fileTypeForm'].resetFields();
            })
        },
        editFileType(row) {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.fileTypeForm.id = row.id
                this.fileTypeForm.name = row.name
                this.fileTypeForm.description = row.description
                this.fileTypeForm.required = row.required
            })
        },
        deleteFileType(row) {
            let comp = this
            MaterialFile.deleteMaterialTypes({id: row.id}).then(() => {
                comp.$message({
                    message: '删除成功',
                    type: 'success'
                });
                comp.list()
            })
        },
        requiredFormatter(row) {
            return row.required ? '是' : '否'
        },
        toPage: function (val) {

        },
        list: function () {
            MaterialFile.getMaterialTypes().then(res => {
                this.tableConfig.data = res.list
            })
        }
    },
    components: {TableComponent}
}
</script>

<style scoped>

</style>