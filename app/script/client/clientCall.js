/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Workitem from "../server/workitem"

export default {
    //获得待办
    getWillDo(data) {
        return Workitem.getWillDo(data)
    },
}
