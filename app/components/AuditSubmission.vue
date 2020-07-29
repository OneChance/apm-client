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
                   @click="dialogVisible=true"></i>
            </el-form>

            <table-component v-bind:tableConfig="tableConfig"></table-component>

        </el-card>

        <el-dialog :title="工程结算送审表"
                   class="form-dialog"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <template>
                <div class="test">
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
                                    <el-input v-model="submissionForm.itemCode"></el-input>
                                </td>
                                <th>审计编号</th>
                                <td>
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>合同编码</th>
                                <td>
                                    <el-input v-model="submissionForm.contractNo"></el-input>
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
                                    <el-input v-model="submissionForm.feeFrom" placeholder="填写经费来源"></el-input>
                                </td>
                                <th>预算(万元)</th>
                                <td>
                                    <el-input v-model="submissionForm.budget" placeholder="填写预算"></el-input>
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
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </td>
                                <th>竣工时间<span style="color: red; ">*</span></th>
                                <td>
                                    <el-date-picker
                                            v-model="submissionForm.endDate"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
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
                                    <el-input v-model="submissionForm.constructMoney"
                                              placeholder="填写土建金额"></el-input>
                                </td>
                                <th>安装</th>
                                <td>
                                    <el-input v-model="submissionForm.installMoney" placeholder="填写安装金额"></el-input>
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
                                                <el-input v-model="submissionForm.constructionUnitApplyFee"
                                                          placeholder="填写施工单位报审金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.constructionUnitCheckFee"
                                                          placeholder="填写施工单位核减金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.constructionUnitTel"
                                                          placeholder="施工单位联系电话"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>监理单位</th>
                                            <td>
                                                <el-input v-model="submissionForm.inspectUnitApplyFee"
                                                          placeholder="填写监理单位报审金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.inspectUnitCheckFee"
                                                          placeholder="填写监理单位核减金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.inspectUnitTel"
                                                          placeholder="填写监理单位联系电话"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>建设单位</th>
                                            <td>
                                                <el-input v-model="submissionForm.buildUnitApplyFee"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.buildUnitCheckFee"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.buildUnitTel"
                                                          placeholder="填写建设单位报审金额"></el-input>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>项目内容</th>
                                <td colspan="3">
                                    <el-input v-model="submissionForm.content" placeholder="填写项目内容"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>项目概况</th>
                                <td colspan="3">
                                    <el-input v-model="submissionForm.description" placeholder="填写项目概况"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>资料组</th>
                                <td colspan="3">
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option
                                                v-for="group in materialGroups"
                                                :key="group.id"
                                                :label="group.name"
                                                :value="group.name">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="compact-td">
                                    <table class="form-table">
                                        <tr>
                                            <th style="width:33%">资料清单</th>
                                            <th>数量</th>
                                            <th>备注</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                监理单位（报审单位）送审结算书
                                            </td>
                                            <td>
                                                <el-upload
                                                        class="upload-demo"
                                                        action="https://jsonplaceholder.typicode.com/posts/"
                                                        :on-preview="handlePreview"
                                                        :on-remove="handleRemove"
                                                        :before-remove="beforeRemove"
                                                        multiple
                                                        :limit="3"
                                                        :on-exceed="handleExceed"
                                                        :file-list="fileList1">
                                                    <el-button size="small" type="primary" class="upload-btn">点击上传
                                                    </el-button>
                                                </el-upload>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"
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
                                    <el-input v-model="submissionForm.projectLeader" placeholder="填写项目负责人"></el-input>
                                </td>
                                <th>审计接收人</th>
                                <td>
                                    <el-input v-model="submissionForm.auditReceiver" placeholder="填写审计接收人"></el-input>
                                </td>
                            </tr>
                            <tr class="print-info">
                                <th>送审人联系电话</th>
                                <td>
                                    <el-input v-model="submissionForm.submissionTel" placeholder="填写送审人联系电话"></el-input>
                                </td>
                                <th>接收时间</th>
                                <td>
                                    <el-date-picker
                                            v-model="receiveDate"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
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

    export default {
        name: "AuditSubmission",
        created: function () {

        },
        mounted() {
            this.$nextTick(() => {
                console.log($(".print-info"))
                //$(".print-info").hide()
            });
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
                forms: [],
                dialogVisible: false,
                projectName: '',
                submissionForm: {
                    itemCode: '',
                    auditNo: '',
                    contractNo: '',
                    projectName: '',
                    feeFrom: '',
                    budget: '',
                    constructionUnit: '',
                    startDate: '',
                    endDate: '',
                    contractMoney: '',
                    constructMoney: '',
                    constructionUnitApplyFee: '',
                    constructionUnitCheckFee: '',
                    constructionUnitTel: '',
                    inspectUnitApplyFee: '',
                    inspectUnitCheckFee: '',
                    inspectUnitTel: '',
                    buildUnitApplyFee: '',
                    buildUnitCheckFee: '',
                    buildUnitTel: '',
                    content: '',
                    description: '',
                    projectLeader: '',
                    auditReceiver: '',
                    submissionTel: '',
                    receiveDate: '',
                },
                rules: {
                    projectName: [
                        {required: true, message: '请输入工程项目名称', trigger: 'blur'},
                    ],
                    constructionUnit: [
                        {required: true, message: '请输入施工单位名称', trigger: 'blur'},
                    ],
                    contractMoney: [
                        {required: true, message: '请填写中标或合同金额', trigger: 'blur'},
                        {type: 'number', min: 0, message: '金额必须为正数', trigger: 'blur'}
                    ],
                    startDate: [
                        {type: 'date', required: true, message: '请选择开工时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {type: 'date', required: true, message: '请选择竣工时间', trigger: 'blur'}
                    ],
                },
                fileList1: [{
                    name: 'pda',
                    url: 'https://m.baidu.com/sf/vsearch?pd=image_content&word=%E9%AB%98%E8%BE%BE%E5%A4%B4%E5%83%8F&tn=vsearch&atn=mediacy&fr=index&sa=ts_2&imgtype=0&imgpn=1&imgspn=0&imgcontent=%7B%22subjectJson%22%3A%7B%22tagname%22%3A%22%E5%A4%B4%E5%83%8F%22%2C%22subject_type%22%3A3%2C%22entityname%22%3A%22%E9%AB%98%E8%BE%BE%22%7D%7D&mediacyKey=undefined&tt=1&di=38170&pi=0&cs=2439081361%2C1326926205&adpicid=&bdtype=0&objurl=https%3A%2F%2Ftimgsa.baidu.com%2Ftimg%3Fimage%26quality%3D80%26size%3Db9999_10000%26sec%3D1595908496653%26di%3D937024bd253c7230e3b558431f9b09f7%26imgtype%3D0%26src%3Dhttp%253A%252F%252Fwww.jf258.com%252Fuploads%252F2013-08-09%252F045809775.jpg&imgos=2371011960%2C15442097&imgis=0%2C0&isRecFrClick=0'
                }],
                fileList2: [],
                materialGroups: [{id: 1, name: '工程部'}, {id: 2, name: '技术部'}],
                tableConfig: {
                    data: [],
                    page: true,
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
            }
        },
        methods: {
            editRow: function () {

            },
            deleteRow: function () {

            },
            commitSubmission: function () {
                let comp = this
                this.$refs['submissionForm'].validate((valid) => {
                    if (valid) {
                        comp.dialogVisible = false
                        Notification.success({
                            title: '提交成功!',
                            message: '',
                            duration: 2000
                        })
                        comp.forms.push(comp.submissionForm)
                    } else {
                        Notification.error({
                            title: '提交失败!',
                            message: '表单信息有误,请检查!',
                            duration: 2000
                        })
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            print: function () {
                $(".upload-btn").hide()
                $(".print-info").show()
                $(".test").printArea({
                    importCSS: false
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                window.open(file.url)
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            toPage: function (val) {
                console.log('to page :' + val);
            },
        },
        components: {TableComponent}
    }
</script>

<style scoped>

</style>