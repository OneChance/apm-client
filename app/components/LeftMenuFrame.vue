<template>
    <el-container>
        <el-aside>
            <el-menu
                id="left-menu"
                :active-index="leftActiveIndex"
                :default-active="leftActiveIndex"
                :class="'my-menu '+widthClass"
                text-color="#303133"
                active-text-color="#e1184a"
                @select="handleSelect"
                :collapse="isCollapse">
                <el-menu-item :index="menu.value" v-for="menu in oneLevelMenu" :key="menu.value">
                    <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                    <span slot="title">
                        {{ menu.label }}
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
                            <span slot="title" v-if="m.value!=='willDo'">
                                {{ m.label }}
                            </span>
                            <el-badge :value="willDoCount" class="item" v-if="m.value==='willDo'">
                                {{ m.label }}
                            </el-badge>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="collapse" class="click-cover">
                    <div @click="collapse($event)">
                        <i class="fa fa-bars fa-lg fa-inverse"></i>
                        <span slot="title">
                        菜单缩放
                    </span>
                    </div>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <div class="main_right" id="main_right">
                <component v-bind:is="currentComponent" class="tab">

                </component>
            </div>
        </el-main>
    </el-container>
</template>

<script>

import WorkitemDashboard from '../components/WorkitemDashboard.vue'
import SysCampOrg from '../components/SysCampOrg.vue'
import SysRight from '../components/SysRight.vue'
import SysRole from '../components/SysRole.vue'
import SysRoleGroup from "../components/SysRoleGroup.vue";
import SysMenu from '../components/SysMenu.vue'
import SysMaterialFile from '../components/SysMaterialFile.vue'
import SysMaterialFileGroup from '../components/SysMaterialFileGroup.vue'
import AuditSubmission from './project/AuditSubmission.vue'
import AuditProject from "./project/AuditProject";
import SysUser from "./SysUser";
import SysIntermediary from "./SysIntermediary";
import MissionAlloc from "./project/MissionAlloc";
import WillDo from "./WillDo";
import Done from "./Done";
import MyWork from "./MyWork";
import MyCreate from "./MyCreate";
import SurveyPrepare from "./project/SurveyPrepare"
import Survey from "./project/Survey"
import AuditComplete from "./project/AuditComplete";
import AuditFirst from "./project/AuditFirst";
import AuditSecond from "./project/AuditSecond";
import AuditArc from "./project/AuditArc";
import ArgueHandle from "./project/ArgueHandle";
import SysConstructionUnit from "./SysConstructionUnit";
import ListAll from "./project/ListAll";
import ClientCall from "../script/client/clientCall";
/**bid**/
import ListAllBid from "./bid/ListAllBid";
import AuditSubmissionBid from './bid/AuditSubmissionBid.vue'
import AuditProjectBid from "./bid/AuditProjectBid";
import MissionAllocBid from "./bid/MissionAllocBid";
import AuditCompleteBid from "./bid/AuditCompleteBid";
import AuditFirstBid from "./bid/AuditFirstBid";
import AuditSecondBid from "./bid/AuditSecondBid";
import AuditArcBid from "./bid/AuditArcBid";
import Config from "../script/config"

export default {
    name: "leftMenuFrame",
    data: function () {
        return {
            oneLevelMenu: [],
            MultiLevelMenu: [],
            leftActiveIndex: '',
            isCollapse: true,
            currentComponent: '',
            willDoCount: 0,
            widthClass: 'el-menu-vertical-demo'
        }
    },
    props: ['menus', 'type'],
    watch: {
        menus: function (newVal) {
            this.oneLevelMenu = newVal.filter(menu => menu.children === null)
            this.MultiLevelMenu = newVal.filter(menu => menu.children !== null)

            if (!this.type || this.type === 'my') {//我的事项菜单
                this.leftActiveIndex = 'workitemDashboard'
                this.currentComponent = 'workitemDashboard'
                ClientCall.getWorkitems(Config.pageAll, 'willDo').then(res => {
                    this.willDoCount = res.list.totalElements
                })
            } else {
                this.leftActiveIndex = newVal[0].value
                this.currentComponent = newVal[0].value
                this.widthClass = ''
            }
        }
    },
    mounted: function () {
        this.$root.$on('routeTo', (url) => {
            this.currentComponent = url
        })
    },
    methods: {
        collapse(event) {
            this.isCollapse = !this.isCollapse
            event.stopPropagation()
        },
        handleSelect(key) {
            if (key !== 'collapse') {
                this.currentComponent = key
            }
        },
        menuCollapse(size) {

        }
    },
    components: {
        WorkitemDashboard,
        SysCampOrg,
        SysRight,
        SysRole,
        SysRoleGroup,
        AuditSubmission,
        AuditProject,
        MissionAlloc,
        SysMenu,
        SysMaterialFile,
        SysMaterialFileGroup,
        SysUser,
        SysIntermediary,
        WillDo,
        Done,
        MyWork,
        MyCreate,
        SurveyPrepare,
        Survey,
        AuditComplete,
        AuditFirst,
        AuditSecond,
        AuditArc,
        ArgueHandle,
        SysConstructionUnit,
        ListAll,
        /**********************************************/
        ListAllBid,
        AuditSubmissionBid,
        AuditProjectBid,
        MissionAllocBid,
        AuditCompleteBid,
        AuditFirstBid,
        AuditSecondBid,
        AuditArcBid,
    }
}
</script>

<style scoped>

</style>