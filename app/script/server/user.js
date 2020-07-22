import Net from './net.js'

export default {
    getUsers: function () {
        //return Net.post('/signIn/', data);
        let users = []
        let userData = [{
            empcode: '0001',
            name: '张三',
            org: '绿化科'
        }, {
            empcode: '0002',
            name: '李四',
            org: '水电科'
        }, {
            empcode: '0003',
            name: '王五',
            org: '用户服务科'
        }, {
            empcode: '0004',
            name: '赵六',
            org: '规划科'
        }]
        for (let user of userData) {
            users.push(user.empcode + '-' + user.name + '-' + user.org)
        }
        return users
    }
}
