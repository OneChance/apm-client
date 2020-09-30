import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue'
import cookie from 'vue-cookie'

//设置COOKIE工具
Vue.prototype.$cookie = cookie;
Vue.prototype.loginUser = {}

//局部打印插件
import printArea from '../plugin/printarea/jquery.PrintArea'

//ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//使用路由插件
Vue.use(VueRouter);
Vue.use(ElementUI)

export default {
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
