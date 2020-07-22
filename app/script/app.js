import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue'
import My from '../components/My.vue'
import SysCampOrg from '../components/SysCampOrg.vue'
import SysRight from '../components/SysRight.vue'
import Personal from '../components/Personal.vue'
import SysUser from '../components/SysUser.vue'
import SysRole from '../components/SysRole.vue'
//ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//使用路由插件
Vue.use(VueRouter);
Vue.use(ElementUI)

export default {
    loginPage: "http://localhost:8888",
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
                            path: 'sysCampOrg',
                            component: SysCampOrg
                        },
                        {
                            path: 'sysRight',
                            component: SysRight
                        },
                        {
                            path: 'SysUser',
                            component: SysUser
                        },
                        {
                            path: 'SysRole',
                            component: SysRole
                        }
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
    }
}
