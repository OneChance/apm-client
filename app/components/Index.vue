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
                <el-menu :default-active="activeMenuIndex" class="el-menu-demo navi-menu" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value" v-if="menu.id === 6">
                        {{ menu.label }}
                    </el-menu-item>
                    <el-submenu :index="menu.value" v-for="menu in menus" :key="menu.value" v-if="menu.id === 2">
                        <template slot="title">{{ menu.label }}</template>
                        <el-menu-item :index="m.value" v-for="m in menu.children" :key="m.value">
                            {{ m.label }}
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value"
                                  v-if="menu.id !== 2 && menu.id !==6">
                        {{ menu.label }}
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
                            {{ m.name }}
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
                        {{ menu.label }}
                </span>
            </el-menu-item>
        </el-menu>

        <div class="main_center" id="main_center">
            <component v-bind:menus="leftMenus" v-bind:is="currentComponent" class="tab"></component>
        </div>

    </div>
</template>

<script>

import Menu from '../script/server/menu.js'
import Account from '../script/server/account.js'
import App from '../script/app.js'
import LeftMenuFrame from '../components/LeftMenuFrame.vue'

export default {
    created: function () {

    },
    data: function () {
        return {
            menus: [],
            leftMenus: [],
            activeMenuIndex: 'my',
            userOper: [
                {
                    index: 'userOper', name: '', sub: [
                        {index: 'sign', name: '退出'},
                    ]
                }
            ],
            currentComponent: 'leftMenuFrame'   //默认加载左边为菜单的组件
        }
    },
    mounted: function () {

        let comp = this;
        Menu.getMenu().then(res => {
            comp.menus = res.menus
            comp.leftMenus = comp.menus.filter(menu => menu.value === 'my')[0].children
        })

        Account.getLoginUser().then(res => {
            this.userOper[0].name = res.user.name
            this.__proto__.__proto__.loginUser = res.user
        })

        this.$nextTick(() => {
            $('.small-menu-bar').on('click', function (e) {
                e.preventDefault();
                $('.small-menu')[0].style.webkitTransform = "translate(0px,0px)";
            })
        });

        window.onresize = () => {
            return (() => {
                App.hub.$emit('windowResize', document.body.clientWidth)
            })();
        };
    },
    methods: {
        signOut: function () {
            Account.logOut().then(() => {
                App.router.$router.push('/sign').catch(err => err);
            })
            this.$cookie.delete('apm_token');
            localStorage.removeItem("apm_token");
        },
        handleSelect(key) {
            if (key === 'sign') {
                this.signOut()
            } else {
                $('.small-menu')[0].style.webkitTransform = "translate(-270px,0px)";
                //如果非左边菜单架构，替换当前组件
                //this.currentComponent = key
                //否则，替换组件数据
                //根据菜单决定取哪一种审计类型的菜单
                this.leftMenus = this.getMenu(key).children
            }
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
