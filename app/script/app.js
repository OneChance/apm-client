import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue'
import cookie from 'vue-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Global from "./global"
//局部打印
import printArea from '../plugin/printarea/jquery.PrintArea'
//使用路由插件
Vue.use(VueRouter);
//网络工具
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);
//ElementUI
Vue.use(ElementUI)
// 设置COOKIE工具
Vue.use(cookie)
//自定义全局变量
Vue.prototype.global = Global;

export default {
    vueG: null,
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

            this.vueG = new Vue({
                router
            });
        }
    }
}
