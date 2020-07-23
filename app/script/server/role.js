import Net from './net.js'

export default {
    getRoles: function () {
        //return Net.post('/signIn/', data);
        return [{
            id:1,
            name: '超级管理员',
            type: '管理员',
            status: '启用'
        }, {
            id:2,
            name: '教职工',
            type: '管理员',
            status: '禁用'
        }, {
            id:3,
            name: '辅导员',
            type: '管理员',
            status: '启用'
        }, {
            id:4,
            name: '部门主任',
            type: '管理员',
            status: '禁用'
        }]
    }
}
