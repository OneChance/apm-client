<template>
    <div class="card-content">
        <el-card class="box-card">
            <submission-query ref="query" v-bind:tableConfigObject="tableConfig"
                              v-bind:stepCode="stepCode"
                              v-bind:needExport="true"></submission-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <submission-form v-bind:visible="dialogVisible"
                         v-bind:from="from"
                         v-bind:formRules="rules"
                         v-bind:formOpers="formOpers"
                         v-bind:step="'auditArc'"
                         v-bind:stepCode="9999"
                         v-bind:formId="formId">
        </submission-form>
        <el-dialog title="附件清单"
                   class="files-down"
                   :visible.sync="fileListVisible"
                   :close-on-click-modal="false">
            <template>
                <el-table
                    border
                    ref="multipleTable"
                    :data="downFiles"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="step"
                        label="阶段"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="附件类型">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="文件">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="preview(scope.row)">{{ scope.row.name }}</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fileListVisible = false">取 消</el-button>
                <el-button type="primary" @click="downloadFiles()">下载</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import TableComponent from "../TableComponent";
import SubmissionForm from "./SubmissionForm";
import ClientCallProject from "../../script/client/project/clientCall";
import ClientCallCommon from "../../script/client/clientCall"
import Env from "../../script/server/env"
import SubmissionQuery from "./SubmissionQuery";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import Download from "../../script/server/download"
import Config from "../../script/config"
import Comment from "../../script/server/comment";

export default {
    name: "ListAll",
    created: function () {

    },
    mounted() {

    },
    watch: {},
    data: function () {
        return {
            stepCode: 0,
            dialogVisible: false,
            fileListVisible: false,
            from: '',
            formId: -1,
            tableConfig: {
                data: [],
                page: true,
                total: 0,
                currentPage: 1,
                pageMethod: this.toPage,
                checkable: false,
                cols: [
                    {
                        prop: 'status',
                        label: '审计状态',
                        width: '120',
                        fixed: true,
                        popProgress: true,
                        popShow: this.popShow
                    },
                    {prop: 'auditNo', label: '审计编号', width: '100', fixed: true},
                    {prop: 'projectName', label: '工程项目', width: '220', fixed: true},
                    {prop: 'projectPlace', label: '项目地点', width: '100'},
                    {prop: 'contractNo', label: '合同编码'},
                    {prop: 'feeFrom', label: '经费来源', width: '80'},
                    {prop: 'itemCode', label: '经费代码', width: '80'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标/合同金额', width: '110'},
                    {prop: 'assigned.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '80'},
                    {prop: 'submissionPrice', label: '送审金额', width: '80'},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '80'},
                    {prop: 'auditFee', label: '惩罚性费用', width: '90'},
                ],
                steps: [ //待办名对应到步骤条步骤 label用于匹配待办名  submissionQuery组件中有对应的label列表
                    {label: '保存', step: '送审', index: 0},
                    {label: '退回', step: '送审', index: 0},
                    {label: '审计立项', step: '审计立项', index: 1},
                    {label: '审计分配', step: '审计分配', index: 2},
                    {label: '分配组员', step: '审计分配', index: 2},
                    {label: '分配审核', step: '分配审核', index: 3},
                    {label: '勘察准备', step: '勘察准备', index: 4},
                    {label: '现场勘察', step: '现场勘察', index: 5},
                    {label: '争议处理', step: '争议处理', index: 6},
                    {label: '处理争议(送审人)', step: '争议处理', index: 6},
                    {label: '争议处理(审计处)', step: '争议处理', index: 6},
                    {label: '初审', step: '初审', index: 7},
                    {label: '复审', step: '复审', index: 8},
                    {label: '完成', step: '完成', index: 9},
                    {label: '归档', step: '归档', index: 10},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.editRow,
                    },
                    {
                        class: 'fa fa-file-text-o  click-fa primary-fa',
                        tip: {content: '附件清单', placement: 'top'},
                        event: this.fileList,
                    },
                ],
                operWidth: 100,
            },
            downFiles: [],
            filesToDownload: [],
            mTypes: []
        }
    },
    methods: {
        popShow: function (row, callback) {
            ClientCallCommon.getStepTimes('submission', row.id, callback)
        },
        editRow: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        fileList: function (row) {
            ClientCallCommon.checkRights(new Map([['show', [37, 11]]])).then(checkRes => {
                if (checkRes.get('show')) {
                    this.dialogVisible = false
                    this.fileListVisible = false
                    this.fileListVisible = true
                    ClientCallCommon.materialFileTypes().then(result => {
                        this.mTypes = result.list
                        ClientCallProject.getSubmission({
                            id: row.id
                        }).then(result => {
                            this.downFiles = []
                            result.submission.details.forEach(fileType => this.addToFileList(fileType))
                            result.submission.surveyFiles.forEach(fileType => this.addToFileList(fileType))
                            result.submission.argueFiles.forEach(fileType => this.addToFileList(fileType))
                            result.submission.auditFirstFiles.forEach(fileType => this.addToFileList(fileType))
                            result.submission.auditSecondFiles.forEach(fileType => this.addToFileList(fileType))
                        })
                    })
                } else {
                    this.$notify({
                        title: '操作失败',
                        message: '您没有权限访问该功能',
                        duration: 3000
                    })
                }
            })
        },
        preview(file) {
            ClientCallCommon.filePreview(file, this)
        },
        addToFileList(fileType) {
            fileType.mFiles.forEach(file => {
                this.downFiles.push({
                    type: fileType.mName,
                    name: file.name,
                    url: Config.ATTACH_URL + Env.baseURL + file.url,
                    downloadUrl: Env.baseURL + file.url,
                    step: this.getStep(fileType.mName)
                })
            })
        },
        getStep(mName) {//根据附件类别名确定阶段名
            if (this.mTypes.map(t => t.name).includes(mName)) {
                return '送审'
            } else {
                switch (mName) {
                    case '勘察记录':
                    case '勘察照片':
                        return '现场勘察'
                    case '争议处理':
                        return '争议处理'
                    case '审定单(初)':
                    case '初审报告(初)':
                    case '审计工作底稿(初)':
                    case '计价文本(初)':
                        return '初审'
                    case '审定单(复)':
                    case '初审报告(复)':
                    case '审计工作底稿(复)':
                    case '计价文本(复)':
                        return '复审'
                    case '补充资料':
                        return '争议解决'
                    default:
                        return ''
                }
            }
        },
        handleSelectionChange(val) {
            this.filesToDownload = val;
        },
        downloadFiles: function () {
            this.filesToRar(this.filesToDownload, '文件')
        },
        filesToRar(files, filename) {
            let _this = this;
            let zip = new JSZip();
            let promises = [];

            for (let item of files) {
                const promise = _this.getImgArrayBuffer(item.downloadUrl).then(data => {
                    // 下载文件, 并存成ArrayBuffer对象(blob)
                    zip.file(item.type + "/" + item.name, data, {binary: true}); // 逐个添加文件
                });
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                zip.generateAsync({type: "blob"}).then(content => {
                    FileSaver.saveAs(content, filename); // 利用file-saver保存文件  自定义文件名
                });
            }).catch(() => {
                _this.$message.error('文件压缩失败');
            });
        },
        //获取文件blob
        getImgArrayBuffer(url) {
            return Download.download(url)
        },
        operSuccess() {
            this.dialogVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            //调用查询组件list方法
            this.$refs.query.list({page: 1})
        },
        toPage: function (val) {
            this.$refs.query.list({page: val})
        },
    },
    components: {TableComponent, SubmissionForm, SubmissionQuery}
}
</script>

<style scoped>

</style>