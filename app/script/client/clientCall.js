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
        data.type = 'INSIDE'
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
    upload(content, typeId, uploadList, failRefeshList) {

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

        }).catch(res => {
            //刷新下列表，避免列表显示上传失败的文件
            failRefeshList.filter(f => f.mId === res.info.typeId)[0].mFiles = failRefeshList.filter(f => f.mId === res.info.typeId)[0].mFiles.filter(() => true)
        })
    },
    removeFile(file, list) {
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
            if (!type.mFileIds) {
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
                list.push({
                    mRequired: fType.required,
                    mId: fType.material.id, //清单类型id
                    mName: fType.material.name,
                    mFiles: [], //上传的文件列表
                    mFileIds: '', //上传的文件id集合(用于服务端接收 是mFiles数组中文件id的集合)
                    mNote: '' //上传文件的备注
                })
            }
        })
    },
    //前后端阶段名转换
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
            default:
                return serverStage;
        }
    },
    materialFileTypes() {
        return MaterialFile.getMaterialTypes()
    }
}
