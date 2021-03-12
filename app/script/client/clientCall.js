/*客户端调用方法,封装服务端调用,包含待办和业务列表都会调用的提交方法*/

import Workitem from "../server/workitem"
import User from "../server/user";
import ConstructionUnit from "../server/constructionUnit"
import Upload from "../server/upload";
import App from "../app"
import MaterialFile from "../server/materialFile";
import Intermediary from "../server/intermediary"
import Config from "../config"
import Common from "../common";
import Account from "../server/account";
import Env from "../server/env";

export default {
    getWorkitems(data, type) {
        if (type === 'done') {
            return Workitem.getDone(data)
        } else if (type === 'willDo') {
            return Workitem.getWillDo(data)
        } else if (type === 'my') {
            return Workitem.getMyWork(data)
        } else if (type === 'create') {
            return Workitem.getMyCreate(data)
        }
    },
    //获取员工
    getEmps() {
        let data = Common.copyObject(Config.pageAll)
        data.types = ['INSIDE']
        return User.getUsers(data)
    },
    //获取施工单位
    getConstructionUnits() {
        return ConstructionUnit.getConstructionUnits(Config.pageAll)
    },
    //获取中介机构
    getIntermediary() {
        return Intermediary.gets(Config.pageAll)
    },
    getIntermediaryUsers(data) {
        return User.getIntermediaryUsers(data)
    },
    upload(content, typeId, uploadList, failRefeshList, listType) {

        let fd = new FormData()

        const CancelToken = App.vueG.axios.CancelToken;
        content.file.source = CancelToken.source();

        fd.append('formFile', content.file)

        Upload.upload({file: fd, info: {typeId: typeId}}, (event) => {
            let num = event.loaded / event.total * 100 | 0;
            num = Math.min(num, 99.9)
            content.onProgress({
                percent: num
            })
        }).then(res => {

            content.onSuccess()

            let fileData = {
                'id': res.id,
                'uid': content.file.uid,
                'name': content.file.name,
            }

            let type = uploadList.filter(t => t.mId === res.info.typeId)[0]
            if (type) {
                type.mFiles.push(fileData)
            } else {
                type = {
                    mId: res.info.typeId,
                    mFiles: []
                }
                type.mFiles.push(fileData)
                uploadList.push(type)
            }
            if (listType === 'submission') {
                //先将文件放入上传列表,用于显示数量
                failRefeshList.filter(f => f.mId === typeId)[0].mFiles.push(fileData)
            }
        }).catch(res => {
            //刷新列表，避免列表显示上传失败的文件
            failRefeshList.filter(f => f.mId === res.info.typeId)[0].mFiles = failRefeshList.filter(f => f.mId === res.info.typeId)[0].mFiles.filter(() => true)
        })
    },
    removeFile(file, list, showList) {
        if (file.status === 'uploading') {
            if (file.raw.source) {
                file.raw.source.cancel('cancel-upload')
            }
        }
        for (let types of list) {
            let size = types.mFiles.length
            if (size !== 0) {
                types.mFiles = types.mFiles.filter(f => f.uid !== file.uid)
                if (types.mFiles.length < size) {
                    break
                }
            }
        }
        if (showList && showList.length > 0) {
            for (let types of showList) {
                let size = types.mFiles.length
                if (size !== 0) {
                    types.mFiles = types.mFiles.filter(f => f.uid !== file.uid)
                    if (types.mFiles.length < size) {
                        break
                    }
                }
            }
        }
    },
    removeableConfirm(file, steps, message, currentStep) {
        if (steps.indexOf(currentStep) < 0) {
            App.vueG.$notify.error({
                title: '操作失败!',
                message: message,
                duration: 2000
            })
            return false;
        }
        return App.vueG.$confirm(`确定移除 ${file.name}？`)
    },
    fileListCheck(list) {
        let fileOk = true
        for (let type of list) {
            if (!type.mFileIds && !type.nullable) {
                setTimeout(function () {
                    App.vueG.$notify.error({
                        title: '提交失败!',
                        message: type.mName + '必须上传附件！',
                        duration: 5000
                    })
                }, 100);
                fileOk = false
            }
        }
        return fileOk
    },
    setFiles: function (uploadList, list) {
        //初始化uploadFiles
        if (list && list.length > 0) {
            list.forEach(type => {
                if (type.mFiles && type.mFiles.length > 0) {
                    let mFiles = []
                    type.mFiles.forEach(file => {
                        mFiles.push(file)
                    })
                    uploadList.push({
                        mId: type.mId,
                        mFiles: mFiles
                    })
                }
            })
        }
    },
    checkFileOrNote: function (list) {
        let fileOk = true
        for (let type of list) {
            if (type.mRequired) {
                if ((!type.mFileIds) && (!type.mNote || type.mNote.match(/^[ ]*$/))) {
                    setTimeout(function () {
                        App.vueG.$notify.error({
                            title: '提交失败!',
                            message: type.mName + '必须上传附件或填写备注！',
                            duration: 5000
                        })
                    }, 100);
                    fileOk = false
                }
            }
        }
        return fileOk
    },
    fileIdsConstruct(uploadList, list) {
        for (let types of list) {
            let ids = ''
            let type = uploadList.filter(t => t.mId === types.mId)[0]
            if (type) {
                for (let file of type.mFiles) {
                    ids = ids + ',' + file.id
                }
                types.mFileIds = ids.substr(1)
            }
        }
    },
    materialGroupChange: function (value, list) {
        //根据选择的清单组，初始化附加列表
        MaterialFile.getMaterialGroup({
            id: value
        }).then(res => {
            list.length = 0
            for (let fType of res.materialGroup.details) {
                if (!fType.material.del) {
                    list.push({
                        mRequired: fType.required,
                        mId: fType.material.id, //清单类型id
                        mName: fType.material.name,
                        mFiles: [], //上传的文件列表
                        mFileIds: '', //上传的文件id集合(用于服务端接收 是mFiles数组中文件id的集合)
                        mNote: '',
                        description: fType.material.description
                    })
                }
            }
        })
    },
    //后端待办名称转换前端阶段名
    stepNameConvert(serverStage) {
        switch (serverStage) {
            case 'distribution':
                return 'alloced';
            case 'check':
                return 'assigned';
            case 'survey_prepare':
                return 'surveyPrepare';
            case 'survey_scene':
                return 'survey';
            case 'argue':
                return 'argueHandle';
            case 'argue_reject':
                return 'argueDeal';
            case 'audit_first':
                return 'auditFirst';
            case 'audit_second':
                return 'auditSecond';
            case 'complete':
                return 'auditComplete';
            case 'filed':
                return 'auditArc';
            case 'take_advice':
                return 'takeAdvice';
            default:
                return serverStage;
        }
    },
    materialFileTypes() {
        return MaterialFile.getMaterialTypes()
    },
    checkRights(needRolesMap) {
        return Account.getLoginUser().then(res => {
            let checkRes = new Map()
            for (let key of needRolesMap.keys()) {
                checkRes.set(key, false)
            }
            if (res.user.roles) {
                for (let key of checkRes.keys()) {
                    let needRoles = needRolesMap.get(key)
                    for (let i = 0; i < needRoles.length; i++) {
                        if (res.user.roles.map(role => role.rkey).includes(needRoles[i])) {
                            checkRes.set(key, true)
                            break;
                        }
                    }
                }
            }
            return checkRes
        })
    },
    stepNameTransfer: function (name) {
        switch (name) {
            case 'project':
                return '审计立项'
            case 'distribution':
            case 'memberl':
                return '审计分配'
            case 'check':
                return '分配审核'
            case 'survey_prepare':
                return '勘察准备'
            case 'survey_scene':
                return '现场勘察'
            case 'argue_reject':
            case 'argue':
            case 'audit_dept':
                return '争议处理'
            case 'audit_first':
                return '初审'
            case 'audit_second':
                return '复审'
            case 'take_advice':
                return '征求意见'
            case 'complete':
                return '完成'
            case 'filed':
                return '归档'
            case '[start]':
                return '送审'
            default:
                return name
        }
    },
    stepCodeTransfer(stepCode) {
        if (stepCode === -30) {

        }
        return stepCode
    },
    //获取步骤条时间
    getStepTimes(type, id, callback) {
        Workitem.getWorkitemReach({
            target: type,
            targetId: id
        }).then(res => {
                let validSteps = []
                let itemList = res.list.reverse() //倒序排,第一条为最新待办
                for (let i = 0; i < itemList.length; i++) {
                    validSteps.push({step: this.stepNameTransfer(itemList[i][2]), time: itemList[i][4]})
                    if (itemList[i][3] === 0) {
                        break;
                    }
                }
                let stepTimesMerge = new Map()
                //合并阶段中取最早到达时间(比如争议处理分争议处理,审计处审核,送审人处理争议三个阶段,此时取争议处理到达时间)
                validSteps.reverse().forEach(step => {
                    if (!stepTimesMerge.get(step.step)) {
                        stepTimesMerge.set(step.step, step.time)
                    }
                })
                callback(stepTimesMerge)
            }
        )
    },
    filePreview(file, vueObj) {
        let url = file.downloadUrl ? file.downloadUrl : Env.baseURL + file.url
        vueObj.$confirm('您想要...', '文件操作', {
            confirmButtonText: '下载',
            cancelButtonText: '预览',
            closeOnClickModal: false,
            distinguishCancelAndClose: true
        })
            .then(_ => {
                window.open(url)
            })
            .catch(action => {
                if (action === 'cancel') {
                    let officeFile = /.*\.(?:xlsx|xls|doc|docx|ppt)$/i;
                    let pdfFile = /.*\.(?:pdf)$/i;
                    let imageFile = /.*\.(?:jpg|jpeg|png)$/i;
                    if (officeFile.test(file.name)) {
                        window.open(Config.ATTACH_URL + url)
                    } else if (pdfFile.test(file.name)) {
                        let routeUrl = vueObj.$router.resolve({
                            path: "/pdf",
                            query: {url: url}
                        });
                        window.open(routeUrl.href, '_blank');
                    } else if (imageFile.test(file.name)) {
                        let routeUrl = vueObj.$router.resolve({
                            path: "/image",
                            query: {url: url}
                        });
                        window.open(routeUrl.href, '_blank');
                    } else {
                        vueObj.$notify.error({
                            title: '操作失败!',
                            message: '该文件类型不支持在线预览!',
                            duration: 2000
                        })
                    }
                }
            });
    },
    clearForm(form) {
        for (let p in form) {
            if (form[p] instanceof Array) {
                form[p].length = 0
            } else if (typeof form[p] === 'string') {
                form[p] = ''
            }
        }
    },
    exportData(expFuc, expOptions, fileName) {
        expFuc(expOptions).then(result => {
            let url = window.URL.createObjectURL(new Blob([result]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xls')
            document.body.appendChild(link)
            link.click()
        })
    }
}
