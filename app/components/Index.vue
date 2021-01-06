<template id="index">
    <div>
        <div class="header-bar">
            <div class="header-title">
                <span class="logo-title">
                        扬州大学工程审计管理信息系统
                </span>
            </div>
            <div class="header-navi">
                <el-menu :default-active="activeMenuIndex" class="el-menu-demo navi-menu" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff">
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value"
                                  v-if="menu.id === 6">
                        <div @click="handleSelect(menu.value,$event)">
                            {{ menu.label }}
                        </div>
                    </el-menu-item>
                    <el-submenu :index="menu.value" v-for="menu in menus" :key="menu.value" v-if="menu.id === 2">
                        <template slot="title">{{ menu.label }}</template>
                        <el-menu-item :ref='m.value' :index="m.value" v-for="m in menu.children" :key="m.value">
                            <div @click="handleSelect(m.value,$event)">
                                {{ m.label }}
                            </div>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value"
                                  v-if="menu.id !== 2 && menu.id !==6">
                        <div @click="handleSelect(menu.value,$event)">
                            {{ menu.label }}
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="header-bar-right">
                <el-menu class="el-menu-demo" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-submenu index="userOper">
                        <template slot="title">{{ $root.loginUser.name }}</template>
                        <el-menu-item index="changePassword">修改密码</el-menu-item>
                        <el-menu-item index="logout">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>


        <div class="main_center" id="main_center">
            <component v-bind:menus="leftMenus" :type="$route.query.key" v-bind:is="currentComponent"
                       class="tab"></component>
        </div>

        <el-dialog title="修改密码"
                   :visible.sync="changePasswordDialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="passForm" :model="passForm" :rules="passForm.rules" label-width="80px">
                    <el-form-item label="新密码" prop="newPass">
                        <el-input type='password' v-model="passForm.newPass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPass">
                        <el-input type='password' v-model="passForm.confirmPass"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changePasswordDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import Menu from '../script/server/menu.js'
import Account from '../script/server/account.js'
import App from '../script/app.js'
import LeftMenuFrame from '../components/LeftMenuFrame.vue'
import md5 from 'js-md5';
import Env from "../script/server/env";

export default {
    created: function () {

    },
    data: function () {
        return {
            changePasswordDialog: false,
            passForm: {
                newPass: '',
                confirmPass: '',
                rules: {
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                    confirmPass: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                    ],
                }
            },
            menus: [],
            leftMenus: [],
            activeMenuIndex: 'my',
            currentComponent: 'leftMenuFrame'   //默认加载左边为菜单的组件
        }
    },
    mounted: function () {
        let comp = this;
        Menu.getMenu().then(res => {
            comp.menus = res.menus
            if (this.$route.query.key) {
                this.activeMenuIndex = this.$route.query.key
                comp.leftMenus = this.getMenu(this.$route.query.key).children
            } else {
                comp.leftMenus = comp.menus.filter(menu => menu.value === 'my')[0].children
            }
        })

        Account.getLoginUser().then(res => {
            this.$root.loginUser = res.user
        })

        this.$nextTick(() => {
            $('.small-menu-bar').on('click', function (e) {
                e.preventDefault();
                $('.small-menu')[0].style.webkitTransform = "translate(0px,0px)";
            })
        });

        window.onresize = () => {
            return (() => {
                App.vueG.$emit('windowResize', document.body.clientWidth)
            })();
        };
    },
    methods: {
        changePassword: function () {
            this.$refs['passForm'].validate((valid) => {
                if (valid) {
                    if (this.passForm.newPass !== this.passForm.confirmPass) {
                        this.$notify.error({
                            title: '错误',
                            message: '新密码与确认密码不一致'
                        });
                    } else {
                        Account.updatePassword({
                            password: md5(this.passForm.newPass)
                        }).then(() => {
                            this.changePasswordDialog = false
                            this.$message({
                                message: '密码已修改',
                                type: 'success'
                            });
                        })
                    }
                }
            })
        },
        signOut: function () {
            Account.logOut().then(() => {
                if (this.$root.loginUser.deptCode) {
                    window.location.href = "https://uaaap.yzu.edu.cn/cas/logout?service=http%3a%2f%2fgcsj.yzu.edu.cn/api/third-party/callback/";
                } else {
                    App.vueG.$router.push('/sign').catch(err => err);
                }
            }).finally(() => {
                this.$cookie.delete('apm_token');
                localStorage.removeItem("apm_token");
            })
        },
        handleSelect(key, event) {
            if (key === 'logout') {
                this.signOut()
            } else if (key === 'changePassword') {
                this.changePasswordDialog = true
                this.$nextTick(() => {
                    this.$refs.passForm.resetFields();
                })
            } else {
                //如果非左边菜单架构，替换当前组件
                //this.currentComponent = key
                //否则，替换组件数据
                //根据菜单决定取哪一种审计类型的菜单
                let routeUrl = this.$router.resolve({
                    path: "/index",
                    query: {key: key}
                });
                window.open(routeUrl.href, '_blank')
            }
            event.stopPropagation()
        },
        getMenu(key) {
            let menuList = []
            this.menus.forEach(menu => {
                menuList.push(menu)
            })
            while (menuList.length > 0) {
                let menu = menuList.pop()
                if (menu.value === key) {
                    return menu
                }
                if (menu.children) {
                    menu.children.forEach(m => {
                        menuList.push(m)
                    })
                }
            }
        }
    },
    components: {LeftMenuFrame},
}
</script>

<style scoped>

</style>
