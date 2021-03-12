import ClientCallProject from "../project/clientCall";
import ClientCallBid from "../bid/clientCall";
import ProjectAuditProject from "../project/projectOper";
import ProjectAuditBid from "../bid/projectOper";
import AllocMemberProject from "../project/allocMember";
import AllocMemberBid from "../bid/allocMember";
import AllocApproveProject from "../project/allocApproveOper";
import AllocApproveBid from "../bid/allocApproveOper";
import RejectedOperProject from "../project/rejectedOper";
import RejectedOperBid from "../bid/rejectedOper";
import Argue from "../project/argue";
import ArgueBid from "../bid/argue";
import ArgueResolve from "../project/argueResolve";
import ArgueResolveBid from "../bid/argueResolve";
import ArgueCheck from "../project/argueCheck";
import ArgueCheckBid from "../bid/argueCheck";
import AuditFirstProject from "../project/auditFirst";
import AuditFirstBid from "../bid/auditFirst";
import AuditSecondProject from "../project/auditSecond";
import AuditSecondBid from "../bid/auditSecond";
import CompleteProject from "../project/completeOper";
import CompleteBid from "../bid/completeOper";
import ArcProject from "../project/arcOper";
import ArcBid from "../bid/arcOper";
import Config from "../../config";
import TakeAdvice from "../project/takeAdvice";
import TakeAdviceBid from "../bid/takeAdvice";
import SurveyPrepare from "../project/surveyPrepare.js"
import Survey from "../project/survey.js"

function projectCanNotBatchError() {
    scripts.comp.$notify.error({
        title: '操作失败!',
        message: '审计立项阶段需要填写审计编号,不可批量审核同意！',
        duration: 3000
    })
}

function showAllocForm() {
    for (let form in scripts.comp.forms) {
        scripts.comp.forms[form].visible = false
    }
    scripts.comp.forms.alloc.visible = true
}

const scripts = {
    comp: null,
    //不同类型的送审表调用各自的立项审计脚本
    batch: {
        project: {
            'submission': {0: ClientCallProject.batchAudit, 1: projectCanNotBatchError},
            'bid': {0: ClientCallBid.batchAudit, 1: projectCanNotBatchError}
        },
        distribution: {
            'submission': {0: ClientCallProject.batchAlloc, 1: showAllocForm},
            'bid': {0: ClientCallBid.batchAlloc, 1: showAllocForm},
        },
        check: {
            'submission': {0: ClientCallProject.batchAllocApprove, 1: ClientCallProject.batchAllocApprove},
        },
        complete: {
            'submission': {0: ClientCallProject.batchArc, 1: ClientCallProject.batchBackToAuditSecond},
            'bid': {0: ClientCallBid.batchArc, 1: ClientCallBid.batchBackToAuditSecond},
        },
        filed: {
            'submission': {0: ClientCallProject.batchBackToComplete, 1: ClientCallProject.batchBackToComplete},
            'bid': {0: ClientCallBid.batchBackToComplete, 1: ClientCallBid.batchBackToComplete},
        },
    },
    project: {'submission': ProjectAuditProject, 'bid': ProjectAuditBid},
    memberl: {'submission': AllocMemberProject, 'bid': AllocMemberBid},
    assigned: {'submission': AllocApproveProject, 'bid': AllocApproveBid},
    reject: {'submission': RejectedOperProject, 'bid': RejectedOperBid},
    surveyPrepare: {'submission': SurveyPrepare},
    survey: {'submission': Survey},
    argueHandle: {'submission': Argue, 'bid': ArgueBid},
    argueDeal: {'submission': ArgueResolve, 'bid': ArgueResolveBid},
    audit_dept: {'submission': ArgueCheck, 'bid': ArgueCheckBid},
    auditFirst: {'submission': AuditFirstProject, 'bid': AuditFirstBid},
    auditSecond: {'submission': AuditSecondProject, 'bid': AuditSecondBid},
    auditComplete: {'submission': CompleteProject, 'bid': CompleteBid},
    auditArc: {'submission': ArcProject, 'bid': ArcBid},
    stepCode: {'submission': Config.stepCode, 'bid': Config.stepCodeBid},
    takeAdvice: {'submission': TakeAdvice, 'bid': TakeAdviceBid}
}

export default {
    scripts
}