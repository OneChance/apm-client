<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" ref='query' :model='query'>
                <el-form-item prop="userName">
                    <el-input v-model="query.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="query.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item prop="states">
                    <el-select v-model="query.states" placeholder="状态" style="width:100px">
                        <el-option key="NORMAL" label="正常" value="NORMAL"></el-option>
                        <el-option key="DISABLE" label="禁用" value="DISABLE"></el-option>
                        <el-option key="DELETE" label="删除" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="types">
                    <el-select v-model="query.types" placeholder="分组" style="width:100px">
                        <el-option key="INSIDE" label="内部" value="INSIDE"></el-option>
                        <el-option key="OUTSIDE" label="外部" value="OUTSIDE"></el-option>
                        <el-option key="THIRDPARTY" label="中介" value="THIRDPARTY"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                    <el-button @click="$refs['query'].resetFields()">重置</el-button>
                    <el-button type="success" @click="add">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog title="用户信息"
                   :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="state">
                        <el-radio-group v-model="form.state">
                            <el-radio-button label="NORMAL">正常</el-radio-button>
                            <el-radio-button label="DISABLE">禁用</el-radio-button>
                            <el-radio-button label="DELETE">删除</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="分组" prop="type">
                        <el-radio-group v-model="form.type" @change="groupChange">
                            <el-radio-button label="INSIDE">内部</el-radio-button>
                            <el-radio-button label="OUTSIDE">外部</el-radio-button>
                            <el-radio-button label="THIRDPARTY">中介</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="中介机构" prop="thirdparty.id" v-if="form.type === 'THIRDPARTY'">
                        <el-select v-model="form.thirdparty.id" filterable placeholder="请选择中介机构" class="table-select">
                            <el-option
                                v-for="inter in inters"
                                :key="inter.id"
                                :label="inter.name"
                                :value="inter.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="telphone">
                        <el-input v-model="form.telphone"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="roles">
                        <el-select
                            class="form-select"
                            v-model="form.roles" multiple placeholder="请选择">
                            <el-option
                                v-for="role in roles"
                                :key="role.id"
                                :label="role.name"
                                :value="role.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" prop="departName" v-if="form.type === 'INSIDE'">
                        <el-input v-model="form.departName"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import User from "../script/server/user";
import Common from "../script/common";
import Config from "../script/config";
import TableComponent from "./TableComponent";
import md5 from 'js-md5';
import Role from "../script/server/role"
import ClientCallCommon from "../script/client/clientCall";

export default {
    name: "SysUser",
    watch: {
        userInfoDialogVisible: function (vis) {
            if (vis) {
                Role.getRoles(Config.pageAll).then(res => {
                    this.roles = res.list.content
                })

                ClientCallCommon.getIntermediary().then(res => {
                    this.inters = res.list.content
                })
            }
        }
    },
    data: function () {
        return {
            query: {
                userName: '',
                name: '',
                states: [],
                types: []
            },
            oldPassword: '',
            form: {
                id: '',
                username: '',
                password: '888888',
                name: '',
                email: '',
                telphone: '',
                thirdparty: {
                    id: ''
                },
                roles: [],
                state: 'NORMAL',
                type: '',
                departName: '',
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                type: [
                    {required: true, message: '请选择分组', trigger: 'blur'},
                ],
                'thirdparty.id': [
                    {required: true, message: '请选择中介机构', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'username', label: '用户名'},
                    {prop: 'name', label: '姓名'},
                    {
                        prop: 'state',
                        label: '状态',
                        width: '80',
                        formatter: this.stateFormatter,
                        tag: true,
                        tagType: this.stateTagFormatter,
                        tagSize: 'small'
                    },
                    {prop: 'type', label: '分组', formatter: this.typeFormatter},
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
                ],
                operWidth: 100
            },
            userInfoDialogVisible: false,
            roles: [],
            inters: [],
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        queryList: function () {
            this.list(this.query)
        },
        stateTagFormatter(value) {
            switch (value) {
                case 'NORMAL':
                    return 'success'
                case 'DISABLE':
                    return 'warning'
                case 'DELETE':
                    return 'danger'
                default:
                    return ''
            }
        },
        stateFormatter(value) {
            switch (value) {
                case 'NORMAL':
                    return '正常'
                case 'DISABLE':
                    return '禁用'
                case 'DELETE':
                    return '删除'
                default:
                    return ''
            }
        },
        typeFormatter(value) {
            switch (value) {
                case 'INSIDE':
                    return '内部'
                case 'OUTSIDE':
                    return '外部'
                case 'THIRDPARTY':
                    return '中介机构'
                default:
                    return ''
            }
        },
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.password === this.oldPassword) {
                        this.form.password = ''
                    } else {
                        this.form.password = md5(this.form.password)
                    }
                    this.form.roles = this.form.roles.map(roleId => {
                        return {role: {id: roleId}}
                    })
                    User.saveUser(this.form).then(() => {
                        this.operSuccess(this)
                        this.userInfoDialogVisible = false;
                    })
                }
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        add: function () {
            this.userInfoDialogVisible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
            });
        },
        edit: function (row) {
            User.getUser({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.$nextTick(() => {
                    for (let prop in result.user) {
                        if (result.user[prop]) {
                            this.form[prop] = result.user[prop]
                        }
                    }
                    this.oldPassword = this.form.password
                    this.form.roles = this.form.roles.map(role => role.role.id)
                })
            })
        },
        delete: function (row) {
            User.updateState({id: row.id, state: 'DELETE'}).then(() => {
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

            User.getUsers(data).then(res => {
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