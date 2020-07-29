<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>资料清单组维护</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="groupDialogVisible = true;addGroup()">添加资料组</el-button>
            </div>

            <table-component v-bind:tableConfig="tableConfig"></table-component>

        </el-card>

        <el-dialog :title="currentGroup.name+'资料清单维护'"
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
    import TableComponent from "./TableComponent";

    export default {
        name: "SysMaterialFileGroup",
        mounted: function () {
            let comp = this
            MaterialFile.getMaterialGroups().then(res => {
                comp.tableConfig.data = res.list
            })
        },
        data: function () {
            return {
                currentGroup: {
                    name: ''
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
            }
        },
        methods: {
            addGroup() {
                let comp = this
                //数据清除
                comp.alloc = []
                comp.alloced = []
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
                for (let a of this.alloced) {
                    console.log(a)
                }
            },
            editGroup() {
                //数据清除
                comp.alloc = []
                comp.alloced = []
                MaterialFile.getMaterialTypes().then(res => {
                    //初始化待分配资料类别
                    let search = res.list.map(type => type.name)
                    res.list.forEach((type, index) => {
                        let addType = {
                            label: type.name,
                            key: type.id,
                            search: search[index]
                        }
                        if (type.alloced) {
                            comp.alloced.push(addType);
                        } else {
                            comp.alloc.push(addType);
                        }
                    });
                })
            },
            deleteGroup() {

            }
        },
        components: {TableComponent}
    }
</script>

<style scoped>

</style>