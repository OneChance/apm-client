<template>
    <el-row :gutter="24">
        <el-col :span="4">
            <el-menu
                    id="left-menu"
                    default-active="personal"
                    class="el-menu-vertical-demo my-menu"
                    text-color="#303133"
                    active-text-color="#e1184a"
                    @select="handleSelect"
                    :collapse="isCollapse">
                <el-menu-item :index="menu.index" v-for="menu in oneLevelMenu" :key="menu.index">
                    <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                    <span slot="title">
                        {{menu.name}}
                    </span>
                </el-menu-item>
                <el-submenu :index="menu.index" v-for="menu in MultiLevelMenu" :key="menu.index">
                    <template slot="title">
                        <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                        <span slot="title">
                            {{ menu.name }}
                        </span>
                    </template>
                    <el-menu-item :index="m.index" v-for="m in menu.sub" :key="m.index">
                        <template slot="title">
                            <i :class="'fa '+m.icon+' fa-lg fa-inverse'"></i>
                            <span slot="title">
                                {{m.name}}
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
        name: "My",
        data: function () {
            return {
                menus: [],
                oneLevelMenu: [],
                MultiLevelMenu: [],
                isCollapse: false
            }
        },
        mounted: function () {
            let comp = this
            this.menus = Menu.getMyMenu()
            this.oneLevelMenu = this.menus.filter(menu => menu.sub === undefined)
            this.MultiLevelMenu = this.menus.filter(menu => menu.sub !== undefined)
            this.$nextTick(() => {
                $(".my-menu").find("li").eq(0).click()
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
                App.router.$router.push('/index/my/' + key).catch(e => e)
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