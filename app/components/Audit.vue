<template>
    <el-row :gutter="24">
        <el-col :span="4">
            <el-menu
                    id="left-menu"
                    default-active="/index/audit/submission"
                    class="el-menu-vertical-demo left-menu"
                    text-color="#303133"
                    active-text-color="#e1184a"
                    @select="handleSelect"
                    :collapse="isCollapse">
                <el-menu-item :index="menu.value" v-for="menu in oneLevelMenu" :key="menu.value">
                    <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                    <span slot="title">
                        {{menu.label}}
                    </span>
                </el-menu-item>
                <el-submenu :index="menu.value" v-for="menu in MultiLevelMenu" :key="menu.value">
                    <template slot="title">
                        <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                        <span slot="title">
                            {{ menu.label }}
                        </span>
                    </template>
                    <el-menu-item :index="m.value" v-for="m in menu.children" :key="m.value">
                        <template slot="title">
                            <i :class="'fa '+m.icon+' fa-lg fa-inverse'"></i>
                            <span slot="title">
                                {{m.label}}
                            </span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>

        </el-col>
        <el-col :span="20">
            <div class="main_right" id="main_right">
                <router-view></router-view>
            </div>
        </el-col>
    </el-row>
</template>

<script>

    import App from '../script/app.js'
    import Menu from '../script/server/menu.js'

    export default {
        name: "Audit",
        data: function () {
            return {
                menus: [],
                oneLevelMenu: [],
                MultiLevelMenu: [],
                isCollapse: false
            }
        },
        created() {
            /*if (App.currentPage) {
                App.toPage(App.currentPage)
            }*/
        },
        mounted: function () {
            let comp = this
            Menu.getMenu().then(res => {
                comp.menus = res.menus.filter(menu => menu.value === '/index/audit')[0].children
                this.oneLevelMenu = comp.menus.filter(menu => menu.children === null)
                this.MultiLevelMenu = comp.menus.filter(menu => menu.children !== null)
            })
            this.$nextTick(() => {
                App.toPage('/index/audit/submission')
                comp.isCollapse = document.body.clientWidth <= 480
            });
            window.onresize = () => {
                return (() => {
                    comp.isCollapse = document.body.clientWidth <= 480
                })();
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                App.toPage(key)
            }
        },
        components: {}
    }
</script>

<style scoped>

    .el-menu-vertical-demo {
        min-height: 900px;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
    }
</style>