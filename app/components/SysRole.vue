<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="roleName" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>

    export default {
        name: "SysRole",
        created: function () {

        },
        data: function () {
            return {
                roleName:''
            }
        },
        methods: {},
    }
</script>

<style scoped>

</style>