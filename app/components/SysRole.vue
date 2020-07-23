<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="roleName" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table
                    :data="roles"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="roleOper"
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="用户" placement="left">
                            <i class="fa fa fa-user-o fa-lg click-fa primary-fa"
                               @click="roleUsersDialogVisible=true;roleUsers(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="授权" placement="top">
                            <i class="fa fa fa-key fa-lg click-fa success-fa"
                               @click="roleRightsDialogVisible=true;authRights(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="roleInfoDialogVisible=true;editRole(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa" @click="deleteRole()"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    class="page-nav"
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="100">
            </el-pagination>
        </el-card>

        <!--角色分配用户Dialog-->
        <el-dialog :title="currentRow.name+'用户分配'"
                   :visible.sync="roleUsersDialogVisible"
                   :close-on-click-modal="false"
                   class="role-user">
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
                <el-button @click="roleUsersDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleUsersDialogVisible=false;commitRoleUsers()">确 定</el-button>
            </div>
        </el-dialog>

        <!--角色分配权限Dialog-->
        <el-dialog :title="currentRow.name+'授权'"
                   :visible.sync="roleRightsDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-tree
                        class="role-rights-tree"
                        :data="rightsTree"
                        ref="tree"
                        node-key="id"
                        :default-expanded-keys="expandKeys"
                        :default-checked-keys="defaultKeys"
                        show-checkbox
                        @check-change="handleCheckChange">
                </el-tree>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleRightsDialogVisible=false;commitRoleRights()">确 定</el-button>
            </div>
        </el-dialog>

        <!--角色信息Dialog-->
        <el-dialog :title="currentRow.name+'信息'"
                   :visible.sync="roleInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>

                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="角色名称">
                        <el-input v-model="currentRow.name"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch v-model="currentRow.status === '启用'"></el-switch>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleInfoDialogVisible=false;commitRoleInfo()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import Role from '../script/server/role'
    import User from '../script/server/user'
    import Right from '../script/server/right'

    export default {
        name: "SysRole",
        mounted: function () {
            this.roles = Role.getRoles()
        },
        data: function () {
            return {
                roleName: '',
                roles: [],
                roleUsersDialogVisible: false,
                roleRightsDialogVisible: false,
                roleInfoDialogVisible: false,
                currentRow: {},
                alloc: [],    //角色待分配用户
                alloced: [],  //角色已分配用户
                rightsTree: [],    //权限树
                expandKeys: [], //默认展开的权限
                defaultKeys: [], //默认选中的权限
                filterMethod(query, item) {
                    return item.search.indexOf(query) > -1;
                }
            }
        },
        methods: {
            handleCurrentChange: function (val) {
                console.log('to page :' + val);
            },
            roleUsers: function (row) {
                this.currentRow = row
                let comp = this

                //数据清除
                comp.alloc = []
                //初始化穿梭框左边数据
                let users = User.getUsers()
                let search = users;
                users.forEach((user, index) => {
                    comp.alloc.push({
                        label: user,
                        key: index,
                        search: search[index]
                    });
                });
            },
            authRights: function (row) {
                let comp = this

                //数据清除
                comp.rightsTree = []
                comp.expandKes = []
                comp.defaultKeys = []

                this.currentRow = row
                //初始化已分配权限
                //获得所有权限
                let rights = Right.getRights()
                //构建树
                for (let right of rights.reverse()) {
                    comp.expandKeys.push(right.id)
                    let addObj = {id: right.id, label: right.label, pid: right.pid}
                    let last = comp.rightsTree.pop();
                    while (last) {
                        if (last.pid === right.id) {//如果权限存在父子关系,设置children
                            if (!addObj.children) {
                                addObj.children = []
                            }
                            addObj.children.push(last)
                        } else {//如果不是父子关系,直接放进tree列表,之后的也不用再处理
                            comp.rightsTree.push(last)
                            break;
                        }
                        last = comp.rightsTree.pop()
                    }
                    comp.rightsTree.push(addObj)
                }

                comp.defaultKeys = Right.getRoleRights(row.id)
            },
            editRole: function (row) {
                this.currentRow = row
            },
            deleteRole: function () {

            },
            commitRoleUsers: function () {

            },
            handleChange(value, direction, movedKeys) {
                let comp = this;
                for (let v of value) {
                    console.log(comp.alloc[v].label)
                }
            },
            commitRoleRights: function () {
                console.log(this.$refs.tree.getCheckedNodes().filter(r => !r.children).map(r => r.label))
            },
            commitRoleInfo: function () {
                //true为启用
                console.log(this.currentRow.name + " " + this.currentRow.status)
            }
        },
    }
</script>

<style scoped>
    .role-rights-tree {
        height: 400px;
        overflow: scroll;
        overflow-x: hidden;
    }
</style>