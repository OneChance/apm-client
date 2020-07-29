<template>
    <div class="card-content">
        <el-card class="box-card">

            <div slot="header" class="clearfix">
                <span>资料清单类别维护</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="dialogVisible = true">添加资料类别</el-button>
            </div>
            <table-component v-bind:tableConfig="tableConfig"></table-component>

        </el-card>


        <el-dialog title="资料类别信息"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="currentMaterialFileType.name"></el-input>
                </el-form-item>
                <el-form-item label="是否必须上传" prop="required">
                    <el-switch v-model="currentMaterialFileType.required"></el-switch>
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
    import App from "../script/app";

    export default {
        name: "SysMaterialFile",
        mounted: function () {
            let comp = this
            MaterialFile.getMaterialTypes().then(res => {
                comp.tableConfig.data = res.list
            })
        },
        data: function () {
            return {
                fileTypes: [],
                currentMaterialFileType: {
                    id: '',
                    name: '',
                    required: false
                },
                dialogVisible: false,
                tableConfig: {
                    data: [],
                    cols: [
                        {prop: 'name', label: '资料类别名称', width: '500'},
                        {prop: 'required', label: '是否必须上传', formatter: this.requiredFormatter},
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
                    ]
                },
            }
        },
        methods: {
            submit() {
                let comp = this
                MaterialFile.saveMaterialType(this.currentMaterialFileType).then(result => {
                    comp.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    MaterialFile.getMaterialTypes().then(res => {
                        comp.tableConfig.data = res.list
                    })
                })
            },
            editFileType(row) {
                this.dialogVisible = true
                this.currentMaterialFileType.id = row.id
                this.currentMaterialFileType.name = row.name
                this.currentMaterialFileType.required = row.required
            },
            deletePrepare(row) {
                this.currentMaterialFileType.id = row.id
            },
            deleteFileType(row) {
                let comp = this
                MaterialFile.deleteMaterialTypes({id: row.id}).then(res => {
                    comp.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    MaterialFile.getMaterialTypes().then(res => {
                        comp.tableConfig.data = res.list
                    })
                })
            },
            requiredFormatter(row, column) {
                return row.required ? '是' : '否'
            },
            toPage: function (val) {
                console.log('to page :' + val);
            },
        },
        components: {TableComponent}
    }
</script>

<style scoped>

</style>