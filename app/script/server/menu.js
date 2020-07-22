import Net from './net.js'

export default {
    getIndexMenu: function () {
        //return Net.post('/signIn/', data);
        return [
            {index: 'my', name: '我的'},
            {
                index: 'audit', name: '审计管理', sub: [
                    {index: 'auditFirst', name: '初审'},
                    {index: 'auditSecond', name: '复审'},
                    {index: 'auditComplete', name: '完成'},
                    {index: 'auditArc', name: '归档'}
                ]
            },
            {
                index: 'sys', name: '系统设置', sub: [
                    {index: 'sysCampOrg', name: '学校组织机构'},
                    {index: 'sysCompOrg', name: '中介机构信息'},
                    {index: 'sysProjectOrg', name: '施工单位信息'},
                    {index: 'sysUser', name: '用户'},
                    {index: 'sysRole', name: '角色'},
                    {index: 'sysRight', name: '权限'},
                    {index: 'sysMenu', name: '菜单'},
                    {index: 'sysMould', name: '电子文档模板'}
                ]
            }
        ]
    },
    getMyMenu: function () {
        return [
            {index: 'personal', name: '个人中心', icon: 'fa-user-o'},
            {
                index: 'mymsg', name: '我的消息', icon: 'fa-commenting-o', sub: [
                    {index: 'inbox', name: '收件箱', icon: 'fa-share'},
                    {index: 'outbox', name: '发件箱', icon: 'fa fa-reply'},
                    {index: 'draft', name: '草稿箱', icon: 'fa-envelope-o'}
                ]
            },
            {
                index: 'mywork', name: '我的事项', icon: 'fa-briefcase', sub: [
                    {index: 'willdo', name: '待办', icon: 'fa-pencil-square-o'},
                    {index: 'done', name: '已办', icon: 'fa-pencil-square-o'},
                    {index: 'started', name: '已发起', icon: 'fa-pencil-square-o'},
                    {index: 'mission', name: '任务单', icon: 'fa-list-alt'},
                    {index: 'tobealloc', name: '待分配', icon: 'fa-list-alt'},
                ]
            },
            {
                index: 'mystatistic', name: '我的统计', icon: 'fa-bar-chart', sub: [
                    {index: 'completed', name: '已完成项目汇总', icon: 'fa-line-chart'},
                ]
            },
        ]
    }
}
