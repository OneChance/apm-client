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

            <el-table
                    :data="roles"
                    border
                    style="width: 100%">
                <el-table-column
                        prop=""
                        label="项目立项代码"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="审计编号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="工程项目名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="施工单位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="roleOper"
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="dialogVisible=true;editRow(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa" @click="deleteRow()"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    class="page-nav"
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="100">
            </el-pagination>
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
                                <th>工程项目名称</th>
                                <td>
                                    <el-form-item prop="projectName">
                                        <el-input v-model="submissionForm.projectName"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th>经费来源</th>
                                <td>
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                                <th>预算(万元)</th>
                                <td>
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>施工单位名称</th>
                                <td colspan="3">
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>开工时间</th>
                                <td>
                                    <el-date-picker
                                            v-model="value1"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </td>
                                <th>竣工时间</th>
                                <td>
                                    <el-date-picker
                                            v-model="value1"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </td>
                            </tr>
                            <tr>
                                <th rowspan="2">中标合同金额</th>
                                <td rowspan="2">
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                                <th>土建</th>
                                <td>
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>安装</th>
                                <td>
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
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
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>监理单位</th>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>建设单位</th>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>项目内容</th>
                                <td colspan="3">
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <th>项目概况</th>
                                <td colspan="3">
                                    <el-input v-model="submissionForm.auditNo"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
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
                                                        :file-list="fileList">
                                                    <el-button size="small" type="primary">点击上传</el-button>
                                                </el-upload>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                施工单位结算书
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
                                                        :file-list="fileList2">
                                                    <el-button size="small" type="primary">点击上传</el-button>
                                                </el-upload>
                                            </td>
                                            <td>
                                                <el-input v-model="submissionForm.auditNo"></el-input>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>送审部门盖章</th>
                                <td style="height: 100px;">

                                </td>
                                <th>审计部门盖章</th>
                                <td style="height: 100px;">

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

    import Common from '../script/common'
    import printArea from '../plugin/printarea/jquery.PrintArea'

    export default {
        name: "AuditSubmission",
        created: function () {

        },
        mounted() {
        },
        data: function () {
            return {
                dialogVisible: false,
                projectName: '',
                submissionForm: {
                    itemCode: '',
                    auditNo: '',
                    contractNo: '',
                    projectName: '',
                },
                rules: {
                    projectName: [
                        {required: true, message: '请输入工程项目名称', trigger: 'blur'},
                    ],
                },
                fileList1: [],
                fileList2: [],
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
                        console.log('success')
                        comp.dialogVisible = false
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            print: function () {
                /*let printWindow = window.open("", "打印页");
                printWindow.document.write("" +
                    "<table>" +
                    "<tr><th colspan='10'>扬州大学工程结算送审表</th></tr>" +
                    "<tr><th>立项代码</th><td>" + this.submissionForm.itemCode + "</td><th>审计编号</th><td>" + this.submissionForm.auditNo + "</td><th>合同编码</th><td>" + this.submissionForm.contractNo + "</td></tr>" +
                    "</table>" + Common.printStyle() + ""
                );
                printWindow.window.print();*/
                $(".test").printArea({
                    importCSS: false
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            }
        },
    }
</script>

<style scoped>

</style>