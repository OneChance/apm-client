<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="projectName" placeholder="工程项目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <i class="fa fa-plus-circle fa-2x right-fa primary-fa" aria-hidden="true"
                   @click="add"></i>
            </el-form>

            <table-component v-bind:tableConfig="tableConfig"></table-component>

        </el-card>

        <el-dialog :title="工程结算送审表"
                   class="form-dialog"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <template>
                <div class="form">
                    <el-form :model="submissionForm" :rules="rules" ref="submissionForm">
                        <table class="form-table">
                            <tr>
                                <th colspan="4">
                                    扬州大学工程结算送审表
                                </th>
                            </tr>
                            <tr>
                                <th>立项代码</th>
                                <td>
                                    <el-form-item prop="itemCode">
                                        <el-input v-model="submissionForm.itemCode"></el-input>
                                    </el-form-item>
                                </td>
                                <th>审计编号</th>
                                <td>
                                    <el-form-item prop="auditNo">
                                        <el-input v-model="submissionForm.auditNo"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>合同编码</th>
                                <td>
                                    <el-form-item prop="contractNo">
                                        <el-input v-model="submissionForm.contractNo"></el-input>
                                    </el-form-item>
                                </td>
                                <th>工程项目名称<span style="color: red; ">*</span></th>
                                <td>
                                    <el-form-item prop="projectName">
                                        <el-input v-model="submissionForm.projectName"
                                                  placeholder="填写工程项目名称"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>经费来源</th>
                                <td>
                                    <el-form-item prop="feeFrom">
                                        <el-input v-model="submissionForm.feeFrom" placeholder="填写经费来源"></el-input>
                                    </el-form-item>
                                </td>
                                <th>预算(万元)</th>
                                <td>
                                    <el-form-item prop="budget">
                                        <el-input v-model.number="submissionForm.budget" placeholder="填写预算"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>施工单位名称<span style="color: red; ">*</span></th>
                                <td colspan="3">
                                    <el-form-item prop="constructionUnit">
                                        <el-input v-model="submissionForm.constructionUnit"
                                                  placeholder="填写施工单位名称"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>开工时间<span style="color: red; ">*</span></th>
                                <td>
                                    <el-form-item prop="startDate">
                                        <el-date-picker
                                                v-model="submissionForm.startDate"
                                                format="yyyy-MM-dd"
                                                value-format="yyyy-MM-dd"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </td>
                                <th>竣工时间<span style="color: red; ">*</span></th>
                                <td>
                                    <el-form-item prop="endDate">
                                        <el-date-picker
                                                v-model="submissionForm.endDate"
                                                format="yyyy-MM-dd"
                                                value-format="yyyy-MM-dd"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>中标合同金额</th>
                                <td colspan="3">
                                    <el-form-item prop="contractMoney">
                                        <el-input v-model.number="submissionForm.contractMoney"
                                                  placeholder="填写中标合同金额"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>土建</th>
                                <td>
                                    <el-form-item prop="constructMoney">
                                        <el-input v-model="submissionForm.constructMoney"
                                                  placeholder="填写土建金额"></el-input>
                                    </el-form-item>
                                </td>
                                <th>安装</th>
                                <td>
                                    <el-form-item prop="installMoney">
                                        <el-input v-model="submissionForm.installMoney" placeholder="填写安装金额"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="compact-td">
                                    <table class="form-table">
                                        <tr>
                                            <th style="width:15%">报审单位</th>
                                            <th>报审金额（元）</th>
                                            <th>核减金额（元）</th>
                                            <th>联系电话</th>
                                        </tr>
                                        <tr>
                                            <th>施工单位</th>
                                            <td>
                                                <el-form-item prop="constructionUnitApplyFee">
                                                    <el-input v-model="submissionForm.constructionUnitApplyFee"
                                                              placeholder="填写施工单位报审金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="constructionUnitCheckFee">
                                                    <el-input v-model="submissionForm.constructionUnitCheckFee"
                                                              placeholder="填写施工单位核减金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="constructionUnitTel">
                                                    <el-input v-model="submissionForm.constructionUnitTel"
                                                              placeholder="施工单位联系电话"></el-input>
                                                </el-form-item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>监理单位</th>
                                            <td>
                                                <el-form-item prop="inspectUnitApplyFee">
                                                    <el-input v-model="submissionForm.inspectUnitApplyFee"
                                                              placeholder="填写监理单位报审金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="inspectUnitCheckFee">
                                                    <el-input v-model="submissionForm.inspectUnitCheckFee"
                                                              placeholder="填写监理单位核减金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="inspectUnitTel">
                                                    <el-input v-model="submissionForm.inspectUnitTel"
                                                              placeholder="填写监理单位联系电话"></el-input>
                                                </el-form-item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>建设单位</th>
                                            <td>
                                                <el-form-item prop="buildUnitApplyFee">
                                                    <el-input v-model="submissionForm.buildUnitApplyFee"
                                                              placeholder="填写建设单位报审金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="buildUnitCheckFee">
                                                    <el-input v-model="submissionForm.buildUnitCheckFee"
                                                              placeholder="填写建设单位报审金额"></el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item prop="buildUnitTel">
                                                    <el-input v-model="submissionForm.buildUnitTel"
                                                              placeholder="填写建设单位报审金额"></el-input>
                                                </el-form-item>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>项目内容</th>
                                <td colspan="3">
                                    <el-form-item prop="content">
                                        <el-input v-model="submissionForm.content" placeholder="填写项目内容"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>项目概况</th>
                                <td colspan="3">
                                    <el-form-item prop="description">
                                        <el-input v-model="submissionForm.description" placeholder="填写项目概况"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>资料清单组</th>
                                <td colspan="3">
                                    <el-form-item prop="materialGroup">
                                        <el-select v-model="submissionForm.materialGroup" placeholder="请选择"
                                                   @change="materialGroupChange">
                                            <el-option
                                                    v-for="group in materialGroups"
                                                    :key="group.id"
                                                    :label="group.name"
                                                    :value="group.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="compact-td">
                                    <table class="form-table">
                                        <tr>
                                            <th style="width:33%">资料清单</th>
                                            <th>附件</th>
                                            <th>备注</th>
                                        </tr>
                                        <tr v-for="fileType of this.submissionForm.details">
                                            <td>
                                                {{fileType.mName}}
                                            </td>
                                            <td>
                                                <el-upload
                                                        class="upload-demo"
                                                        action="noAction"
                                                        :http-request="upload"
                                                        :with-credentials="true"
                                                        :on-preview="handlePreview"
                                                        :on-remove="handleRemove"
                                                        :before-remove="beforeRemove"
                                                        :on-success="afterUpload"
                                                        :data="uploadParams"
                                                        multiple
                                                        :limit="3"
                                                        :on-exceed="handleExceed"
                                                        :file-list="fileType.mFiles">
                                                    <el-button size="small" type="primary" class="upload-btn"
                                                               @click="toUpload(fileType.mId)">点击上传
                                                    </el-button>
                                                </el-upload>
                                            </td>
                                            <td>
                                                <el-input v-model="fileType.mNote"
                                                          placeholder="填写备注"></el-input>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr class="print-info">
                                <th>送审部门盖章</th>
                                <td style="height: 100px;">

                                </td>
                                <th>审计部门盖章</th>
                                <td style="height: 100px;">

                                </td>
                            </tr>
                            <tr class="print-info">
                                <th>项目负责人</th>
                                <td>

                                </td>
                                <th>审计接收人</th>
                                <td>

                                </td>
                            </tr>
                            <tr class="print-info">
                                <th>送审人联系电话</th>
                                <td>

                                </td>
                                <th>接收时间</th>
                                <td>

                                </td>
                            </tr>
                        </table>
                    </el-form>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitSubmission()">确 定</el-button>
                <el-button @click="dialogVisible = false;print()">打印</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>


    import {Notification} from 'element-ui';
    import TableComponent from "./TableComponent";
    import MaterialFile from "../script/server/materialFile";
    import Upload from "../script/server/upload"
    import Submission from "../script/server/submission";

    export default {
        name: "AuditSubmission",
        created: function () {

        },
        mounted() {
            this.list()
            this.getMGroups()
        },
        watch: {
            dialogVisible: function (newVal, oldVal) {
                if (newVal) {
                    $(".upload-btn").show()
                }
            }
        },
        data: function () {
            return {
                dialogVisible: false,
                projectName: '',
                submissionForm: {
                    id: '',
                    itemCode: '',
                    auditNo: '',
                    contractNo: '',
                    projectName: '',
                    feeFrom: '',
                    budget: 0,
                    constructionUnit: '',
                    startDate: '',
                    endDate: '',
                    contractMoney: 0,
                    constructMoney: 0,
                    installMoney: 0,
                    constructionUnitApplyFee: 0,
                    constructionUnitCheckFee: 0,
                    constructionUnitTel: '',
                    inspectUnitApplyFee: 0,
                    inspectUnitCheckFee: 0,
                    inspectUnitTel: '',
                    buildUnitApplyFee: 0,
                    buildUnitCheckFee: 0,
                    buildUnitTel: '',
                    content: '',
                    description: '',
                    materialGroup: '',
                    details: []
                },
                rules: {
                    projectName: [
                        {required: true, message: '请输入工程项目名称', trigger: 'blur'},
                    ],
                    constructionUnit: [
                        {required: true, message: '请输入施工单位名称', trigger: 'blur'},
                    ],
                    budget: [
                        {required: true, message: '请填写预算', trigger: 'blur'},
                        {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                    ],
                    contractMoney: [
                        {required: true, message: '请填写中标或合同金额', trigger: 'blur'},
                        {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '请选择开工时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '请选择竣工时间', trigger: 'blur'}
                    ],
                    materialGroup: [
                        {required: true, message: '请选择资料清单组', trigger: 'blur'},
                    ],
                },
                materialGroups: [],
                tableConfig: {
                    data: [],
                    page: true,
                    total: 0,
                    currentPage: 1,
                    pageMethod: this.toPage,
                    cols: [
                        {prop: 'itemCode', label: '项目立项代码', width: '150'},
                        {prop: 'auditNo', label: '审计编号', width: '150'},
                        {prop: 'projectName', label: '工程项目名称', width: '220'},
                        {prop: 'constructionUnit', label: '施工单位名称', width: '220'},
                    ],
                    oper: [
                        {
                            class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                            tip: {content: '编辑', placement: 'top'},
                            event: this.editRow,
                        },
                        {
                            class: 'fa fa-trash-o fa-lg click-fa',
                            tip: {content: '删除', placement: 'right'},
                            event: this.deleteRow,
                            check: true
                        }
                    ]
                },
                uploadParams: {
                    id: '',
                }
            }
        },
        methods: {
            add: function () {
                this.dialogVisible = true
                //清空
                this.$nextTick(() => {
                    this.$refs['submissionForm'].resetFields();
                    this.submissionForm.details = []
                    $(".print-info").hide()
                });
            },
            editRow: function (row) {
                let comp = this
                //清空
                comp.submissionForm.details = []
                comp.$nextTick(() => {
                    $(".print-info").hide()
                });
                comp.dialogVisible = true
                //加载form
                Submission.getSubmission({id: row.id}).then(result => {
                    comp.submissionForm = result.submission
                    console.log(comp.submissionForm)
                    //填充清单组元数据信息到附件清单
                    MaterialFile.getMaterialGroup({id: comp.submissionForm.materialGroup}).then(res => {
                        for (let fType of res.materialGroup.details) {
                            let detail = comp.submissionForm.details.filter(f => f.mId === fType.material.id)[0]
                            if (detail) {
                                detail.mRequired = fType.material.required
                            } else {
                                comp.submissionForm.details.push({
                                    mRequired: fType.material.required,
                                    mId: fType.material.id,
                                    mName: fType.material.name,
                                    mFiles: [],
                                    mFileIds: '',
                                    mNote: ''
                                })
                            }
                        }
                    })
                })
            },
            deleteRow: function (row) {
                let comp = this
                Submission.deleteSubmission({id: row.id}).then(result => {
                    comp.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    comp.list({page: 1})
                })
            },
            commitSubmission: function () {
                let comp = this
                this.$refs['submissionForm'].validate((valid) => {
                    if (valid) {
                        //验证附件上传情况
                        for (let type of comp.submissionForm.details) {
                            if (type.mRequired) {
                                if ((!type.mFiles || type.mFiles.length === 0) && (!type.mNote || type.mNote.match(/^[ ]*$/))) {
                                    Notification.error({
                                        title: '提交失败!',
                                        message: type.mName + '必须上传附件或填写备注！',
                                        duration: 5000
                                    })
                                    return
                                }
                            }
                        }
                        //附件列表转换为serverId字符串
                        for (let types of comp.submissionForm.details) {
                            let ids = ''
                            for (let file of types.mFiles) {
                                ids = ids + ',' + file.serverId
                            }
                            types.mFileIds = ids.substr(1)
                        }
                        //提交单据
                        Submission.saveSubmission(comp.submissionForm).then(result => {
                            comp.dialogVisible = false
                            comp.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            comp.list({page: 1})
                        })
                    } else {
                        Notification.error({
                            title: '提交失败!',
                            message: '表单信息有误,请检查!',
                            duration: 2000
                        })
                        return false;
                    }
                });
            },
            print: function () {
                $(".upload-btn").hide()
                $(".print-info").show()
                $(".form").printArea({
                    importCSS: false
                })
            },
            handleRemove(file, fileList) {
                //从附件列表中移除该文件
                let comp = this
                for (let types of comp.submissionForm.details) {
                    let size = types.mFiles.length
                    if (size !== 0) {
                        types.mFiles = types.mFiles.filter(f => f.uid !== file.uid)
                        if (types.mFiles.length < size) {
                            break
                        }
                    }
                }
            },
            handlePreview(file) {
                window.open(file.url)
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            toPage: function (val) {
                this.list({page: val})
            },
            materialGroupChange: function (value) {
                //根据选择的清单组，初始化附加列表
                let comp = this
                MaterialFile.getMaterialGroup({id: value}).then(res => {
                    comp.submissionForm.details.length = []
                    for (let fType of res.materialGroup.details) {
                        comp.submissionForm.details.push({
                            mRequired: fType.material.required,
                            mId: fType.material.id,    //清单类型id
                            mName: fType.material.name,
                            mFiles: [], //上传的文件列表
                            mFileIds: '',  //上传的文件id集合(用于服务端接收 是mFiles数组中文件id的集合)
                            mNote: ''  //上传文件的备注
                        })
                    }
                })
            },
            toUpload(typeId) {
                //上传之前暂存当前要上传文件所属的清单组Id
                this.uploadParams.id = typeId
            },
            upload(content) {
                //自定义附件上传
                let comp = this
                let fd = new FormData()
                fd.append('formFile', content.file)
                Upload.upload(comp.uploadParams.id, fd, (event) => {
                    let num = event.loaded / event.total * 100 | 0;
                    content.onProgress({percent: num})
                }).then(res => {
                    content.onSuccess()
                    //在对应的清单组的附件列表中添加上传文件的信息{上传成功服务器返回的id,列表控件里的uid}
                    comp.submissionForm.details.filter(f => f.mId === comp.uploadParams.id)[0].mFiles.push({
                        'serverId': res.id,
                        'uid': content.file.uid,
                        'name': content.file.name
                    })
                })
            },
            list(pageConfig) {
                let data = {
                    page: 1,
                    pageSize: 10
                }
                for (let prop in pageConfig) {
                    data[prop] = pageConfig[prop]
                }
                this.tableConfig.currentPage = data.page
                Submission.getSubmissions(data).then(res => {
                    this.tableConfig.data = res.list.content
                    this.tableConfig.total = res.list.totalElements
                })
            },
            getMGroups() {
                MaterialFile.getMaterialGroups().then(res => {
                    this.materialGroups = res.list
                })
            }
        },
        components: {TableComponent}
    }
</script>

<style scoped>

</style>