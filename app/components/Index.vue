<template id="index">
    <div>
        <el-row :gutter="24" class="header-bar">
            <el-col :span="4">
                <div class="logo fl">
                    <i class="fa fa-bars fa-lg small-menu-bar" aria-hidden="true"></i>
                    <span class="logo-title">
                        扬州大学审计系统
                    </span>
                </div>
            </el-col>
            <el-col :span="16" class="header-navi">
                <el-menu :default-active="activeIndex" class="el-menu-demo navi-menu" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value">
                        {{menu.label }}
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="4" class="header-bar-right">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-submenu :index="menu.index" v-for="menu in userOper" :key="menu.value">
                        <template slot="title">{{ menu.name }}</template>
                        <el-menu-item :index="m.index" v-for="m in menu.sub" :key="m.value">
                            {{m.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>

        <!-- 小屏幕菜单 -->
        <el-menu
                default-active="personal"
                class="el-menu-vertical-demo small-menu"
                text-color="#303133"
                active-text-color="#e1184a"
                @select="handleSelect">
            <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value">
                <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                <span slot="title">
                        {{menu.label}}
                </span>
            </el-menu-item>
        </el-menu>

        <div class="main_center" id="main_center">
            <transition name='router' mode="out-in">
                <router-view></router-view>
            </transition>
        </div>

    </div>
</template>

<script>
    require('../style/css/anim.scss');
    import Menu from '../script/server/menu.js'
    import Account from '../script/server/account.js'
    import App from '../script/app.js'

    export default {
        created: function () {

        },
        data: function () {
            return {
                img: require("../assets/images/header.jpg"),
                menus: [],
                activeIndex: '/index/my',
                userOper: [
                    {
                        index: 'userOper', name: '管理员', sub: [
                            {index: 'sign', name: '退出'},
                        ]
                    }
                ]
            }
        },
        mounted: function () {
            let comp = this;
            Menu.getMenu().then(res => {
                comp.menus = res.menus
            })

            Account.getLoginUser().then(res => {
                this.userOper[0].name = res.user.name
            })
            App.router.$router.push('/index/my/').catch(e => e);
            this.$nextTick(() => {
                $('.small-menu-bar').on('click', function (e) {
                    e.preventDefault();
                    $('.small-menu')[0].style.webkitTransform = "translate(0px,0px)";
                })
            });
        },
        methods: {
            signOut: function () {
                Account.signOut().then(() => {
                    //App.router.$router.push('sign');
                })
            },
            handleSelect(key, keyPath) {
                if (key === 'sign') {
                    console.log('退出')
                    window.location.href = App.loginPage
                } else {
                    $('.small-menu')[0].style.webkitTransform = "translate(-270px,0px)";
                    if (App.router.$route.fullPath.indexOf(key) === -1) {
                        App.toPage(key)
                    }
                }
            }
        },
        components: {},
    }
</script>

<style scoped>

</style>
