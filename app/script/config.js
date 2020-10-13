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
        argueDeal: -30,//争议处理中
        reject: -20,
        submissionSave: -10, //送审保存
        project: 10, //审计立项
        alloced: 20, //分配
        assigned: 30, //分配审核
        surveyPrepare: 40, //勘察准
        survey: 50, //现场勘察
        argueHandle: 60, //争议处理
        auditFirst: 70, //初审阶段
        auditSecond: 80, //复审阶段
        auditComplete: 90, //完成阶段
        auditArc: 100, //归档阶段
    },
    stepCodeBid: {
        reject: -20,
        save: -10, //送审保存
        project: 10, //当前处于审计立项阶段
        alloced: 20, //分配
        assigned: 30, //分配审核
        auditFirst: 40, //初审阶段
        auditSecond: 50, //复审阶段
        auditComplete: 60, //完成阶段
        auditArc: 70, //归档阶段
    }
}
