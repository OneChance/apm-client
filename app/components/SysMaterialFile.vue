<template>
    <div class="card-content">
        <el-card class="box-card">

            <div slot="header" class="clearfix">
                <span>资料清单类别维护</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="dialogVisible = true">添加资料类别</el-button>
            </div>

            <el-table :data="fileTypes"
                      max-height="600"
                      border
                      style="width: 100%;"
                      size="medium">
                <el-table-column label="资料类别名称" prop="name" align="center" width="500"></el-table-column>
                <el-table-column label="是否必须上传" prop="required" :formatter="requiredFormatter"
                                 align="center"></el-table-column>
                <el-table-column label="操作" align="left">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="dialogVisible=true;editFileType(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa"
                               @click="deleteConfirm=true;deletePrepare(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
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

        <el-dialog
                title="提示"
                :visible.sync="deleteConfirm"
                width="30%"
                :close-on-click-modal="false">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deleteConfirm = false;deleteFileType()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>

    import MaterialFile from '../script/server/materialFile'

    export default {
        name: "SysMaterialFile",
        mounted: function () {
            let comp = this
            MaterialFile.getMaterialTypes().then(res => {
                comp.fileTypes = res.list
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
                deleteConfirm: false
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
                        comp.fileTypes = res.list
                    })
                })
            },
            editFileType(row) {
                this.currentMaterialFileType.id = row.id
                this.currentMaterialFileType.name = row.name
                this.currentMaterialFileType.required = row.required
            },
            deletePrepare(row) {
                this.currentMaterialFileType.id = row.id
            },
            deleteFileType() {
                let comp = this
                MaterialFile.deleteMaterialTypes({id: this.currentMaterialFileType.id}).then(res => {
                    comp.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    MaterialFile.getMaterialTypes().then(res => {
                        comp.fileTypes = res.list
                    })
                })
            },
            requiredFormatter(row, column) {
                return row.required ? '是' : '否'
            }
        },
        components: {},
    }
</script>

<style scoped>

</style>