/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Workitem from "../server/workitem"
import User from "../server/user";
import ConstructionUnit from "../server/constructionUnit"

export default {
    //获得待办
    getWillDo(data) {
        return Workitem.getWillDo(data)
    },
    //获取员工
    getEmps() {
        return User.getUsers({
            page: 1,
            pageSize: 99999999,
            thirdParty: false
        })
    },
    //获取施工单位
    getConstructionUnits() {
        return ConstructionUnit.getConstructionUnits({
            page: 1,
            pageSize: 999999,
        })
    },
    //获取中介机构
    getIntermediary() {
        return User.getUsers({
            page: 1,
            pageSize: 999999,
            thirdParty: true
        })
    },
}
