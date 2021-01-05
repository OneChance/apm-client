<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.name" placeholder="权限组" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList" size="mini">查询</el-button>
                    <el-button type="success" @click="edit" size="mini">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--角色分配角色组Dialog-->
        <el-dialog title="权限组"
                   :visible.sync="roleUsersDialogVisible"
                   :close-on-click-modal="false"
                   class="role-user">
            <template>
                <el-form label-width="100px">
                    <el-form-item prop="name" label="权限组名称">
                        <el-input v-model="form.name" placeholder="权限组名称"></el-input>
                    </el-form-item>
                </el-form>
                <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    v-model="alloced"
                    :titles="['待分配角色', '已分配角色']"
                    @change="handleChange"
                    :data="alloc">
                </el-transfer>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="roleUsersDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitGroupRoles()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import Role from '../script/server/role'
import Common from '../script/common'
import TableComponent from "./TableComponent";
import Config from "../script/config";

export default {
    name: "SysRoleGroup",
    mounted: function () {
        this.list()
    },
    data: function () {
        return {
            query: {
                name: '',
            },
            form: {
                id: '',
                name: '',
                roles: []
            },
            roleUsersDialogVisible: false,
            currentRow: {},
            alloc: [],    //权限组待分配角色
            alloced: [],  //权限组已分配角色
            filterMethod(query, item) {
                return item.search.indexOf(query) > -1;
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '名称', width: '580'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '分配角色', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.delete,
                        check: true
                    }
                ],
            },
        }
    },
    methods: {
        edit: function (row) {
            this.roleUsersDialogVisible = true
            this.$nextTick(() => {
                this.form.name = ''
                this.form.id = ''
                //数据清除
                this.alloc = []
                this.alloced = []

                //初始化穿梭框左边数据
                //加载所有角色
                Role.getRoles(Config.pageAll).then(result => {
                    let search = result.list.content.map(r => r.name);
                    result.list.content.forEach((role, index) => {
                        this.alloc.push({
                            label: role.name,
                            key: role.id,
                            search: search[index]
                        });
                    });
                })

                if (row.id) {
                    this.form.id = row.id
                    this.form.name = row.name
                    //加载该权限组已分配的角色
                    Role.getRoleGroup({id: row.id}).then(result => {
                        result.role_group.roles.forEach(r => {
                            this.alloced.push(r.roleId)
                        })
                    })
                }
            });
        },
        delete: function (row) {
            Role.deleteGroup({id: row.id}).then(() => {
                this.$message({
                    message: '成功',
                    type: 'success'
                });
                this.list()
            })
        },
        commitGroupRoles: function () {
            if (!this.form.name) {
                this.$notify.error({
                    title: '操作失败!',
                    message: '请填写权限组名称!',
                    duration: 2000
                })
                return
            }
            let roles = []
            this.alloced.forEach(r => {
                roles.push({roleId: r})
            })
            if (roles.length === 0) {
                this.$notify.error({
                    title: '操作失败!',
                    message: '请分配角色!',
                    duration: 2000
                })
                return
            }
            Role.saveGroupRoles({
                id: this.form.id,
                name: this.form.name,
                roles: roles
            }).then(() => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.list()
                this.roleUsersDialogVisible = false;
            })
        },
        handleChange(value, direction, movedKeys) {

        },
        queryList: function () {
            this.list(this.query)
        },
        toPage: function (val) {
            this.list({page: val})
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            Role.getRoleGroups(data).then(res => {
                //如果以后多选框,清除所选数据
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
    },
    components: {TableComponent}
}
</script>

<style scoped>

</style>