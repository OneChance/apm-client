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
                               @click="dialogVisible=true;roleUsers(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="授权" placement="top">
                            <i class="fa fa fa-key fa-lg click-fa success-fa" @click="authRights()"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="dialogVisible=true;editRole(scope.row)"></i>
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


        <el-dialog :title="currentRow.name+'用户分配'"
                   :visible.sync="dialogVisible"
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible=false;commitRoleUsers()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import Role from '../script/server/role'
    import User from '../script/server/user'

    export default {
        name: "SysRole",
        mounted: function () {
            this.roles = Role.getRoles()
        },
        data: function () {

            const generateData2 = _ => {
                const data = [];
                const users = User.getUsers()
                const search = users;
                users.forEach((user, index) => {
                    data.push({
                        label: user,
                        key: index,
                        search: search[index]
                    });
                });
                return data;
            };

            return {
                roleName: '',
                roles: [],
                dialogVisible: false,
                alloc: generateData2(),
                currentRow: {},
                alloced: [],
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
            },
            authRights: function () {

            },
            editRole: function () {

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
            }
        },
    }
</script>

<style scoped>

</style>