<template>
    <div class="card-content">
        <el-card class="box-card">
            <bid-query ref="query" v-bind:tableConfigObject="tableConfig"
                       v-bind:stepCode="stepCode"></bid-query>
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
                            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
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
                    {prop: 'status', label: '审计状态', width: '150', fixed: true},
                    {prop: 'auditNo', label: '审计编号', width: '150', fixed: true},
                    {prop: 'projectName', label: '工程项目', width: '220', fixed: true},
                    {prop: 'itemCode', label: '立项代码', width: '150'},
                    {prop: 'contractNo', label: '合同编码', width: '150'},
                    {prop: 'constructionUnit', label: '施工单位', width: '220'},
                    {prop: 'contractMoney', label: '中标或合同金额', width: '220'},
                    {prop: 'assigned.name', label: '中介机构', width: '220'},
                    {prop: 'auditType', label: '审计方式', width: '100'},
                    {prop: 'submissionPrice', label: '送审金额', width: '150', sortable: true},
                    {prop: 'secondAuditPrice', label: '审定金额', width: '150', sortable: true},
                    {prop: 'auditFee', label: '惩罚性费用', width: '150'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
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
        editRow: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.dialogVisible = true
            this.from = 'editform'
            this.formId = row.id
        },
        fileList: function (row) {
            this.dialogVisible = false
            this.fileListVisible = false
            this.fileListVisible = true

            ClientCall.getSubmission({
                id: row.id
            }).then(result => {
                this.downFiles = []
                result.submission.details.forEach(fileType => this.addToFileList(fileType))
                result.submission.surveyFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.argueFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.auditFirstFiles.forEach(fileType => this.addToFileList(fileType))
                result.submission.auditSecondFiles.forEach(fileType => this.addToFileList(fileType))
            })
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