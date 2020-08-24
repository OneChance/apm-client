<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>资料清单组维护</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="addGroup">添加资料组</el-button>
            </div>

            <table-component v-bind:tableConfig="tableConfig"></table-component>

        </el-card>

        <el-dialog :visible.sync="groupDialogVisible"
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
                    targetOrder="new"
                    :data="alloc">
                </el-transfer>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="groupDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="groupDialogVisible=false;commitAlloc()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import MaterialFile from '../script/server/materialFile'
import TableComponent from "./TableComponent";

export default {
    name: "SysMaterialFileGroup",
    mounted: function () {
        let comp = this
        comp.list()
    },
    data: function () {
        return {
            currentGroup: {},
            submitGroup: {
                id: '',
                name: '',
                materialId: []
            },
            alloc: [],    //待分配
            alloced: [],  //已分配
            groupDialogVisible: false,
            tableConfig: {
                data: [],
                cols: [
                    {prop: 'name', label: '资料组名称', width: '500'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.editGroup,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.deleteGroup,
                        check: true
                    }
                ]
            },
            allocList: [],
        }
    },
    methods: {
        addGroup() {
            let comp = this
            comp.groupDialogVisible = true;
            //数据清除
            comp.clearData()
            MaterialFile.getMaterialTypes().then(res => {
                //初始化待分配资料类别
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
            let comp = this
            comp.submitGroup.name = comp.currentGroup.name
            for (let a of comp.alloced) {
                comp.submitGroup.materialId.push(a)
            }
            MaterialFile.saveMaterialGroup(comp.submitGroup).then(() => {
                comp.$message({
                    message: '操作成功',
                    type: 'success'
                });
                comp.list()
            })
        },
        editGroup(row) {
            let comp = this
            //数据清除
            comp.clearData()
            comp.groupDialogVisible = true;
            comp.currentGroup = row
            MaterialFile.getMaterialTypes().then(res => {
                //初始化待分配资料类别
                let search = res.list.map(type => type.name)
                res.list.forEach((type, index) => this.alloc.push({
                    label: type.name,
                    key: type.id,
                    search: search[index]
                }));

                //加载已分配的资料
                MaterialFile.getMaterialGroup({id: row.id}).then(res => {
                    comp.submitGroup.id = res.materialGroup.id
                    for (let detail of res.materialGroup.details) {
                        this.alloced.push(detail.material.id);
                    }
                })
            })
        },
        deleteGroup(row) {
            let comp = this
            MaterialFile.deleteMaterialGroup({id: row.id}).then(() => {
                comp.$message({
                    message: '操作成功',
                    type: 'success'
                });
                comp.list()
            })
        },
        list() {
            MaterialFile.getMaterialGroups().then(res => {
                this.tableConfig.data = res.list
            })
        },
        clearData() {
            this.currentGroup = {}
            this.submitGroup.id = ''
            this.submitGroup.name = ''
            this.submitGroup.materialId = []
            this.alloc = []
            this.alloced = []
        }
    },
    components: {TableComponent}
}
</script>

<style scoped>

</style>