<template>
    <el-row :gutter="24">
        <el-col :span="4">
            <el-menu
                    id="left-menu"
                    :default-active="leftActiveIndex"
                    class="el-menu-vertical-demo my-menu"
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
                <component v-bind:is="currentComponent" class="tab"></component>
            </div>
        </el-col>
    </el-row>
</template>

<script>

    import Personal from '../components/Personal.vue'
    import SysCampOrg from '../components/SysCampOrg.vue'
    import SysRight from '../components/SysRight.vue'
    import SysRole from '../components/SysRole.vue'
    import AuditSubmission from '../components/AuditSubmission.vue'

    export default {
        name: "leftMenuFrame",
        data: function () {
            return {
                oneLevelMenu: [],
                MultiLevelMenu: [],
                leftActiveIndex: 'personal',
                isCollapse: false,
                currentComponent: 'personal'
            }
        },
        props: ['menus'],
        watch: {
            menus: function (newVal, oldVal) {
                this.oneLevelMenu = newVal.filter(menu => menu.children === null)
                this.MultiLevelMenu = newVal.filter(menu => menu.children !== null)
                this.leftActiveIndex = newVal[0].value
                this.currentComponent = newVal[0].value
            }
        },
        mounted: function () {
            let comp = this

            this.$nextTick(() => {
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
                console.log('验证权限' + key)
                this.currentComponent = key
            },
        },
        components: {
            Personal,
            SysCampOrg,
            SysRight,
            SysRole,
            AuditSubmission
        }
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