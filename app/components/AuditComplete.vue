<template>
	<div class="card-content">
		<el-card class="box-card">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="query.projectName" placeholder="工程项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="queryList">查询</el-button>
				</el-form-item>
			</el-form>
			<table-component v-bind:tableConfig="tableConfig">
			</table-component>
		</el-card>
		<submission-form v-bind:visible="dialogVisible" v-bind:from="'editform'" v-bind:step="'auditArc'" v-bind:formId="formId">
		</submission-form>
		<audit-note-form v-bind:visible="noteFormVisible" v-bind:formId="formId"></audit-note-form>
	</div>
</template>

<script>
	import AuditNoteForm from './AuditNoteForm'
	import Config from "../script/config";
	import Audit from "../script/server/audit";
	import TableComponent from "./TableComponent";
	import SubmissionForm from "./SubmissionForm";

	export default {
		name: "AuditComplete",
		mounted: function() {
			this.list()
		},
		data: function() {
			return {
				query: {
					projectName: '',
				},
				dialogVisible: false,
				noteFormVisible: false,
				tableConfig: {
					data: [],
					page: true,
					total: 0,
					currentPage: 1,
					pageMethod: this.toPage,
					checkable: false,
					cols: [{
							prop: 'itemCode',
							label: '项目立项代码',
							width: '150'
						},
						{
							prop: 'auditNo',
							label: '审计编号',
							width: '150'
						},
						{
							prop: 'projectName',
							label: '工程项目名称',
							width: '220'
						},
						{
							prop: 'constructionUnit',
							label: '施工单位名称',
							width: '220'
						},
					],
					oper: [{
							class: 'fa fa-pencil-square-o fa-lg click-fa success-fa',
							tip: {
								content: '查看',
								placement: 'top'
							},
							event: this.editRow,
						},
						{
							class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
							tip: {
								content: '生成通知单',
								placement: 'right'
							},
							event: this.genNoteForm,
						},
					]
				},
			}
		},
		methods: {
			genNoteForm: function(row) {
				this.noteFormVisible = false
				this.dialogVisible = false
				this.noteFormVisible = true
				this.formId = row.id
			},
			editRow: function(row) {
				this.noteFormVisible = false
				this.dialogVisible = false
				this.dialogVisible = true
				this.formId = row.id
			},
			queryList: function() {
				this.list(this.query)
			},
			toPage: function(val) {
				this.list({
					page: val
				})
			},
			list(config) {
				let data = { ...Config.page
				}
				for (let prop in config) {
					data[prop] = config[prop]
				}
				data['status'] = Config.stepCode.auditComplete
				this.tableConfig.currentPage = data.page
				Audit.getSubmissions(data).then(res => {
					//如果以后多选框,清除所选数据
					this.tableConfig.data = res.list.content
					this.tableConfig.total = res.list.totalElements
				})
			},
			operSuccess() {
				this.dialogVisible = false
				this.noteFormVisible = false;
				this.$message({
					message: '操作成功',
					type: 'success'
				});
				this.list({
					page: 1
				})
			}
		},
		components: {
			AuditNoteForm,
			TableComponent,
			SubmissionForm
		}
	}
</script>

<style scoped>

</style>
