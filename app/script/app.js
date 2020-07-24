import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue'
import My from '../components/My.vue'
import Personal from '../components/Personal.vue'

import Audit from '../components/Audit.vue'
import AuditSubmission from "../components/AuditSubmission";
import AuditProject from "../components/AuditProject";

import Sys from '../components/Sys.vue'
import SysCampOrg from '../components/SysCampOrg.vue'
import SysRight from '../components/SysRight.vue'
import SysUser from '../components/SysUser.vue'
import SysRole from '../components/SysRole.vue'
import SysMenu from '../components/SysMenu.vue'

//ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//使用路由插件
Vue.use(VueRouter);
Vue.use(ElementUI)

export default {
    loginPage: "http://localhost:8888",
    currentPage:"/index/my/personal",
    router: null,
    hub: null,
    init: function () {
        if (!this.router) {
            const routes = [
                {path: '/sign', component: Sign},
                {path: '/', component: Sign},
                {
                    path: '/index',
                    component: Index,
                    children: [
                        {
                            path: 'my',
                            component: My,
                            children: [
                                {
                                    path: 'personal',
                                    component: Personal
                                }
                            ]
                        },
                        {
                            path: 'audit',
                            component: Audit,
                            children: [
                                {
                                    path: 'submission',
                                    component: AuditSubmission
                                }, {
                                    path: 'auditProject',
                                    component: AuditProject
                                }
                            ]
                        },
                        {
                            path: 'sys',
                            component: Sys,
                            children: [
                                {
                                    path: 'sysCampOrg',
                                    component: SysCampOrg
                                },
                                {
                                    path: 'sysRight',
                                    component: SysRight
                                },
                                {
                                    path: 'sysUser',
                                    component: SysUser
                                },
                                {
                                    path: 'sysRole',
                                    component: SysRole
                                },
                                {
                                    path: 'sysMenu',
                                    component: SysMenu
                                }
                            ]
                        },
                    ]
                },
            ];

            const router = new VueRouter({
                routes
            });

            this.router = new Vue({
                router
            });

            this.hub = new Vue();
        }
    },
    toPage: function (path) {
        console.log('验证权限')
        this.router.$router.push(path).catch(e => e)
    }
}
