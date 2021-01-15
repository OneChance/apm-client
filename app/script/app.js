import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue'
import Pdf from '../components/file/Pdf'
import cookie from 'vue-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Print from '../plugin/print/print'
import Image from "../components/file/Image";

//使用路由插件
Vue.use(VueRouter);
//网络工具
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);
//ElementUI
Vue.use(ElementUI)
// 设置COOKIE工具
Vue.use(cookie)
//打印插件
Vue.use(Print)

//消除重复路由控制台错误提示
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default {
    vueG: null,
    init: function () {
        if (!this.router) {
            const routes = [
                {path: '/sign', component: Sign},
                {path: '/', component: Sign},
                {path: '/pdf', component: Pdf},
                {path: '/image', component: Image},
                {
                    path: '/index',
                    component: Index,
                },
            ];

            const router = new VueRouter({
                routes
            });

            this.vueG = new Vue({
                router,
                data: function () {
                    return {
                        loginUser: {},
                    }
                }
            });
        }
    }
}
