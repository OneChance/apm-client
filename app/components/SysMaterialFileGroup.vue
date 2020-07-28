<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>资料清单组维护</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="groupDialogVisible = true;addGroup()">添加资料组</el-button>
            </div>

            <el-table
                    :data="groups"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="名称"
                        width="600">
                </el-table-column>
                <el-table-column
                        prop="roleOper"
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="roleInfoDialogVisible=true;editGroup(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa" @click="deletePrepare(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog :title="currentGroup.name"
                   :visible.sync="groupDialogVisible"
                   :close-on-click-modal="false"
                   class="material-group">
            <el-form label-width="100px">
                <el-form-item label="清单组名称">
                    <el-input v-model="currentGroup.name" style="width:80%"></el-input>
                </el-form-item>
            </el-form>
            <template>
                <el-transfer
                        filterable
                        :filter-method="filterMethod"
                        v-model="alloced"
                        :titles="['待分配', '已分配']"
                        @change="handleChange"
                        :data="alloc">
                </el-transfer>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="groupDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="groupDialogVisible=false;commitAlloc()">确 定</el-button>
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
            <el-button type="primary" @click="deleteConfirm = false;deleteGroup()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

    import MaterialFile from '../script/server/materialFile'
    import User from "../script/server/user";

    export default {
        name: "SysMaterialFileGroup",
        mounted: function () {

        },
        data: function () {
            return {
                currentGroup: {
                    name: ''
                },
                alloc: [],    //待分配
                alloced: [],  //已分配
                groupDialogVisible: false
            }
        },
        methods: {
            addGroup() {
                let comp = this
                //数据清除
                comp.alloc = []
                MaterialFile.getMaterialTypes().then(res => {
                    //初始化穿梭框左边数据
                    let search = res.list.map(type => type.name)
                    res.list.forEach((type, index) => {
                        comp.alloc.push({
                            label: type.name,
                            key: type.id,
                            search: search[index]
                        });
                    });
                })
            },
            commitAlloc() {
                for (let a of this.alloced) {
                    console.log(a)
                }
            },
            editGroup() {

            },
            deletePrepare(row) {
                this.currentGroup.id = row.id
            },
            deleteGroup() {

            }
        },
    }
</script>

<style scoped>

</style>