<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query" v-bind:tableConfigObject="tableConfig"
                       v-bind:stepCode="stepCode"
                       v-bind:needExport="true"></bid-query>
            <table-component v-bind:tableConfig="tableConfig">
            </table-component>
        </el-card>
        <bid-form v-bind:visible="dialogVisible"
                  v-bind:from="from"
                  v-bind:formRules="rules"
                  v-bind:formOpers="formOpers"
                  v-bind:step="'auditArc'"
                  v-bind:stepCode="9999"
                  v-bind:formId="formId">
        </bid-form>
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
import Env from "../../script/server/env"
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import Download from "../../script/server/download"
import BidForm from "./BidForm";
import BidQuery from "./BidQuery";
import ClientCall from "../../script/client/bid/clientCall";
import ClientCallCommon from "../../script/client/clientCall";
import ClientCallProject from "../../script/client/project/clientCall";
import Comment from "../../script/server/comment";

export default {
    name: "ListAllBid",
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
                    {prop: 'itemCode', label: '立项代码'},
                    {prop: 'assigned.thirdparty.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '80'},
                    {prop: 'submissionPrice', label: '送审金额', width: '80'},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '80'},
                ],
                steps: [
                    {label: '保存', step: '送审', index: 0},
                    {label: '退回', step: '送审', index: 0},
                    {label: '审计立项', step: '审计立项', index: 1},
                    {label: '审计分配', step: '审计分配', index: 2},
                    {label: '分配组员', step: '审计分配', index: 2},
                    {label: '分配审核', step: '分配审核', index: 3},
                    {label: '争议处理', step: '争议处理', index: 4},
                    {label: '争议处理(送审人)', step: '争议处理', index: 4},
                    {label: '争议处理(审计处)', step: '争议处理', index: 4},
                    {label: '初审', step: '初审', index: 5},
                    {label: '复审', step: '复审', index: 6},
                    {label: '征求意见', step: '征求意见', index: 7},
                    {label: '完成', step: '完成', index: 8},
                    {label: '归档', step: '归档', index: 9},
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
                    }
                ],
                operWidth: 100,
            },
            downFiles: [],
            filesToDownload: [],
        }
    },
    methods: {
        popShow: function (row, callback) {
            ClientCallCommon.getStepTimes('bid', row.id, callback)
        },
        editRow: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        fileList: function (row) {
            ClientCallCommon.checkRights(new Map([['show', ['bid_file', 'admin']]])).then(checkRes => {
                if (checkRes.get('show')) {
                    this.dialogVisible = false
                    this.fileListVisible = false
                    this.fileListVisible = true

                    ClientCall.getSubmission({
                        id: row.id
                    }).then(result => {
                        this.downFiles = []
                        result.bid.details.forEach(fileType => this.addToFileList(fileType))
                        result.bid.auditFirstFiles.forEach(fileType => this.addToFileList(fileType))
                        result.bid.auditSecondFiles.forEach(fileType => this.addToFileList(fileType))
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
                    url: Env.baseURL + file.url
                })
            })
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
                const promise = _this.getImgArrayBuffer(item.url).then(data => {
                    // 下载文件, 并存成ArrayBuffer对象(blob)
                    zip.file(item.type + "/" + item.name, data, {binary: true}); // 逐个添加文件
                });
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                zip.generateAsync({type: "blob"}).then(content => {
                    console.log(content)
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
    components: {TableComponent, BidForm, BidQuery}
}
</script>

<style scoped>

</style>