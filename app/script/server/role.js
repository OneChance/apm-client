import Net from './net.js'

export default {
    getRoles: function () {
        //return Net.post('/signIn/', data);
        return [{
            name: '超级管理员',
            type: '管理员',
            status: '正常'
        }, {
            name: '教职工',
            type: '管理员',
            status: '正常'
        }, {
            name: '辅导员',
            type: '管理员',
            status: '正常'
        }, {
            name: '部门主任',
            type: '管理员',
            status: '正常'
        }]
    }
}
