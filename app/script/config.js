export default {
    size: {
        leftMenuCollapseWidth: 980,
        pageNavSmallSize: 620,
    },
    page: {
        page: 1,
        pageSize: 10
    },
    stepCode: {
        submissionSave: -10, //送审保存
        submissionCommit: 10,//送审提交  待审计立项
        auditProject: 20, //审计立项通过   待分配
        alloced: 30, //分配完成  待审核
        allocApproved: 40, //分配审核完成  待填写勘察准备信息
        viewPrepared: 40, //勘察准备信息填写完成 待上传现场勘察资料
        auditFirst: 40, //初审阶段
    }
}
